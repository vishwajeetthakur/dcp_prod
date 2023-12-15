// License
LicenseInfo.setLicenseKey('ed688e7cd31992d06366758194e2115dTz00NjY1OSxFPTE2ODgzMDc1NTM5MTYsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=')

// Packages
import { Buffer } from 'buffer'
import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import FileDownload from 'js-file-download'
import { LicenseInfo } from '@mui/x-license-pro'
import { Paper, Chip, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'
import { useGridApiRef } from '@mui/x-data-grid-pro'

import { 
    Grid
} from '@mui/material'

//  Components
import CustomTableForm from "./CustomTableForm"
import CustomTableButtons from './CustomTableButtons'
import CustomTableVisualsModal from '../visualizations/CustomTableVisualsModal'

// Utilities
import { actions } from '../../../store'

// Styles
import { StyledDataGrid } from '../styled.components'


export function generateUri(tableState) {
    const tableUriObject = {
        ...(tableState.specifyColumns ? { columns : tableState.columns.map(column => column.field).join() } : {}),
        sort: tableState.sortModel?.[0] ? [[tableState?.sortModel?.[0]?.field, tableState?.sortModel[0]?.sort]] : null,
        filter: updateFilter(tableState),
        page: tableState.page,
        pageSize: tableState.pageSize,
        include: tableState.include
    }


    const tableUriArray =
        Object.entries(tableUriObject)
            .filter(([, value]) => value)
            .map(([key, value]) => `${key}=${(typeof value == 'string') ? value : JSON.stringify(value)}`)

    if (
        Object.keys(tableState).includes('include') &&
        // Only get options if table is editable
        (
            tableState.tableButtons.includes('c') || 
            tableState.tableButtons.includes('e')
        )
    ) {
            tableUriArray.push('options=true')
    }

    return '?' + tableUriArray.join('&')
}


function generateUrl(tableState) {
    return tableState.url.split('?')[0] + generateUri(tableState)
}


function updateFilter({filterModel, url}) {
    const existingUrlFilter = 
        url.match(/filter=(.*?)(?:&|$)/)
            ?.[1]
            ?.split(',')
        || []

    return [
        ...filterModel
            ?.items
            ?.map(({ columnField, operatorValue, value }) => {

                value =
                    (value != undefined)
                        ? value
                        : (operatorValue == 'isAnyOf')
                            ? ['']
                            : ''

                switch (operatorValue) {
                    // string
                    case 'contains': return `${columnField}~${(value.includes('%')) ? value.replace(/%/g, '%25') : `%25${value}%25`}`
                    case 'equals': return `${columnField}=${value}`
                    case 'startsWith': return `${columnField}^=${value}`
                    case 'endsWith': return `${columnField}$=${value}`
                    case 'isEmpty': return `${columnField}=null`
                    case 'isNotEmpty': return `${columnField}!=null`
                    case 'isAnyOf': return value.map(v => `${columnField}=${v}`).join(',')
                    // number
                    case '=': return `${columnField}=${value}`
                    case '!=': return `${columnField}!=${value}`
                    case '<': return `${columnField}<${value}`
                    case '<=': return `${columnField}<=${value}`
                    case '>': return `${columnField}>${value}`
                    case '>=': return `${columnField}>=${value}`
                    // boolean
                    case 'is': return value != '' ? `${columnField}=${value}` : ''
                    // date
                    case 'not': return `${columnField}!=${value}`
                    case 'after': return `${columnField}>${value}`
                    case 'onOrAfter': return `${columnField}>=${value}`
                    case 'before': return `${columnField}<${value}`
                    case 'onOrBefore': return `${columnField}<=${value}`
                }
            }) || [],
        ...existingUrlFilter   
    ].join(',')
    
}


const CustomTable = ({ 
    url, 
    columns, 
    data, 
    pageSize, 
    pageSizeOptions, 
    sort, 
    filter, 
    tableButtons, 
    apiRef, 
    stateSave,
    onFetchData,
    toolbarRight,
    ...args 
}) => {
    
    //Hooks
    const dispatch = useDispatch()
    const { menus } = useSelector(state => state.globalStates)
    const showAlert = (type, message) => dispatch(actions.createAlert({ message, type }))

    const [editAndDeleteButtonDisabled, setEditAndDeleteButtonDisabled] = useState(true)
    const [filteredButtonDisabled, setFilteredButtonDisabled] = useState(true)

    const [key, ] = useState(Buffer.from(`${window.location.origin}${window.location.pathname}:${url?.split('?')?.[0]}`).toString('base64'))
    const [initialState, ] = useState(
        (() => {
            if (stateSave == false) return args.initialState || null

            const savedValue = sessionStorage.getItem(key)
            const initialValue = JSON.parse(savedValue)

            return initialValue || args.initialState
        })()
    )

    if (!apiRef) apiRef = useGridApiRef()

    // Table state
    const [tableState, setTableState] = useState({
        key,
        url,
        isLoading: false,
        data: data ? data : [],
        total: data ? data.length : 0,
        page: 1,
        pageSize: (pageSize) ? pageSize : 10,
        pageSizeOptions: (pageSizeOptions) ? pageSizeOptions : [10, 50, 100],
        sortModel: initialState?.sorting?.sortModel,
        filterModel: initialState?.filter?.filterModel,
        selectedRow: null,
        tableButtons: 
            ['', null].includes(tableButtons) 
                ? ''
                : tableButtons
                    ? tableButtons 
                    : url
                        ? 'xf'
                        : 'f',
        columns,
        ...args,
        ...initialState ? {initialState} : {},
    })

    // Generate columns, using in a useEffect allows the column state consistency
    const [tableColumns, setTableColumns] = useState(null)
    useEffect(() => {
        const _tableColumns =
            (!columns.length)
                ? Object.keys(data.data[0]).map((column, index, array) => {
                    return {
                        field: column,
                        headerName: column.toUpperCase().replace(/_/g, ' '),
                        disabled: column == 'id',
                        ...(array.length <= 5) ? { flex: 1 } : { width: 200 },
                        renderCell: params => {
                            if (params?.value?.length > 20) {
                                return (
                                    <Tooltip title={params.value} placement='top'>
                                        <span >{params.value}</span>
                                    </Tooltip>)
                            }
                            return null;
                        }

                    }
                })
                : columns
                    .filter(col => !col.hidden)
                    .map((column, index) => {
                        const columnDefaults = {
                            ...(columns.length <= 5) ? { flex: 1 } : { width: 200 },
                        }
                        if (column.field.includes('.')) {
                            const [tableName, columnName] = column.field.split('.')

                            columnDefaults.renderCell = ({ row }) => {
                                if (!/c|e|d/.test(tableButtons)) {
                                    return (Array.isArray(row[tableName]))
                                        ? row[tableName].map(item => item[columnName]).join(', ')
                                        : (row[tableName])
                                            ? row[tableName][columnName]
                                            : null
                                }

                                // const customChip =
                                //     ((tableButtons?.includes('c') || tableButtons?.includes('e') || tableButtons?.includes('d')) && column.readOnly)
                                //         ? { variant: 'outlined' }
                                //         : {}

                                return (Array.isArray(row[tableName]))
                                    ? row[tableName].map(item => item[columnName]).join(', ') // <Chip {...customChip} label={item[columnName]}></Chip>
                                    : (row[tableName])
                                        ? row[tableName][columnName] // <Chip {...customChip} label={row[tableName][columnName]}></Chip>
                                        : null

                            }
                        }

                        return {
                            ...columnDefaults,
                            ...column // This will overwrite the column defaults
                        }
                    })

        setTableColumns(_tableColumns)
    }, [])
    
    // Fetch data and reload
    const fetchData = () => {
        if (onFetchData) onFetchData()

        setTableState(state => ({ ...state, isLoading: true }))

        const controller = new AbortController()

        axios
            .get(
                generateUrl(tableState), 
                { signal: controller.signal } 
            )
            .then(({data}) => {
                setTableState(state => {
                    return {
                        ...state,
                        total: data?.metadata?.total,
                        isLoading: false,
                        data: data?.data,
                        metadata: data?.metadata,
                        selectedRow: data?.data?.find(row => row.id == state.selectedRow?.id) || null
                    }
                })
            })
            .catch(e => {
                if (e.name != 'CanceledError') {
                    console.error(e)
                    setTableState(state => ({ ...state, isLoading: false }))
                    showAlert('error', e.message)
                }
            })

        return controller

        // Original fetch method

        // try {
        //     let response = await fetch(generateUrl(tableState))
        //     response = await response.json();
        //     if (response) {
        //         setTableState(state => {
        //             return {
        //                 ...state,
        //                 total: response?.metadata?.total,
        //                 isLoading: false,
        //                 data: response?.data,
        //                 metadata: response?.metadata,
        //                 selectedRow: response?.data?.find(row => row.id == state.selectedRow?.id) || null
        //             }
        //         })
        //     } else {
        //         setTableState(state => ({ ...state, isLoading: false }))
        //     }
        // } catch (error) {
        //     console.log(error)
        //     setTableState(state => ({ ...state, isLoading: false }))
        // }
    }

    useEffect(() => {
        if (!tableState.url) return

        const controller = fetchData()

        // Clean up method to cancel request
        return () => controller.abort()
    }, [tableState.page, tableState.pageSize, tableState.sortModel, tableState.filterModel])

    // Buttons
    // Export
    const exportTable = () => {
        axios({
            url: tableState.url.replace(/\?.*?$/, '') + '/export' + generateUri(tableState) + '&columns=' + tableColumns.map(c => c.field).join(),
            method: 'GET',
            responseType: 'blob', // Important
          }).then((response) => {
              FileDownload(response.data, 'export.xlsx');
          })
    }
    // Filter
    const removeFilter = () => apiRef.current.setFilterModel({items: []})

    // Form
    const [formOpen, setFormOpen] = useState({ open: false });

    const handleOpenEdit = useCallback(() => setFormOpen({ open: true, mode: 'edit' }), [])
    const handleOpenCreate = useCallback(() => setFormOpen({ open: true, mode: 'create' }), [])
    const handleClose = useCallback(() => setFormOpen({ open: false }), []);
    const handleDelete = useCallback(() => setFormOpen({ open: true, mode: 'delete' }), [])

    // Deleting an element
    const deleteHandler = async (id) => {
        setFormOpen({ open: false })
        try {
            //const promiseResponse = await Promise.all(promises)
            const response = await axios.delete(tableState.url.split('?')[0] + '?id=' + id)

            if (response.status == 200) showAlert('success', 'Row successfully deleted')
            else showAlert('error', `${response.status}: ${response.data}`)

            fetchData()
        } catch (error) {
            console.error(error)
            showAlert('error', `${error.response.status}: ${error.response.data}`)
        }

        setTableState(state => ({ ...state, selectedRow: null }))

        setEditAndDeleteButtonDisabled(true)
    }

    // updating or creating an element
    const createHandler = async (values) => {
        if (args.onCreate) values = args.onCreate(values, tableState.metadata)
        setFormOpen({ open: false })

        try {
            const url = tableState.url
            const method = 'POST'

            // One-One / One-Many associations
            const relationshipColumns = tableColumns.filter(column => Object.keys(column).includes('relationship'))
            if (relationshipColumns.length) {
                relationshipColumns.forEach(rColumn => {
                    const remoteTable = rColumn.field.split('.')[0]
                    const localColumn = rColumn.relationship[remoteTable + '.id']

                    if (!localColumn) console.error('Error with table: ' + remoteTable + '. Missing ID column declaration. If this is an aliased column you will need to supply <aliased_column>.id')

                    values[localColumn] = values[remoteTable]?.id || null
                    delete values[remoteTable]
                })
            }

            // Extract values from type: select columns
            const data = Object.entries(values).reduce((acc, [k, v]) => Object.assign(acc, { [k]: v?.value || v }), {})


            // console.log('data in CustomTable: ', data, keycloakUser)

            // data.last_edited = new Date().toISOString() 
            // data.last_edited_by = keycloakUser?.data?.username

            const response = await axios({ url, method, data })

            // Many-Many associations ("through" tables)
            const throughColumns = tableColumns.filter(column => Object.keys(column).includes('through'))
            if (throughColumns.length) {
                const createPromises = throughColumns.map(column => {
                    return new Promise(async (resolve, reject) => {
                        const remoteTable = column.field.split('.')[0]

                        if (!values[remoteTable]) return resolve()

                        const newRowId = response.data.data[0].id
                        const throughTable = column.through.table
                        const throughRelationships = column.through.relationships
                        const throughValues = values[remoteTable].map(value => {
                            return {
                                [throughRelationships.id]: newRowId,
                                [throughRelationships[remoteTable + '.id']]: value.id
                            }
                        })

                        const throughResponse = await axios({ url: '/api/eset_db/' + throughTable, method: 'POST', data: throughValues })
                        resolve(throughResponse)
                    })
                })

                const promiseResponse = await Promise.all(createPromises)
            }

            if (response.status == 200) showAlert('success', 'Row created successfully')
            else showAlert('error', `${response.status}: ${response.data}`)

            fetchData()
        } catch (error) {
            console.error(error)
            showAlert('error', `${error.response.status}: ${error.response.data}`)
        }
    }

    // Handle edit
    const editHandler = async (values, mode) => {
        if (args.onEdit) values = args.onEdit(values, tableState.metadata)
        else if (args.onUpdate) values = args.onUpdate(values, tableState.metadata)

        setFormOpen({ open: false })

        try {
            const url = tableState.url.split('?')[0] + '?id=' + values.id
            const method = 'PUT'

            // One-One / One-Many associations
            const relationshipColumns = tableColumns.filter(column => Object.keys(column).includes('relationship'))
            if (relationshipColumns.length) {
                relationshipColumns.forEach(rColumn => {
                    const remoteTable = rColumn.field.split('.')[0]
                    const localColumn = rColumn.relationship[remoteTable + '.id']

                    if (!localColumn) console.error('Error with table: ' + remoteTable + '. Missing ID column declaration. If this is an aliased column you will need to supply <aliased_column>.id')

                    values[localColumn] = values[remoteTable]?.id || null
                    delete values[remoteTable]
                })
            }

            // Extract values from type: select columns
            const data = Object.entries(values).reduce((acc, [k, v]) => Object.assign(acc, { [k]: v?.value || v }), {})

            const response = await axios({ url, method, data })

            // Many-Many associations ("through" tables)
            const throughColumns = tableColumns.filter(column => Object.keys(column).includes('through'))

            if (throughColumns.length) {
                const deletePromises = throughColumns.map(column => {
                    return new Promise(async (resolve, reject) => {

                        const throughTable = column.through.table

                        if (!values[throughTable].length) return resolve()

                        const throughResponse = await axios({ url: '/api/eset_db/' + throughTable, method: 'DELETE', data: values[throughTable] })
                        resolve(throughResponse)
                    })
                })

                const deletePromiseResponse = await Promise.all(deletePromises)
                // console.log({ deletePromiseResponse })

                const createPromises = throughColumns.map(column => {
                    return new Promise(async (resolve, reject) => {
                        const remoteTable = column.field.split('.')[0]

                        if (!values[remoteTable]) return resolve()

                        const throughTable = column.through.table
                        const throughRelationships = column.through.relationships
                        const throughValues = values[remoteTable].map(value => {
                            return {
                                [throughRelationships.id]: values.id,
                                [throughRelationships[remoteTable + '.id']]: value.id
                            }
                        })

                        if (!throughValues.length) return resolve()
                        const throughResponse = await axios({ url: '/api/eset_db/' + throughTable, method: 'POST', data: throughValues })
                        resolve(throughResponse)
                    })
                })

                const createPromiseResponse = await Promise.all(createPromises)
                console.log({ createPromiseResponse })
            }
            // console.log(response, 'responseGGG')
            if (response.status == 200) showAlert('success', 'Row updated successfully')
            else showAlert('error', `${response.status}: ${response.data}`)

            fetchData()

            setTableState(state => ({
                ...state,
                selectedRow: {
                    ...state.selectedRow,
                    ...values,
                }
            }))

        } catch (error) {
            console.error(error)
            showAlert('error', `${error.response.status}: ${error.response.data}`)
        }
    }

    if (!tableColumns) return null

    return (
        <Paper sx={{ p: 2, textAlign: 'left' }} elevation={14}>
            {formOpen.open &&
                <CustomTableForm
                    aria-label="custom-table-form"
                    handleClose={handleClose}
                    input={tableState.selectedRow}
                    createHandler={(entry) => createHandler(entry)}
                    editHandler={(entry) => editHandler(entry)}
                    deleteHandler={(id) => deleteHandler(id)}
                    columns={columns}
                    metadata={tableState.metadata}
                    tableState={tableState}
                    {...formOpen}
                />
            }

            {menus['visualization-modal'] && (
                <CustomTableVisualsModal
                    aria-labal="custom-table-visuals-modal"
                    handleClose={() => dispatch(actions.handleMenu({ key: 'visualization-modal', value: false }))}
                    tableState={tableState}
                    open={menus['visualization-modal']}
                />
            )}

            <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
                <Grid item xs={6}>
                    <CustomTableButtons
                        aria-label="custom-table-buttons"
                        tableButtons={tableState.tableButtons}
                        handleOpenCreate={handleOpenCreate}
                        editAndDeleteButtonDisabled={editAndDeleteButtonDisabled}
                        filteredButtonDisabled={filteredButtonDisabled}
                        removeFilter={removeFilter}
                        exportTable={exportTable}
                        handleOpenEdit={() => handleOpenEdit(tableState)}
                        handleDelete={handleDelete}
                        openVisualizationsModal={() => dispatch(actions.handleMenu({ key: 'visualization-modal', value: true }))}
                    />
                </Grid>
                <Grid item xs={6}>
                    { toolbarRight && toolbarRight(apiRef) }
                </Grid>
            </Grid>
            

            <StyledDataGrid
                aria-label="custom-table"
                density='compact'
                autoHeight
                autoWidth
                columns={tableColumns}
                rowCount={tableState.total}
                rows={tableState.data}
                loading={tableState.isLoading}

                // Pagination
                rowsPerPageOptions={tableState.pageSizeOptions}
                pagination
                pageSize= {tableState.pageSize}
                page={tableState.page - 1}
                onPageChange={(newPage) => {
                    setTableState(state => ({ ...state, page: newPage + 1 }))
                }}
                onPageSizeChange={(newPageSize) => setTableState(state => ({ ...state, pageSize: newPageSize }))}
                {
                    ...(tableState.url) 
                    ? {
                        paginationMode: 'server',
                        
                    } 
                    : { }
                }

                

                // Sorting
                {...(tableState.url) ? {sortingMode: 'server'} : {}}
                onSortModelChange={(sortModel) => {
                    setTableState(state => ({ ...state, sortModel }))
                }}

                // Filtering
                {...(tableState.url) ? {filterMode: 'server'} : {}}
                onFilterModelChange={(filterModel) => {
                    setTableState(state => ({ ...state, filterModel }))
                }}

                // Selection
                disableMultipleSelection={true}
                keepNonExistentRowsSelected
                onSelectionModelChange={selectionModel => {
                    const selectedRow =
                        (tableState.selectedRow?.id == selectionModel[0])
                            ? null
                            : tableState.data.find(row => row.id == selectionModel[0])

                    setEditAndDeleteButtonDisabled(!selectedRow)

                    setTableState(state => ({ ...state, selectedRow }))
                }}
                selectionModel={tableState.selectedRow?.id || []}

                apiRef={apiRef}
                {...tableState.initialState ? {initialState: tableState.initialState} : {}}
                onStateChange={(state) => {
                    setFilteredButtonDisabled(!state.filter?.filterModel?.items?.length)
                    sessionStorage.setItem(tableState.key, JSON.stringify(state))
                }}

                {...args}
            />
        </Paper>
    )
}

export default CustomTable

CustomTable.propTypes = {
    url: PropTypes.string,
    columns: PropTypes.array,
    data: PropTypes.array,
    pageSize: PropTypes.string,
    pageSizeOptions: PropTypes.array,
    initialState: PropTypes.object,
    tableButtons: PropTypes.string,
    args: PropTypes.any,
}