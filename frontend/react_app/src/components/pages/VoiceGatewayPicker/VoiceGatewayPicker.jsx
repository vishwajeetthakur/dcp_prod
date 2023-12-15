
// Packages
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import FileDownload from 'js-file-download'
import axios from 'axios'
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    TextField,
    Box,
    Grid
}
    from '@mui/material'

import LoadingButton from '@mui/lab/LoadingButton';

import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import { useGridApiRef } from '@mui/x-data-grid-pro';

import {
    NewToolWrapper,
    CustomTable
} from '../../common'

// Components
// hooks
import { actions } from '../../../store';

// Utils
import paths from '../../../paths'

// Types

// Styles
import './VoiceGatewayPicker.scss'


const VoiceGatewayPicker = () => {
    const dispatch = useDispatch()
    const showAlert = (type, message) => dispatch(actions.createAlert({ message, type }))

    // Calculator Tab
    const [calculatorValues, setCalculatorValues] = useState({})
    const [calculatorTimeout, setCalculatorTimeout] = useState()
    const apiRef = useGridApiRef()
    const columnVisibility = {
        columns: {
            columnVisibilityModel: {
                part_number: false,
                use_case: false,
                max_pri: false,
                max_sip: false,
                max_analog: false,
                special_case: false,
                approved_firmware: false,
                legacy_company: false,
                network_platform: false,
            },
        },
    }

    const handleCalculatorFormChange = ({ target }) => {
        const { name, value } = target
        setCalculatorValues(state => ({ ...state, [name]: value }))
    }

    useEffect(() => {
        if (!Object.keys(calculatorValues).length) return

        clearTimeout(calculatorTimeout)

        setCalculatorTimeout(
            setTimeout(() => {
                if (!Object.values(calculatorValues).filter(i => i).length) {
                    // Reset table if everything is blank
                    return apiRef.current.setFilterModel({ items: [] })
                }

                const filterModel = {
                    items: [
                        { columnField: 'special_case', operatorValue: '=', value: '0' },
                        ...(calculatorValues?.trunks > 0 && calculatorValues?.voiceProduct)
                            ?
                            [
                                { columnField: `max_${calculatorValues.voiceProduct.toLowerCase()}`, operatorValue: '>=', value: calculatorValues.trunks || 0 }
                            ]
                            :
                            [
                                { columnField: 'max_pri', operatorValue: '=', value: '0' },
                                { columnField: 'max_sip', operatorValue: '=', value: '0' }
                            ],
                        calculatorValues?.networkPlatform ? { columnField: 'network_platform', operatorValue: '=', value: calculatorValues.networkPlatform.toLowerCase() } : null,
                        calculatorValues?.networkPlatform == 'legacy' ? { columnField: 'legacy_company', operatorValue: '=', value: calculatorValues.legacyCompany } : null,
                        calculatorValues?.analogLines > 0 ? { columnField: 'max_analog', operatorValue: '>=', value: calculatorValues.analogLines } : null,
                    ].filter(i => i)
                }

                const sortModel =
                    ['max_pri', 'max_sip', 'max_analog']
                        .sort(column => (column == 'max_' + calculatorValues?.voiceProduct) ? -1 : 1)
                        .map(column => ({ field: column, sort: 'asc' }))


                // apiRef.current.setFilterModel(filterModel)

                if (apiRef?.current?.restoreState) {
                    apiRef.current.restoreState({
                        filter: {
                            filterModel
                        },
                        sorting: {
                            sortModel
                        },
                        ...columnVisibility
                    })
                }
            }, 1500)
        )

    }, [calculatorValues])

    const calculatorTab = (
        <>
            <Grid container spacing={2} style={{ width: '99%', marginLeft: '0px', marginRight: '0px' }}>
                <Grid item xs={6}>
                    <FormControl fullWidth={true}>
                        <InputLabel>Legacy Company</InputLabel>
                        <Select name='legacyCompany' label="Legacy Company" onChange={handleCalculatorFormChange}>
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value='TWC'>L-TWC</MenuItem>
                            <MenuItem value='CHTR'>L-CHTR</MenuItem>
                            <MenuItem value='BHN'>L-BHN</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth={true}>
                        <InputLabel>Network Platform</InputLabel>
                        <Select name='networkPlatform' label="Network Platform" onChange={handleCalculatorFormChange}>
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value='legacy'>Legacy</MenuItem>
                            <MenuItem value='apollo'>Apollo</MenuItem>
                            <MenuItem value='high_capacity'>High Capacity</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth={true}>
                        <InputLabel>Voice Product</InputLabel>
                        <Select name='voiceProduct' label="Voice Product" onChange={handleCalculatorFormChange}>
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value='SIP'>SIP</MenuItem>
                            <MenuItem value='PRI'>PRI</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth={true}>
                        <TextField
                            //value='0'
                            name='analogLines'
                            type="number"
                            label="Number of Analog Lines"
                            onChange={handleCalculatorFormChange}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth={true}>
                        <TextField
                            //value='0'
                            name='trunks'
                            type="number"
                            label="Number of Trunks/Concurrent Calls"
                            onChange={handleCalculatorFormChange}
                            helperText="Keep blank when full analog"
                        />
                    </FormControl>
                </Grid>
            </Grid>

            <CustomTable
                url='/api/eset_db/sese_vgw_matrix'
                tableButtons=''
                stateSave={false}
                apiRef={apiRef}
                initialState={columnVisibility}
                columns={[
                    // All hidden but here for searchability
                    {
                        field: 'part_number',
                        headerName: 'Part Number'
                    },
                    {
                        field: 'use_case',
                        headerName: 'Use Case'
                    },
                    {
                        field: 'max_pri',
                        headerName: 'Max Pri'
                    },
                    {
                        field: 'max_sip',
                        headerName: 'Max Sip'
                    },
                    {
                        field: 'max_analog',
                        headerName: 'Max Analog'
                    },
                    {
                        field: 'special_case',
                        headerName: 'Special Case'
                    },
                    {
                        field: 'approved_firmware',
                        headerName: 'Approved Firmware'
                    },

                    {
                        field: 'legacy_company',
                        headerName: 'Legacy Company'
                    },
                    {
                        field: 'network_platform',
                        headerName: 'Network Platform'
                    },
                    // Shown
                    //{ field: 'rank', headerName: 'Choice', width: 60 },
                    { field: 'vendor', headerName: 'Vendor' },
                    { field: 'model', headerName: 'Model' },
                    {
                        field: 'granite_template',
                        headerName: 'Granite Template',
                        flex: 1,
                        width: 200,
                        renderCell: params => {
                            if (params?.value?.length > 25) {
                                return (
                                    <Tooltip title={params.value} placement='top'>
                                        <span >{params.value}</span>
                                    </Tooltip>
                                )
                            } return null
                        }
                    },
                ]}
            />
        </>
    )

    // Report tab
    const [isLoading, setIsLoading] = useState(false)
    const [dates, setDate] = useState([null, null])

    const downloadReport = () => {
        const [startDate, endDate] = dates.map(date => date?.toISOString()?.split('T')?.[0])

        if (!startDate || !endDate) return showAlert('error', 'Invalid start or end date.')

        setIsLoading(true)

        axios({
            url: paths.GENERATE_VOICE_REPORT,
            method: 'POST',
            data: { startDate, endDate },
            responseType: 'blob', // Important
        }).then((response) => {
            FileDownload(response.data, 'Analog_Voice_Report.xlsx')
            setIsLoading(false)
        })
    }

    const reportTab = (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{marginBottom: 2}}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangePicker 
                        localeText={{ start: 'Start Date', end: 'End Date' }} 
                        onChange={(newValue) => setDate(newValue)}
                    />
            </LocalizationProvider>
            <LoadingButton
                loading={isLoading}
                size="large"
                variant="contained"
                onClick={downloadReport}
                children="Download Report"
                sx={{height: 55, mx: 2, marginTop: '2px'}}
            />
        </Grid>
    )

    return (
        <NewToolWrapper
            titleElement='Voice Gateway Tools'
            tabDefinitions={
                [
                    {
                        label: 'Calculator',
                        content: calculatorTab
                    },
                    {
                        label: 'Report',
                        content: reportTab
                    }
                ]
            }
        />
    )
}

export default VoiceGatewayPicker
