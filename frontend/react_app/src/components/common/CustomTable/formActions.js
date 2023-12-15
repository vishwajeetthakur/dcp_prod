import axios from 'axios'

import { getTableName } from './helpers'

export async function createHandler({values, tableState, setTableState, fetchData, setFormMode, showAlert})  {
    if (tableState.onCreate) values = tableState.onCreate(values, tableState.metadata)

    try {
        // 1:1 Associations
        const associationColumns = 
            tableState.columns
                .filter(column => column.association && !column.association?.through)
        
        if (associationColumns.length) {
            associationColumns.forEach(column => {
                const associationTableName = getTableName(column)

                values[column.field] = values?.[associationTableName]?.id || null

                delete values[associationTableName]
            })
        }

        // Extract values from type: "select" columns
        const data = 
            Object.entries(values)
                .reduce((acc, [key, value]) => ({
                    ...acc,
                    [key]: value?.value || value
                }), {})
        
        const response = await axios({ url: tableState.url, method: 'POST', data })

        // Many:Many Associations ("through" tables)
        const throughColumns = 
            tableState.columns
                .filter(column => column?.association?.through)

        if (throughColumns.length) {
            const createPromises = 
                throughColumns.map(column => {
                    return new Promise(async (resolve, reject) => {
                        const valuesColumn = getTableName(column)
                        const throughTable = column.association.through.table
                        const { localKey, remoteKey } = column.association.through
                        
                        if (!values[valuesColumn] && !values[valuesColumn].length) return resolve()

                        const throughValues =
                            values[valuesColumn]
                                .map(value => ({
                                    [localKey]: response.data.data[0].id,
                                    [remoteKey]: value.id
                                }))

                        const throughResponse = await axios({ url: '/api/eset_db/' + throughTable, method: 'POST', data: throughValues })
                        resolve(throughResponse)
                    })
                })

            const createPromiseResponse = await Promise.all(createPromises)
        }

        if (response.status == 200) showAlert('success', 'Row created successfully')
        else showAlert('error', `${response.status}: ${response.data}`)
        
        setFormMode('closed')
        fetchData()

    } catch (error) {
        console.error(error)
        showAlert('error', `${error.response.status}: ${error.response.data}`)
    }
}


export async function editHandler({values, tableState, setTableState, fetchData, setFormMode, showAlert}) {        
    if (tableState.onEdit) values = tableState.onEdit(values, tableState.metadata)
    else if (tableState.onUpdate) values = tableState.onUpdate(values, tableState.metadata)

    let sanitizedValues = 
        Object.entries(values)
            .reduce((acc, [key, value]) => {
                
                if (value != '** Multiple Values **') acc[key] = value

                return acc
            }, {})

    const editPromises =
        tableState.selectedRows
            .map(selectedRow => {
                return new Promise(async (resolve, reject) => {
                    try {

                        // 1:1 Associations
                        const associationColumns = 
                            tableState.columns
                                .filter(column => 
                                    column.association && 
                                    Object.keys(sanitizedValues).includes(getTableName(column)) &&
                                    !column.association?.through
                                )

                        if (associationColumns.length) {
                            associationColumns.forEach(column => {
                                const associationTableName = getTableName(column)

                                if (!column.field) throw `key "field" missing on association column: ${JSON.stringify(column)}`
                                sanitizedValues[column.field] = sanitizedValues?.[associationTableName]?.id || null

                                delete sanitizedValues[associationTableName]
                            })
                        }

                        // Extract values from type: "select" columns
                        const data = 
                            Object.entries(sanitizedValues)
                                .reduce((acc, [key, value]) => ({
                                    ...acc,
                                    [key]: value?.value || value
                                }), {})

                        const response = 
                            await axios({ 
                                url: tableState.url.split('?')[0] + '?id=' + selectedRow.id,
                                method: 'PUT',
                                data
                            })
                
                        // Many:Many Associations ("through" tables)
                        const throughColumns = 
                            tableState.columns
                                .filter(column => 
                                    column?.association?.through &&
                                    Object.keys(sanitizedValues).includes(getTableName(column))
                                )
                                    
                        if (throughColumns.length) {
                            const deletePromises =
                                throughColumns
                                    .map(column => 
                                        new Promise(async (_resolve, reject) => {
                                            const valuesColumn = getTableName(column)
                                            const throughTable = column.association.through.table
                                            
                                            // Skip if there are no values to delete
                                            const oldValues = selectedRow?.[valuesColumn]
                                            if (!oldValues?.length) return _resolve()
                                            
                                            // Skip if values are unchanged
                                            const newValues = sanitizedValues[valuesColumn]
                                            if (JSON.stringify(oldValues) == JSON.stringify(newValues)) return _resolve()
                
                                            // Skip if there are no values to delete
                                            // Should be caught by "if (!oldValues?.length) return resolve()" but just to be safe
                                            // This contains the actual through table rows that contain {id, local_table_id, remote_table_id}
                                            const currentThroughValues = selectedRow?.[throughTable]
                                            if (!oldValues?.length) return _resolve()

                                            const throughResponse = 
                                                await axios({ 
                                                    url: '/api/eset_db/' + throughTable, 
                                                    method: 'DELETE', 
                                                    data: currentThroughValues 
                                                })
                                            _resolve(throughResponse)
                                        })
                                    )
                
                            
                            const deletePromiseResponse = await Promise.all(deletePromises)
                            // console.log({ deletePromiseResponse })
                
                            const createPromises = 
                                throughColumns.map(column => {
                                    return new Promise(async (_resolve, reject) => {
                                        const valuesColumn = getTableName(column)
                                        const throughTable = column.association.through.table
                                        const { localKey, remoteKey } = column.association.through
                                        
                                        // Skip if values match
                                        const oldValues = selectedRow?.[valuesColumn]
                                        const newValues = sanitizedValues[valuesColumn]
                                        if (JSON.stringify(oldValues) == JSON.stringify(newValues)) return _resolve()
                
                                        const throughValues =
                                            sanitizedValues[valuesColumn]
                                                .map(value => ({
                                                    [localKey]: selectedRow.id, // row.id need to update to selected row
                                                    [remoteKey]: value.id
                                                }))

                                        const throughResponse = 
                                            await axios({ 
                                                url: '/api/eset_db/' + throughTable, 
                                                method: 'POST', 
                                                data: throughValues 
                                            })
                                        _resolve(throughResponse)
                                    })
                                })
                
                            const createPromiseResponse = await Promise.all(createPromises)
                            // console.log({ createPromiseResponse })
                        }

                        resolve()
                
                    } catch (error) {
                        reject(error)
                    }
                })
            })


    await Promise.all(editPromises)
            .then(res => {
                showAlert('success', 'Row/s updated successfully')
            })
            .catch(error => {
                console.error(error)
                if (error?.response?.status){
                    showAlert('error', `${error.response.status}: ${error.response.data}`)
                } else {
                    showAlert('error', `An error has occurred. Please view console for further information.`)
                }
            })

    setFormMode('closed')
    fetchData() 
 
    setTableState(state => ({
        ...state,
        selectedRows: []
        // This can cause issues with association tables, and various issues with keepNonExistentRowsSelected enabled
        // selectedRows: 
        //     state.selectedRows
        //         .map(selectedRow => ({
        //             ...selectedRow,
        //             ...sanitizedValues
        //         }))
    }))
}


export async function deleteHandler({tableState, setTableState, fetchData, setFormMode, showAlert, setEditAndDeleteButtonDisabled}) {
    
    const deletePromises =
        tableState.selectedRows
            .map(selectedRow => {
                return new Promise(async (resolve, reject) => {

                    try {
                        const response = await axios.delete(tableState.url.split('?')[0] + '?id=' + selectedRow.id)

                        resolve()
                    } catch (error) {
                        console.error(error)
                        reject(error)
                    }

                })
            })

    await Promise.all(deletePromises)
        .then(res => {
            showAlert('success', 'Row/s deleted successfully')
        })
        .catch(error => {
            console.error(error)
            if (error?.response?.status){
                showAlert('error', `${error.response.status}: ${error.response.data}`)
            } else {
                showAlert('error', `An error has occurred. Please view console for further information.`)
            }
        })

    setFormMode('closed')
    setTableState(state => ({ ...state, selectedRows: null }))
    setEditAndDeleteButtonDisabled(true)
    fetchData()
}