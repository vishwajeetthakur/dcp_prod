// Test Circuit ID: 51.L1XX.999999..CHTR

// Packages
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, CircularProgress, Grid, Typography, Accordion, AccordionDetails, AccordionSummary, Chip, Stack } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { StyledDataGrid } from '../../common/styled.components'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { SearchInput } from '../../common'

// Components
import { ToolWrapper } from '../../common';
import CustomTable from '../../common/tables/CustomTable'

// Hooks
import { useFetch } from '../../hooks';

// Utils
import { circuitIdRegex } from '../../../utilities';
import { actions } from '../../../store';
import paths from '../../../paths';

// Types

// Styles
import {
    InnerContentPaper,
    LeftFormAction,
    OuterContentPaper,
    RightFormAction,
} from '../../common/styled.components'

import './GraniteNetworkCompliance.scss'


const NetworkGraniteCompliance = () => {
    // ==============================================
    // Hooks
    // ==============================================
    const dispatch = useDispatch()
    const {
        state: { data: response, loading: isLoading, error },
        makeRequest,
        resetFetchState,
    } = useFetch()

    const [searchValues, setSearchValues] = useState()

    const responseIcon = 
        response?.status == 'Passed' 
            ? <CheckCircleIcon color='primary' sx={{marginLeft: '5px'}}/>
            : response?.status == 'Failed'
                ? <ErrorIcon color='warning' sx={{marginLeft: '5px'}}/>
                :<ErrorIcon color='error' sx={{marginLeft: '5px'}}/>

    // =============================================
    // State/Refs
    // =============================================
    const cidRef = useRef();

    // =============================================
    // Helpers (Memo, CB, vars)
    // =============================================
    const showAlert = (type, message) => dispatch(actions.createAlert({ message, type }))

    // =============================================
    // Interaction Handlers
    // =============================================
    const handleSubmit = async event => {
        event.preventDefault()
        
        resetFetchState()

        if (!searchValues) return showAlert('error', `Circuit ID required.`)

        const queryString = `/api/sense/check_circuit?cid=${searchValues.CIRC_PATH_HUM_ID}&product_name=${searchValues.SERVICE_TYPE}`

        await makeRequest({ url: queryString, method: 'GET' })
    }

    function statusChipSX(status) {
        switch (status) {
            case 'Live':
                return {
                    color: 'success'
                }
            case 'Designed':
                return {
                    color: 'warning'
                }
            case 'Planned':
                return {
                    color: 'warning'
                }
            default:
                return {
                    color: 'error'
                }
        }
    }

    // =============================================
    // Render Methods
    // =============================================

    // =============================================
    // Effects
    // =============================================
    // const { data: { message }, status, pass } = response;

    // =============================================
    // Return
    // =============================================
    return (
        <ToolWrapper
            titleElement="Granite Network Compliance"
            inputElement={(
                <Box p={4} px={6} component="form">
                    <Grid container>
                        <Grid item sm={9}>
                            <SearchInput
                                label="Circuit ID"
                                url="/api/granite/circuit_search/?q={query}"
                                getOptionLabel={(option) => option.CIRC_PATH_HUM_ID}
                                renderOption={(props, option) => (
                                    <Stack direction="row" spacing={1} {...props}>
                                        <div>{option.CIRC_PATH_HUM_ID}</div>
                                        <Chip {...statusChipSX(option.STATUS)} variant="outlined" size="small" label={option.STATUS}/>
                                        <Chip label={option.SERVICE_TYPE} size="small"/>
                                    </ Stack>
                                )}
                                onChange={(event, option) => setSearchValues(option)}
                            />
                        </Grid>
                        <Grid item sm={3}>
                            <RightFormAction
                                type="submit"
                                variant="outlined"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                children={isLoading ? <CircularProgress sx={{ color: 'theme.palette.primary' }} /> : 'Submit'}
                                sx={{ width: '100%' }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            )}
            content={response && (
                <OuterContentPaper elevation={14}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography>{`${response.cid}`}</Typography>
                            {responseIcon}
                        </AccordionSummary>
                        <AccordionDetails sx={{backgroundColor: 'rgba(0, 0, 0, .02)'}}>
                            <Typography>{response.resourceId}</Typography>
                            <Typography sx={{marginBottom: '10px'}}>{response.reason}</Typography>
                            {
                                response.differences != undefined && (
                                    <StyledDataGrid
                                        aria-label="custom-table"
                                        density='compact'
                                        autoHeight
                                        autoWidth
                                        columns={
                                            Object.keys(response.differences[0])
                                                .map(column => ({
                                                    field: column,
                                                    headerName: column.toUpperCase().replace(/_/g, ' '),
                                                    flex: 1
                                                }))
                                        }
                                        rows={response.differences.map((row, id) => ({id, ...row}))}
                                    />
                                )
                            }
                        </AccordionDetails>
                    </Accordion>
                </OuterContentPaper>
            )}
        />

    );
};

export default NetworkGraniteCompliance;

