import React, { useState, useEffect } from "react"
import { BootstrapDialog, BootstrapDialogTitle } from '../forms/CustomModal'
import {
    Autocomplete,
    Button,
    Checkbox,
    DialogActions,
    DialogContent,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    Stack,
    TextField
} from '@mui/material'

import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

import { SearchDropdown } from '../'

import { getTableName } from './helpers'

function removeDuplicateObjectsFromArrayById(array) {
    return array.filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)
}

const CustomTableForm = ({
    formMode,
    handleClose,
    createHandler,
    editHandler,
    deleteHandler,
    columns,
    metadata,
    tableState
}) => {
    const [formHasErrors, setFormHasErrors] = useState(false)
    
    const [values, setValues] =
        useState(
            (() => {
                // This is used to remove through tables from values, helps identify "** Multiple Values **" columns on edit
                const throughTablesArray = 
                    tableState.columns
                        .map(col => col?.association?.through?.table)
                        .filter(i => i)

                return formMode == 'create'
                    ? columns.reduce((acc, i) => {
                        if (i.defaultValue || i.defaultValue == false) {
                            acc[i.field] = 
                                typeof i.defaultValue == 'function' 
                                    ? i.defaultValue(tableState)
                                    : i.defaultValue
                        }

                        return acc
                    }, {})
                    : tableState.selectedRows.length == 1
                        ? tableState.selectedRows[0]
                        : tableState.selectedRows
                            .reduce((acc, row) => {
                                Object.entries(row)
                                    .forEach(([key, value]) => {

                                        // Remove through columns from association to help identify "** Multiple Values **" columns on edit
                                        if (Array.isArray(value)){
                                            value = value.map(val => {
                                                throughTablesArray.forEach(throughTable => {
                                                    if (val?.[throughTable]) delete val[throughTable]
                                                })

                                                return val
                                            })
                                        }

                                        if (!Object.keys(acc).includes(key)) acc[key] = value
                                        else if (JSON.stringify(acc[key]) != JSON.stringify(value)) acc[key] = '** Multiple Values **'
                                    })

                                return acc
                            }, {})
            })
        )
            
    const [errorFields, setErrorFields] =
        useState(
            tableState.columns
                .reduce((acc, column) => {
                    
                    const tableOrColumnName = 
                        column.association
                            ? getTableName(column)
                            : column.field

                    const allowNull = 
                        ('allowNull' in column) 
                            ? column.allowNull 
                            : metadata?.attributes?.[tableOrColumnName]?.allowNull

                    acc[tableOrColumnName] = !values[tableOrColumnName] && allowNull == false && values[tableOrColumnName] != false

                    return acc
                }, {})
        )

    const [formControl, setFormControl] =
        useState(
            tableState.columns
                .reduce((acc, column) => {
                    
                    // const tableOrColumnName = 
                    //     column.association
                    //         ? getTableName(column)
                    //         : column.field

                    const formControlTableOrColumnName = 
                            column.association
                                ? getTableName(column) + '.' + column.association.display
                                : column.field

                    acc[formControlTableOrColumnName] = 
                        column.formControl
                            ? typeof column.formControl == 'function'
                                ? column.formControl(values)
                                : column.formControl
                            : 'display'

                    return acc
                }, {})
        )

    useEffect(() => {

        for (const column of columns){
            if (typeof column.formControl == 'function'){

                const tableOrColumnName = 
                        column.association
                            ? getTableName(column)
                            : column.field

                const formControlTableOrColumnName = 
                    column.association
                        ? getTableName(column) + '.' + column.association.display
                        : column.field

                const formControlResult = column.formControl(values)
                
                if (formControlResult != formControl[formControlTableOrColumnName]) {
                    // Update formControl
                    setFormControl(old => ({ ...old, [formControlTableOrColumnName]: formControlResult }))
    
                    // Update default values
                    setValues(old => ({ 
                        ...old,
                        [tableOrColumnName]:  
                            formControlResult == 'hidden'
                                ? null
                                : column.defaultValue || ''
                    }))

                    // Update error fields
                    const allowNull =
                        ('allowNull' in column) 
                            ? column.allowNull 
                            : metadata?.attributes?.[tableOrColumnName]?.allowNull

                    if (allowNull == false && !column.defaultValue){
                        setErrorFields(old => ({ ...old, [tableOrColumnName]: true }))
                    }

                }
            }
        }

    }, [values])

    useEffect(() => {
        const activeFields = Object.keys(formControl).filter(key => formControl[key] == 'display')
        const hasErrors = !activeFields.every(field => !errorFields[field.split('.')[0]]) // formControl on association columns have <table>.<column> keys
        
        setFormHasErrors(hasErrors)

    }, [errorFields])
    
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={formMode != 'closed'}
            columnCount={columns.length}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                {formMode.charAt(0).toUpperCase() + formMode.slice(1) + ' Form'}
            </BootstrapDialogTitle>

            <DialogContent dividers>

                <Grid container spacing={2}>

                    {
                        formMode !== 'delete' &&
                        columns
                            .map((column, i) => {

                                const tableOrColumnName = 
                                    column.association
                                        ? getTableName(column)
                                        : column.field

                                const formControlTableOrColumnName = 
                                    column.association
                                        ? getTableName(column) + '.' + column.association.display
                                        : column.field

                                if (formControl[formControlTableOrColumnName] == 'hidden') return  

                                let value = values[tableOrColumnName] || ''

                                const allowNull = 
                                    ('allowNull' in column) 
                                        ? column.allowNull 
                                        : metadata?.attributes?.[tableOrColumnName]?.allowNull

                                const label =
                                    column.headerName.replaceAll("_", " ").toUpperCase()
                                    + (allowNull == false ? ' *' : '')


                                if (column.commaDelineatedValues) {
                                    value =
                                        Array.isArray(value)
                                            ? value
                                            : value.length
                                                ? value?.split(', ')
                                                : []

                                    column = {
                                        onChange: (newValues, currentValues, handleChange, setValues) => {
                                            handleChange(newValues.sort().join(', '))
                                        },
                                        type: 'ENUM',
                                        multiple: true,
                                        ...column
                                    }
                                }

                                function handleChange(newValue) {

                                    newValue =
                                        Array.isArray(newValue)
                                            ? removeDuplicateObjectsFromArrayById(newValue)
                                            : newValue

                                    setValues(state => ({
                                        ...state,
                                        [tableOrColumnName]: newValue
                                    }))

                                    // allowNull check
                                    const canBeNull = 
                                        ('allowNull' in column)
                                            ? column.allowNull 
                                            : ('allowNull' in (metadata?.attributes?.[tableOrColumnName] || {})) // Shorter this way than using && to check if exists
                                                ? metadata.attributes[tableOrColumnName].allowNull
                                                : true
                                    
                                    const allowNullError =
                                        canBeNull
                                            ? false
                                            : newValue === null || newValue === undefined // null or undefined
                                                ? true
                                                : typeof newValue == 'boolean' || typeof newValue == 'integer' // ignore since they are not null or undefined
                                                    ? false
                                                    : Object.keys(newValue)?.length // Objects
                                                        ? false
                                                        : !newValue.length // Covers string and array 
                                    
                                    if (allowNullError) {
                                        // Skip validation
                                        return setErrorFields(state => ({ 
                                            ...state, 
                                            [tableOrColumnName]: true
                                        }))
                                    }
                                    
                                    // Validation
                                    const validationFunction = 
                                        ('validation' in column)
                                            ? column.validation 
                                            : metadata?.attributes?.[tableOrColumnName]?.validation

                                    const isValid =
                                        typeof validationFunction == 'function'
                                            ? validationFunction(newValue, values, tableState)
                                            : true

                                    setErrorFields(state => ({
                                        ...state, 
                                        [tableOrColumnName]: 
                                            typeof isValid == 'string'
                                                ? isValid
                                                : typeof isValid == 'object' && 'error' in isValid
                                                    ? isValid.error == true ? isValid.helperText : false
                                                    : isValid == false
                                    }))

                                }

                                const renderSwitch = (type, _column = column) => {
                                    type = type.toUpperCase()

                                    switch (type) {
                                        case 'DATE':
                                            return (
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DateTimePicker 
                                                        label={label}
                                                        value={dayjs(value)}
                                                        onChange={(newValues) => 
                                                            _column.onChange
                                                                ? _column.onChange(newValues.$d.toString(), values, handleChange, setValues)
                                                                : handleChange(newValues.$d.toString())
                                                        }
                                                        disabled={formControl[formControlTableOrColumnName] == 'disabled'}
                                                        error={errorFields[tableOrColumnName] != false}
                                                    />
                                                </LocalizationProvider>
                                            )
                                        case 'DATETIME':
                                            return (
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DateTimePicker 
                                                        label={label}
                                                        value={dayjs(value)}
                                                        onChange={(newValues) => 
                                                            _column.onChange
                                                                ? _column.onChange(newValues.$d.toString(), values, handleChange, setValues)
                                                                : handleChange(newValues.$d.toString())
                                                        }
                                                        disabled={formControl[formControlTableOrColumnName] == 'disabled'}
                                                        error={errorFields[tableOrColumnName] != false}
                                                    />
                                                </LocalizationProvider>
                                            )
                                        case 'BOOLEAN':
                                            return (
                                                <FormControlLabel
                                                    // error={(!value) ? errorFields[tableOrColumnName] : false}
                                                    control={
                                                        <Checkbox
                                                            checked={value || false}
                                                            onChange={event => _column.onChange
                                                                ? _column.onChange(event.target.checked, values, handleChange, setValues)
                                                                : handleChange(event.target.checked)
                                                            }
                                                            disabled={formControl[formControlTableOrColumnName] == 'disabled'}
                                                        />
                                                    }
                                                    disabled={formControl[formControlTableOrColumnName] == 'disabled'}
                                                    label={label}
                                                    aria-label="checkbox"
                                                />
                                            )
                                        case 'SELECT':
                                            return (
                                                <Autocomplete
                                                    multiple={_column.multiple}
                                                    name={tableOrColumnName}
                                                    options={_column.options}
                                                    getOptionLabel={option => option.label || option}
                                                    // value={value?.value ? value : _column.options.find(c => c.value == value)}
                                                    value={value}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            //variant="outlined"
                                                            label={label}
                                                            error={errorFields[tableOrColumnName] != false}
                                                        //placeholder="Favorites"
                                                        />
                                                    )}
                                                    fullWidth
                                                    disabled={formControl[formControlTableOrColumnName] == 'disabled'}
                                                    {..._column}
                                                    onChange={(event, newValues) => _column.onChange
                                                        ? _column.onChange(newValues, values, handleChange, setValues)
                                                        : handleChange(newValues)
                                                    }
                                                />
                                            )
                                        case 'ENUM':
                                            return (
                                                <Autocomplete
                                                    multiple={_column.multiple}
                                                    name={tableOrColumnName}
                                                    options={_column.options || metadata?.attributes?.[tableOrColumnName]?.values}
                                                    getOptionLabel={option => option}
                                                    value={value}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            //variant="outlined"
                                                            label={label}
                                                            error={errorFields[tableOrColumnName] != false}
                                                        //placeholder="Favorites"
                                                        />
                                                    )}
                                                    fullWidth
                                                    disabled={formControl[formControlTableOrColumnName] == 'disabled'}
                                                    {..._column}
                                                    onChange={(event, newValues) => 
                                                        _column.onChange
                                                            ? _column.onChange(newValues, values, handleChange, setValues)
                                                            : handleChange(newValues)
                                                    }
                                                />
                                            )
                                        case 'SEARCHDROPDOWN':
                                            return (
                                                <SearchDropdown
                                                    {..._column}
                                                    label={_column.headerName.toUpperCase()}
                                                    url={_column.url}
                                                    getOptionLabel={option => _column.getOptionLabel(option)}
                                                    multiple={_column.multiple}
                                                    onChange={value => _column.onChange(value, values, handleChange, setValues)}
                                                    value={value || []}
                                                    disabled={formControl[formControlTableOrColumnName] == 'disabled'}
                                                // defaultValue={value || []}
                                                />
                                            )
                                        case 'CUSTOM':
                                            return _column.jsx
                                        default:
                                            return (
                                                <TextField
                                                    {
                                                        ...type == 'INTEGER'
                                                            ? { type: 'number' }
                                                            : {}
                                                    }
                                                    {
                                                        ...type == 'TEXT'
                                                            ? { multiline: true, rows: 4 }
                                                            : {}
                                                    }
                                                    id={tableOrColumnName}
                                                    label={_column.headerName.toUpperCase()}
                                                    name={tableOrColumnName}
                                                    fullWidth
                                                    disabled={formControl[formControlTableOrColumnName] == 'disabled'}
                                                    error={errorFields[tableOrColumnName] != false}
                                                    helperText={typeof errorFields[tableOrColumnName] == 'string' ? errorFields[tableOrColumnName] : _column.helperText}
                                                    {..._column}
                                                    defaultValue={value}
                                                    onChange={event => _column.onChange
                                                        ? _column.onChange(event.target.value, values, handleChange, setValues)
                                                        : handleChange(event.target.value)
                                                    }
                                                    
                                                />
                                            )
                                    }
                                }

                                return (
                                    column.field !== 'id' && (
                                        <Grid item xs={column.xs || 12} md={column.md || columns.length > 7 ? 6 : 12}>
                                            <FormControl key={i} style={{ width: "100%", marginBottom: "1rem" }}>

                                                {
                                                    column.renderField
                                                        ? column.renderField(renderSwitch, values, setValues)
                                                        :  value == '** Multiple Values **'
                                                            ? (
                                                                <>
                                                                    <InputLabel htmlFor={tableOrColumnName} disabled={formControl[formControlTableOrColumnName] == 'disabled'} shrink={true} focused={true}>
                                                                        {label}
                                                                    </InputLabel>
                                                                    <Button 
                                                                        disabled={formControl[formControlTableOrColumnName] == 'disabled'}
                                                                        style={{ height: '56px' }}
                                                                        id={tableOrColumnName} 
                                                                        name={tableOrColumnName} 
                                                                        variant="outlined" 
                                                                        onClick={() => 
                                                                            setValues(old => ({
                                                                                ...old, 
                                                                                // Set default
                                                                                [tableOrColumnName]: 
                                                                                    column.defaultValue
                                                                                        ? column.defaultValue
                                                                                        : metadata?.attributes?.[tableOrColumnName]?.defaultValue
                                                                                            ? metadata?.attributes?.[tableOrColumnName]
                                                                                            : (column.type || metadata?.attributes?.[tableOrColumnName]?.type).toUpperCase() == 'BOOLEAN'
                                                                                                ? false
                                                                                                : ''
                                                                            })
                                                                        )}
                                                                    >
                                                                        Multiple Values
                                                                    </Button>
                                                                </>
                                                            
                                                            )
                                                            : column.association
                                                                ? (
                                                                    <SearchDropdown
                                                                        {...column}
                                                                        disabled={formControl[formControlTableOrColumnName] == 'disabled'}
                                                                        label={column.headerName.toUpperCase()}
                                                                        url={column.url || `/api/eset_db/${column.aliasedTable ? column.association.table.toLowerCase().split(' as ')[0] : tableOrColumnName}?filter=${column.association.display}~{query}`}
                                                                        getOptionLabel={option =>
                                                                            column.getOptionLabel 
                                                                                ? column.getOptionLabel(option, metadata)
                                                                                : option[column.association.display] || ''
                                                                        }
                                                                        multiple={column.multiple || !!column.association.through}
                                                                        onChange={(value, updateDropdownValue) => 
                                                                            column.onChange 
                                                                                ? column.onChange(value, values, handleChange, setValues, updateDropdownValue)
                                                                                : handleChange(value)
                                                                        }
                                                                        value={
                                                                            value == '** Multiple Values **' 
                                                                                ? [
                                                                                    ...new Set(
                                                                                        tableState.selectedRows
                                                                                            .flatMap(row => row[tableOrColumnName])
                                                                                            .map(item=> item[column.association.display])
                                                                                        )
                                                                                ] 
                                                                                : value
                                                                        }
                                                                        { 
                                                                            ...column.renderOptions
                                                                                ? { renderOptions: options => column.renderOptions(options, metadata) }
                                                                                : {}
                                                                        }
                                                                        error={errorFields[tableOrColumnName] != false}
                                                                    />
                                                                    
                                                                )
                                                                : renderSwitch(column.type || metadata?.attributes?.[tableOrColumnName]?.type)
                                                }
                                            </FormControl>
                                        </Grid>
                                    ))
                            })
                    }
                </Grid>
                {formMode == 'delete' && <p>Are you sure you want to delete {tableState.selectedRows.length} row{tableState.selectedRows.length > 1 ? 's' : ''}?</p>}
            </DialogContent>

            <DialogActions>
                {formMode == 'create' &&
                    <Button id="create-button" disabled={formHasErrors} autoFocus type="submit" onClick={() => createHandler(values)}>
                        Create
                    </Button>
                }

                {formMode == 'edit' &&
                    <Button id="edit-button" disabled={formHasErrors} autoFocus type="submit" onClick={() => editHandler(values)}>
                        Update
                    </Button>
                }

                {formMode === 'delete' && <div>
                    <Stack spacing={1} direction="row">
                        <Button variant="contained" color="error" autoFocus onClick={deleteHandler}>
                            Delete
                        </Button>
                        <Button variant="contained" autoFocus onClick={handleClose}>
                            Cancel
                        </Button>
                    </Stack>
                </div>}
            </DialogActions>
        </BootstrapDialog>
    );
};

export default React.memo(CustomTableForm);