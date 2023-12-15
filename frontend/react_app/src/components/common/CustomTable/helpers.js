import { Tooltip } from '@mui/material'


export function getTableName(column, baseTable=''){
    // Does not account for through tables, through tables are added in generateIncludeUri for deleting associations when editing
    return column.association
        ? column.aliasedTable
            ? column.association.table.toLowerCase().split(' as ')[1]
            : column.association.table
        : baseTable
}

export function getColumnName(column){
    return column.association
        ? column.association.display || 'id'
        : column.field
}

export function getTableAndColumnName(column, baseTable){
    return `${getTableName(column, baseTable)}.${getColumnName(column)}`
}


export function generateUrl(tableState) {
    return tableState.url.split('?')[0] + generateUri(tableState)
}


export function generateUri(tableState) {
    
    const tableUriObject = {
        // Used to exclude columns
        ...(tableState.specifyColumns ? { columns : tableState.columns.map(column => column.field).join() } : {}),

        sort: generateSortUri(tableState),
        filter: generateFilterUri(tableState),
        include: generateIncludeUri(tableState),
        page: tableState.page,
        pageSize: tableState.pageSize,

        // Sometime getting options is required when using renderOptions
        options: tableState.loadOptions
    }

    const tableUriArray =
        Object.entries(tableUriObject)
            .filter(([, value]) => value)
            .map(([key, value]) => `${key}=${(typeof value == 'string') ? value : JSON.stringify(value)}`)

    return '?' + tableUriArray.join('&')
}

function generateSortUri({ sortModel, columns, table }){
    if (!sortModel?.[0]) return null
    
    const column = columns.find(c => c.field == sortModel[0].field)

    return [ [getTableAndColumnName(column, table), sortModel[0].sort] ]
}


function generateFilterUri({ url, filterModel, columns, table }) {
    const existingUrlFilter = 
        url.match(/filter=(.*?)(?:&|$)/)
            ?.[1]
            ?.split(',')
        || []

    const sanitizedFilterModelItems = 
        filterModel
            ?.items
            ?.map(item => {
                const column = columns.find(c => c.field == item.columnField)

                const columnNameToUse = getTableAndColumnName(column, table)

                return {...item, columnField: columnNameToUse}
            })

    return [
        ...sanitizedFilterModelItems
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
    ].filter(i => i).join(',')
    
}

function generateIncludeUri({ url, columns }){
    const existingUrlInclude = 
        url.match(/include=(.*?)(?:&|$)/)
            ?.[1]
            ?.split(',')
        || []
        
    return [
        // Using sets removes duplicates
        ...new Set(
            [
                ...columns.map(col => col?.association?.table),
                ...columns.map(col => col?.association?.through?.table),
                ...existingUrlInclude
            ].filter(col => col)             
        )
    ].filter(i => i).join()
}


export function generateColumns(columns, data) {
    if (!columns.length && !data) console.log('Unabled to generate columns, the column and data keys are blank!')

    return !columns.length
        // When columns are blank, auto generate columns from data
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
                    return '';
                }

            }
        })
        // Add defaults to supplied columns
        : columns
            .filter(col => !col.hidden)
            .map(column => {
                
                const columnDefaults = {
                    ...((columns.length <= 5) && (!column.width)) ? { flex: 1 } : { width: 200 },
                }
                
                if (column.association) {
                    column.aliasedTable = column.association.table.toLowerCase().includes(' as ')

                    const tableName = getTableName(column)
                    const display = column.association.display || 'id'

                    // Fixes column.field for DataGrid filter
                    if (column.association.through || !column.field) {
                        column.field = `${tableName}.${display}`
                    }

                    columnDefaults.renderCell = ({row}) => 
                        typeof display == 'function'
                            ? display(row)
                            : Array.isArray(row[tableName])
                                ? row[tableName].map(item => item[display]).join(', ')
                                : row[tableName]
                                    ? row[tableName][display] || ''
                                    : ''

                        // const customChip =
                        //     ((tableButtons?.includes('c') || tableButtons?.includes('e') || tableButtons?.includes('d')) && column.readOnly)
                        //         ? { variant: 'outlined' }
                        //         : {}

                        // return (Array.isArray(row[tableName]))
                        //     ? row[tableName].map(item => item[columnName]).join(', ') // <Chip {...customChip} label={item[columnName]}></Chip>
                        //     : (row[tableName])
                        //         ? row[tableName][columnName] // <Chip {...customChip} label={row[tableName][columnName]}></Chip>
                        //         : null
                }

                return {
                    ...columnDefaults,
                    ...column // This will overwrite the column defaults
                }
            })
}
