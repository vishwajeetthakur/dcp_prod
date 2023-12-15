import React, { useState } from "react";
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
    OutlinedInput,
    Stack,
    TextField,
} from '@mui/material'

import { SearchDropdown } from '../'


function removeDuplicateObjectsFromArrayById(array){
    return array.filter( (v,i,a) => a.findIndex( v2 => ( v2.id === v.id ) ) === i )
}

const CustomTableForm = ({ input, open, mode, handleClose, createHandler, editHandler, deleteHandler, columns, metadata, tableState }) => {

    function getRemoteTable(_localTable){
        return columns
            .filter(column => Object.keys(column).includes('relationship'))
            .find(({relationship}) => {
                return Object.entries(relationship)
                    .find(([remoteColumn, localColumn]) => localColumn == _localTable)
            })?.field
    }

    function getLocalTable(_remoteTable) {
        return columns
            .filter(column => Object.keys(column).includes('relationship'))
            .find(({relationship}) => Object.keys(relationship).includes(_remoteTable + '.id'))
            ?.relationship?.[_remoteTable + '.id']
    }
    
    const [values, setValues] = 
        useState(
            (mode == 'create') 
                ? columns.reduce((acc, i) => {
                    if (i.defaultValue) acc[i.field] = i.defaultValue
                
                    return acc
                }, {}) 
                : input
        )

    const [errorFields, setErrorFields] = 
        useState(
            metadata.attributes
                .filter(attribute => attribute.name != 'id' && attribute.allowNull == false)
                .reduce((acc, metaObj) => {
                    const columnName = getRemoteTable(metaObj.name)
                
                    acc[columnName ? columnName .split('.')[0] : metaObj.name] = true
                
                    return acc
                }, {})
        )
    
    function handleChange(tableOrColumnName, _value) {
        const value = 
            (Array.isArray(_value))
                ? removeDuplicateObjectsFromArrayById(_value)
                : _value

        const attributeName = getLocalTable(tableOrColumnName) || tableOrColumnName

        const columnAttributes = metadata.attributes.find(column => column.name == attributeName) || {}
        const { allowNull, validation } = columnAttributes

        if (allowNull == false) setErrorFields(state => ({...state, [tableOrColumnName]: !value}))

        setValues({
            ...values,
            [tableOrColumnName]: value
        })
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            columnCount={columns.length}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                {mode.charAt(0).toUpperCase() + mode.slice(1) + ' Form'}
            </BootstrapDialogTitle>

            <DialogContent dividers>

                <Grid container spacing={2}>

                {mode !== 'delete' && columns.filter(column => column.formControl != 'hidden' && !column.hidden).map((column, i) => {
                    const [tableOrColumnName, columnName] = column.field.split('.')
                    const aliasedTable = 
                        !tableState.include
                            ? null
                            : tableState.include
                                .split(',')
                                .filter(row => row.toLowerCase().includes(' as '))
                                .map(row => row.toLowerCase().split(' as '))
                                .find(([table, alias]) => alias == tableOrColumnName)

                    let value = values[tableOrColumnName] || ''

                    const metaDataTable =  getLocalTable(tableOrColumnName) || tableOrColumnName
                    const columnMetadata = metadata.attributes.find(c => c.name == metaDataTable)

                    let label = 
                        column.headerName.replaceAll("_", " ").toUpperCase() 
                        + ((columnMetadata?.allowNull == false) ? ' *' : '')

                    // if (column?.options){
                    //     column.options =
                    //         column.options?.[0]?.value
                    //             ? column.options
                    //             : column.options.map(col => ({label: col, value: col}))
                    // }

                    if (column.commaDelineatedValues){
                        value =
                            Array.isArray(value)
                                ? value
                                : value.length 
                                    ? value?.split(', ') 
                                    : []
                                    
                        column = {
                            onChange: (newValues, currentValues, setValues) => {
                                setValues(old => ({ ...old, [tableOrColumnName]: newValues.sort().join(', ') }))
                            },
                            type: 'ENUM',
                            multiple: true,
                            ...column
                        }
                    }


                    const renderSwitch = (type, _column=column) => {
                        switch(type.toUpperCase()){
                            case 'BOOLEAN':
                                return (
                                    <FormControlLabel
                                        error={(!value) ? errorFields[tableOrColumnName] : false}
                                        control={
                                            <Checkbox 
                                                checked={value} 
                                                onChange={event => _column.onChange 
                                                    ? _column.onChange(event.target.checked, values, handleChange) 
                                                    : handleChange(tableOrColumnName, event.target.checked)
                                                }
                                                disabled={_column.formControl == 'disabled'}
                                            />
                                        }
                                        disabled={_column.formControl == 'disabled'}
                                        label={label}
                                        aria-label="checkbox"
                                    />
                                )
                            case 'INTEGER':
                                return (
                                    <>
                                        <InputLabel 
                                            htmlFor="component-outlined"
                                            error={(!value) ? errorFields[tableOrColumnName] : false}
                                            disabled={_column.formControl == 'disabled'}
                                        >
                                            {label}
                                        </InputLabel>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            fullWidth
                                            label={_column.headerName.toUpperCase()}
                                            name={tableOrColumnName}
                                            error={(!value) ? errorFields[tableOrColumnName] : false}
                                            disabled={_column.formControl == 'disabled'}
                                            { ..._column }
                                            defaultValue={value}
                                            onChange={event => _column.onChange 
                                                ? _column.onChange(event.target.value, values, handleChange) 
                                                : handleChange(tableOrColumnName, event.target.value)
                                            }
                                            aria-label="number"
                                            sx={{
                                                '&.Mui-disabled': {
                                                    border: '1px solid rgba(100, 200, 240, .4)'
                                                }
                                            }}
                                        />
                                    </>
                                )
                            case 'TEXT':
                                return (
                                    <>
                                        <InputLabel 
                                            htmlFor={tableOrColumnName}
                                            error={(!value) ? errorFields[tableOrColumnName] : false}
                                            disabled={_column.formControl == 'disabled'}
                                        >
                                            {label}
                                        </InputLabel>
                                        <OutlinedInput
                                            id={tableOrColumnName}
                                            label={_column.headerName.toUpperCase()}
                                            name={tableOrColumnName}
                                            error={(!value) ? errorFields[tableOrColumnName] : false}
                                            multiline
                                            rows={4}
                                            fullWidth
                                            disabled={_column.formControl == 'disabled'}
                                            { ..._column }
                                            defaultValue={value}
                                            onChange={event => _column.onChange 
                                                ? _column.onChange(event.target.value, values, handleChange) 
                                                : handleChange(tableOrColumnName, event.target.value)
                                            }
                                            aria-label="textbox"
                                        />
                                    </>
                                )
                            case 'SELECT':
                                return (
                                    <Autocomplete
                                        multiple={_column.multiple}
                                        id="tags-standard"
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
                                                error={(!value) ? errorFields[tableOrColumnName] : false}
                                                //placeholder="Favorites"
                                            />
                                        )}
                                        fullWidth
                                        disabled={_column.formControl == 'disabled'}
                                        { ..._column }
                                        onChange={(event, newValues) => _column.onChange 
                                            ? _column.onChange(newValues, values, handleChange) 
                                            : handleChange(tableOrColumnName, newValues)
                                        }
                                    />
                                )
                            case 'ENUM':
                                return (
                                    <Autocomplete
                                        multiple={_column.multiple}
                                        id="tags-standard"
                                        name={tableOrColumnName}
                                        options={_column.options || columnMetadata.values}
                                        getOptionLabel={option => option}
                                        value={value}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                //variant="outlined"
                                                label={label}
                                                error={(!value) ? errorFields[tableOrColumnName] : false}
                                                //placeholder="Favorites"
                                            />
                                        )}
                                        fullWidth
                                        disabled={_column.formControl == 'disabled'}
                                        { ..._column }
                                        onChange={(event, newValues) => _column.onChange 
                                            ? _column.onChange(newValues, values, setValues) 
                                            : handleChange(tableOrColumnName, newValues)
                                        }
                                    />
                                )
                            case 'SEARCHDROPDOWN':
                                return (
                                    <SearchDropdown
                                        { ..._column }
                                        label={_column.headerName.toUpperCase()}
                                        url={_column.url}
                                        getOptionLabel={option => _column.getOptionLabel(option)}
                                        multiple={_column.multiple}
                                        onChange={value => _column.onChange(value, values, handleChange)}
                                        value={value || []}
                                        // defaultValue={value || []}
                                    />
                                )
                            case 'CUSTOM':
                                return _column.jsx
                            default:
                                return (
                                    <>
                                        <InputLabel 
                                            htmlFor="component-outlined"
                                            error={(!value) ? errorFields[tableOrColumnName] : false}
                                            disabled={_column.formControl == 'disabled'}
                                        >
                                            {label}
                                        </InputLabel>
                                        <OutlinedInput
                                            id="component-outlined"
                                            label={_column.headerName.toUpperCase()}
                                            name={tableOrColumnName}
                                            error={(!value) ? errorFields[tableOrColumnName] : false}
                                            fullWidth
                                            disabled={_column.formControl == 'disabled'}
                                            { ..._column }
                                            defaultValue={value}
                                            onChange={event => _column.onChange 
                                                ? _column.onChange(event.target.value, values, handleChange) 
                                                : handleChange(tableOrColumnName, event.target.value)
                                            }
                                            aria-label="text-input"
                                        />
                                    </>
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
                                    : column.field.includes('.')
                                        ? (<Autocomplete
                                        
                                                multiple={column.multiple}
                                                id={tableOrColumnName}
                                                name={tableOrColumnName}
                                                options={
                                                    !column.renderOptions 
                                                        ? metadata.options[aliasedTable ? aliasedTable[0] : tableOrColumnName] 
                                                        : column.renderOptions(metadata.options)
                                                }
                                                getOptionLabel={option => option[columnName] || ''}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        //variant="outlined"
                                                        label={label}
                                                        error={(!value) ? errorFields[tableOrColumnName] : false}
                                                        //placeholder="Favorites"
                                                    />
                                                )}
                                                fullWidth
                                                disabled={column.formControl == 'disabled'}
                                                { ...column }
                                                {...((mode == 'create') && (column.multiple) ? {defaultValue: []} : {defaultValue: null})}
                                                {...((mode == 'edit') && {value: value})}
                                                onChange={(event, newValues) => column.onChange 
                                                    ? column.onChange(newValues, values, handleChange) 
                                                    : handleChange(tableOrColumnName, newValues)
                                                }
                                        />)
                                        : renderSwitch(column.type || columnMetadata?.type)
                            }
                        </FormControl>
                    </Grid>
                    ))
                })
                }
                </Grid>
                {mode == 'delete' && <p>Are you sure you want to delete this row?</p>}
            </DialogContent>

            <DialogActions>
                {mode == 'create' && 
                    <Button autoFocus onClick={() => createHandler(values)}>
                        Create
                    </Button>
                }

                {mode == 'edit' && 
                    <Button autoFocus onClick={() => editHandler(values)}>
                        Update
                    </Button>
                }

                {mode === 'delete' && <div>
                    <Stack spacing={1} direction="row">
                        <Button variant="contained" color="error" autoFocus onClick={() => deleteHandler(values.id)}>
                            Delete
                        </Button>
                        <Button variant="contained" autoFocus onClick={() => handleClose()}>
                            Cancel
                        </Button>
                    </Stack>
                </div>}
            </DialogActions>


        </BootstrapDialog>
    );
};

export default React.memo(CustomTableForm);