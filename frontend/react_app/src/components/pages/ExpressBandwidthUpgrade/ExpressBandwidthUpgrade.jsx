// Backend File : scripts/js/utilities/ss_ebu.js
// Frontend File : views/tools/ebu.ejs
// Purpose : Performs design and saleforce checks, then upgrade the bandwidth in Granite (documentation only)
// URL : https://enid.chtrse.com/tools/ebu
// Test Eng ID : ENG-02970108

// Packages
import React, { useRef, useState } from 'react'
import axios from 'axios'

import {
    Alert, Box, CircularProgress, Grid, Typography,
    Table, TableBody, TableContainer, TableHead
} from '@mui/material'

import { OuterContentPaper } from '../../common/styled.components'

import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'

// Components
import { NewToolWrapper } from '../../common'

// Utils
import { actions } from '../../../store'

// Types

// Styles
import {
    LeftFormAction,
    RightFormAction,
    StyledTableCell,
    StyledTableRow,
} from '../../common/styled.components';
import './ExpressBandwidthUpgrade.scss';


const ExpressBandwidthUpgrade = () => {
    // =============================================
    // State/Refs
    // =============================================
    const eprRef = useRef()
    const [isFetching, setIsFetching] = useState(false)
    const [response, setResponse] = useState(null)

    // =============================================
    // Helpers (Memo, CB, vars)
    // =============================================
    const showAlert = (type, message) => dispatch(actions.createAlert({ message, type }))

    // =============================================
    // Interaction Handlers
    // =============================================
    const handleSubmit = async () => {
        setResponse(null)
        setIsFetching(true)

        const epr = eprRef.current.value?.trim()

        if (!epr.length) return showAlert('error', 'Must enter an Engineering Page ID.')

        const ebuResponse =
            await axios.get(`/api/ebu?epr=${epr}`)
                .catch(e => {
                    console.log(e)

                    return { error: 'A error occurred' }
                })

        setResponse(ebuResponse?.data)
        setIsFetching(false)
    }

    // =============================================
    // Render Methods
    // =============================================

    // =============================================
    // Effects
    // =============================================

    // =============================================
    // Return
    // =============================================
    return (
        <NewToolWrapper
                titleElement={<Typography variant="h3" children="Express Bandwidth Upgrade Tool" />}

                content={
                    <Box m={1} p={4} px={6} component="form">
                        <Grid container>
                            <Grid item sm={9}>
                                <LeftFormAction
                                    id="epr"
                                    label="ENG-123456789"
                                    variant="outlined"
                                    inputRef={eprRef}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item sm={3}>
                                <RightFormAction
                                    variant="outlined"
                                    size="large"
                                    type="submit"
                                    fullWidth
                                    disabled={isFetching}
                                    children={isFetching ? <CircularProgress sx={{ color: 'theme.palatte.primary' }} /> : 'Submit'}
                                    onClick={handleSubmit}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                
                }

                response={response && (
                    <OuterContentPaper elevation={14}> 
                        {response?.error ? (
                            <Alert icon={false} color="warning" sx={{
                                p: 2,
                                my: 2,
                                border: 'theme.palette.alert.border.warning',
                                justifyContent: 'space-around',
                            }}>
                                <Typography variant="h5" component="h5">Overall Status: Warning {JSON.stringify(response.error)}</Typography>
                            </Alert>
                        ) : null}

                        {/* <Box sx={{ width: '100%', textAlign: 'center', margin: '8px', padding: '32px', paddingLeft: '48px', paddingRight: '48px' }}> */}
                        <Box sx={{ width: '100%', textAlign: 'center', padding: '24px',}}>

                            <Alert
                                icon={false}
                                color={response.processing_completed ? 'success' : 'error'}
                                sx={theme => ({
                                    marginBottom: '15px',
                                    border: `1px solid ${response.processing_completed
                                        ? theme.palette.alert.border.success
                                        : theme.palette.alert.border.error}`,
                                    justifyContent: 'space-around',
                                })}
                            >
                                <Typography variant="h5" component="h5">Overall Status: {response.processing_completed ? 'Pass' : 'Fail'}</Typography>
                            </Alert>
                            <TableContainer>
                                <Table sx={{ border: 'theme.border'}} size="small">
                                    <TableHead>
                                        <StyledTableRow sx={{ border: 'theme.border' }}>
                                            {['', 'Check', 'Value'].map(key => (
                                                <StyledTableCell key={key} sx={theme => ({ backgroundColor: theme.palette.background.paper })}>
                                                    <strong>{key}</strong>
                                                </StyledTableCell>
                                            ))}
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(response.checks).map(key => ({
                                            key: key + '-row',
                                            pass: response.checks[key].pass || false,
                                            check: key,
                                            value: response.checks[key]?.value
                                        })).map(({ key, pass, check, value }) => (
                                            <StyledTableRow
                                                key={key}
                                                sx={theme => ({
                                                    border: theme.border.main,
                                                    backgroundColor: pass
                                                        ? theme.palette.success.row
                                                        : theme.palette.error.row
                                                })}
                                            >
                                                <StyledTableCell sx={{ width: '35px' }}>
                                                    <div style={{marginBottom: '-6px'}}>
                                                        {pass
                                                            ? <CheckIcon size="small" color="success" />
                                                            : <ClearIcon size="small" color="error" />
                                                        }
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <Typography variant="body1" component="p" children={check} sx={theme => ({
                                                        wordBreak: 'break-word',
                                                        color: pass ? theme.palette.success.text : theme.palette.error.text
                                                    })} />
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <Typography variant="body1" component="p" children={value} sx={theme => ({
                                                        wordBreak: 'break-word',
                                                        color: pass ? theme.palette.success.text : theme.palette.error.text
                                                    })} />
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </OuterContentPaper>
                )}
        />
    );
};

export default ExpressBandwidthUpgrade;
