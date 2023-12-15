// License
import { LicenseInfo } from '@mui/x-license-pro'
LicenseInfo.setLicenseKey('ed688e7cd31992d06366758194e2115dTz00NjY1OSxFPTE2ODgzMDc1NTM5MTYsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=')

// Packages
import { Buffer } from 'buffer'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import FileDownload from 'js-file-download'
import { Paper, Grid } from '@mui/material'
import PropTypes from 'prop-types'
import { useGridApiRef } from '@mui/x-data-grid-pro'

//  Components
import CustomTableForm from "./CustomTableForm"
import CustomTableButtons from './CustomTableButtons'
import CustomTableVisualsModal from '../visualizations/CustomTableVisualsModal'

// Utilities
import { actions } from '../../../store'
import { generateUrl, generateUri, generateColumns, getTableName, getTableAndColumnName } from './helpers'
import { createHandler, editHandler, deleteHandler } from './formActions'

// Styles
import { StyledDataGrid } from '../styled.components'


const CustomTable = ({
    url,
    table,
    columns,
    data,
    pageSize,
    pageSizeOptions,
    sort,
    filter,
    loadOptions,
    tableButtons,
    customTableButtons,
    apiRef,
    multiSelect,
    stateSave,
    onFetchData,
    toolbarRight,
    onSelect,
    events,
    reloadTable,
    setReloadTable,
    onCreateOpen,
    onEditOpen,
    onDeleteOpen,
    ...args
}) => {

    //Hooks
    const dispatch = useDispatch()
    const { menus } = useSelector(state => state.globalStates)
    const showAlert = (type, message) => dispatch(actions.createAlert({ message, type }))

    // State save
    const [key,] = useState(Buffer.from(`${window.location.origin}${window.location.pathname}:${url?.split('?')?.[0] || table}`).toString('base64'))
    const [initialState,] = useState(
        (() => {
            if (stateSave == false) return args.initialState || null

            const savedValue = sessionStorage.getItem(key)
            const initialValue = JSON.parse(savedValue)

            return initialValue || args.initialState
        })()
    )

    const [formMode, setFormMode] = useState('closed')
    const [editAndDeleteButtonDisabled, setEditAndDeleteButtonDisabled] = useState(true)
    const [filteredButtonDisabled, setFilteredButtonDisabled] = useState(true)

    // Table state
    const [tableState, setTableState] = useState({
        key,
        url: 
            url
                ? url
                : table
                    ? '/api/eset_db/' + table
                    : null,
        table: table ? table : url.match(/\/(\w+)(?:$|\?)/)?.[1],
        isLoading: false,
        data: data ? data : [],
        total: data ? data.length : 0,
        page: initialState?.pagination ? initialState.pagination.page + 1 : 1,
        pageSize: pageSize ? pageSize : 10,
        pageSizeOptions: pageSizeOptions ? pageSizeOptions : [10, 50, 100],
        sortModel: initialState?.sorting?.sortModel,
        filterModel: initialState?.filter?.filterModel,
        loadOptions: loadOptions || false,
        selectedRows: [],
        tableButtons:
            !tableButtons && tableButtons != ''
                ? url
                    ? 'xf'
                    : 'f'
                : tableButtons,
        apiRef: apiRef || useGridApiRef(),
        multiSelect: multiSelect || false,
        ...args,
        columns: generateColumns(columns, data),
        ...initialState ? { initialState } : {},
    })

    useEffect(() => {
        if (events) {
            Object.entries(events).map(([e, func]) => tableState.apiRef.current.subscribeEvent(e, func))
        }
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
            .then(({ data }) => {
                setTableState(state => {

                    const metadata = {
                        ...data.metadata,
                        attributes:
                            data?.metadata?.attributes
                                .filter(columnAttribute => columnAttribute.name != 'id')
                                .reduce((acc, columnAttribute) => {
                                    const column = 
                                        tableState.columns
                                            .find(col =>  col.field == columnAttribute.name)

                                    if (column) {
                                        const tableOrColumnName = 
                                            column.association
                                                ? getTableName(column)
                                                : column.field
                    
                                        acc[tableOrColumnName] = columnAttribute
                                    }
                                    
                                    return acc  
                                }, {}),
                    }

                    return {
                        ...state,
                        total: data?.metadata?.total,
                        isLoading: false,
                        data: data?.data,
                        metadata
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

    }

    useEffect(() => {
        if (reloadTable == true) {
            setReloadTable(false)
            fetchData()
        }
    }, [reloadTable])

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
            url: tableState.url.replace(/\?.*?$/, '') + '/export' + generateUri(tableState) + '&columns=' + tableState.columns.map(c => getTableAndColumnName(c, tableState.table)).join(),
            method: 'GET',
            responseType: 'blob', // Important
        }).then((response) => {
            FileDownload(response.data, 'export.xlsx');
        })
    }
    // Filter
    const removeFilter = () => tableState.apiRef.current.setFilterModel({ items: [] })

    if (!tableState.columns) return null

    return (
        <div style={{ padding: 10, textAlign: 'left' }}>
            {/* Rendering CustomTableForm this way prevents missing prop issues */}
            {formMode != 'closed' &&
                <CustomTableForm
                    aria-label="custom-table-form"
                    formMode={formMode}
                    handleClose={() => setFormMode('closed')}
                    createHandler={values => createHandler({values, tableState, setTableState, fetchData, setFormMode, showAlert})}
                    editHandler={values => editHandler({values, tableState, setTableState, fetchData, setFormMode, showAlert, setEditAndDeleteButtonDisabled})}
                    deleteHandler={() => deleteHandler({tableState, setTableState, fetchData, setFormMode, showAlert, setEditAndDeleteButtonDisabled})}
                    columns={columns}
                    metadata={tableState.metadata}
                    tableState={tableState}
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
                        customTableButtons={customTableButtons}
                        editAndDeleteButtonDisabled={editAndDeleteButtonDisabled}
                        filteredButtonDisabled={filteredButtonDisabled}
                        removeFilter={removeFilter}
                        exportTable={exportTable}
                        handleOpenCreate={onCreateOpen ? () => onCreateOpen(() => setFormMode('create')) : () => setFormMode('create')}
                        handleOpenEdit={onEditOpen ? () => onEditOpen(tableState.selectedRows, () => setFormMode('edit')) : () => setFormMode('edit')}
                        handleDelete={onDeleteOpen ? () => onDeleteOpen(tableState.selectedRows, () => setFormMode('delete')) : () => setFormMode('delete')}
                        openVisualizationsModal={() => dispatch(actions.handleMenu({ key: 'visualization-modal', value: true }))}
                        fetchData={fetchData}
                    />
                </Grid>
                <Grid item xs={6}>
                    {toolbarRight && toolbarRight(tableState.apiRef)}
                </Grid>
            </Grid>

            <StyledDataGrid
                aria-label="custom-table"
                density='compact'
                autoHeight
                autoWidth
                columns={tableState.columns}
                rowCount={tableState.total}
                rows={tableState.data}
                loading={tableState.isLoading}

                // Pagination
                rowsPerPageOptions={tableState.pageSizeOptions}
                pagination
                pageSize={tableState.pageSize}
                page={tableState.page - 1}
                onPageChange={(newPage) => {
                    setTableState(state => ({ ...state, page: newPage + 1 }))
                }}
                onPageSizeChange={(newPageSize) => setTableState(state => ({ ...state, pageSize: newPageSize }))}
                {
                ...(tableState.url)
                    ? { paginationMode: 'server' }
                    : {}
                }

                // Sorting
                {...(tableState.url) ? { sortingMode: 'server' } : {}}
                onSortModelChange={(sortModel) => {
                    setTableState(state => ({ ...state, sortModel }))
                }}

                // Filtering
                {...(tableState.url) ? { filterMode: 'server' } : {}}
                onFilterModelChange={(filterModel) => {
                    setTableState(state => ({ ...state, filterModel }))
                }}

                // Selection
                disableMultipleSelection={!tableState.multiSelect}
                checkboxSelection={tableState.multiSelect}
                keepNonExistentRowsSelected
                onSelectionModelChange={selectionModel => {
                    const selectedRows =
                        // Deselect row if clicked twice (only single select tables)
                        !tableState.multiSelect && selectionModel[0] == tableState.selectedRows?.[0]?.id
                            ? []
                            : selectionModel
                                .map(selectedRow => tableState.data.find(row => row.id == selectedRow))

                    // Custom onSelect
                    if (typeof onSelect == 'function') onSelect(selectedRows) 

                    setEditAndDeleteButtonDisabled(!selectedRows.length)

                    setTableState(state => ({ ...state, selectedRows }))
                }}
                // selectionModel={tableState.selectedRows?.map(row => row.id) || []}
                selectionModel={tableState.selectedRows ? tableState.selectedRows?.map(row => row.id) : initialState?.selection || []}

                apiRef={tableState.apiRef}
                {...tableState.initialState ? { initialState: tableState.initialState } : {}}
                onStateChange={state => {
                    setFilteredButtonDisabled(!state.filter?.filterModel?.items?.length)
                    sessionStorage.setItem(tableState.key, JSON.stringify(state))

                    // console.log(state, tableState.apiRef.current.state.selection)
                    // Provides selected row value to apiRef
                    // if (tableState.apiRef?.current) tableState.apiRef.current.selectedRows = tableState.selectedRows
                }}

                {...args}
            />
        </div>
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

/*
Must support aliased tables:
    {
        field: 'native_vlan',
        headerName: 'Native VLAN',
        association: {
            table: 'dp_interface_lan_vlan AS vlan',
            display: 'vlan_name'
        }
    }
    * Might be able to do GET directly on alias *

Table columns with association will: 
    renderCell = ({row}) => 
        typeof column.association.display == 'function'
            ? column.association.display(row)
            : row[column.association.table][column.association.display]


<CustomTable
    columns={[
        {
            field: 'name',
            headerName: 'Name'
        },
        {
            field: 'ip',
            headerName: 'IP'
        },
        {
            field: 'vpn_mode',
            headerName: 'VPN Mode',
            defaultValue: 'Enabled'
            // if metadata type = ENUM, render select (AutoComplete)
        },
        {
            field: 'subnet_mask',
            headerName: 'Subnet Mask',
            options: subnetMaskOptions // If options are provided render select (AutoComplete)
        },
        // 1:1 association (manual)
        {
            field: 'native_vlan',
            headerName: 'Native VLAN',
            association: {
                table: 'dp_interface_lan_vlan',
                display: 'vlan_name' // If not provided remote id column is shown
                // display: option => option.vlan_name <- Can support functions
            }
        },
        // 1:Many association
        {
            field: 'allowed_vlans', // virtual column when association.through is found
            headerName: 'Allowed VLANs',
            association: {
                table: 'dp_interface_lan_vlan',
                display: 'vlan_name', // If not provided remote id column is shown
                through: {
                    table: 'dp_interface_lan_vlan_port_associations',
                    localKey: 'port_id', // Set port_id to row.id
                    remoteKey: 'vlan_id' // Set vlan_id to dp_interface_lan_vlan.id
                }
            },
            // multiple: true, <- should be automatic when association.through is found
            // filter: {                                <- can add filter to URL query
            //     // <remote_table.column>: <value>
            //     site_id: 15
            // },
        }
    ]}
/>
*/