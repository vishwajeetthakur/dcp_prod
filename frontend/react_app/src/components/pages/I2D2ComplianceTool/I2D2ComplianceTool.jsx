// Packages
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Box, CircularProgress, Grid, Typography, Accordion, AccordionDetails, AccordionSummary, Card, CardActionArea, CardContent, TableContainer, Table, CardHeader, DataGrid, TableBody} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

// Components
import { ToolWrapper } from '../../common';
import { BasicRead } from '../../common/tables/BasicRead';

// Hooks
import { useFetch } from '../../hooks';

// Utils
import { actions } from '../../../store';
import paths from '../../../paths';


// Types

// Styles
import {
    OuterContentPaper,
    RightFormAction,
    LeftFormAction,
    
} from '../../common/styled.components'


import './I2D2ComplianceTool.scss'


const I2D2ComplianceTool = () => {
    // ==============================================
    // Hooks
    // ==============================================
    const dispatch = useDispatch()
    const {
        state: { data: response, loading: isLoading, error, checked: checked},
        makeRequest,
        resetFetchState,
        
    } = useFetch()

    console.log('I2D2 Tool useFetch(): ', response, isLoading)
    console.log(typeof response)
    

    // =============================================
    // State/Refs
    // =============================================
    const tidRef = useRef();

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
        const tid = tidRef.current.value;
        const fileName = 'I2D2_Compliance_Tool.py';
        const queryString = `?args=${tid}`;

        if (!tid) return showAlert('error', `TID required.`)

        await makeRequest({ url:paths.RUN_PYTHON + fileName + queryString, method: 'GET'  })

    }

    // =============================================
    // Return
    // =============================================
    return (
        <ToolWrapper
            
            titleElement={ 
            <Grid container textAlign='center'>
                <Grid item sm={9} pl={28}>
                    <Typography variant="h3" >I2D2 Compliance Tool</Typography>
                    <a href="https://chalk.charter.com/x/dpmAcg" target={'_blank'}>Chalk Documentation</a>
                </Grid>
            </Grid>}
            containerWidth = 'lg'
        
            inputElement = {
                <Box p={4} px={20} component="form">
                    <Grid container columns={12}>

                    
                        <Grid item sm={9}>
                            <LeftFormAction
                                id="tid"
                                label="TID"
                                variant="outlined"
                                fullWidth
                                inputRef={tidRef}
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
                                sx={{ width: '100%' , height: '100%'}}
                            />
                        </Grid>

                    </Grid> 
                       
                </Box>}
   

            content = 
            {response && (
                <OuterContentPaper elevation={14}>
                {response?.map(data => data ? ( 
                            <OuterContentPaper key={data?.descr} elevation={14}>
                                <Accordion >
                                    <AccordionSummary expandIcon={<ExpandMore />} >
                                        <Typography sx={{ textAlign: 'left', width: '100%', mt: 1, mb: 1, color: data?.dns_compliance ? 'MediumSeaGreen':'DeepPink'}} variant="h5" children={`${data?.descr ? data?.descr : data?.tid}  (${data?.dns_compliance  ? 'PASS' : 'FAIL'})`}/>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        {/* ROW 1 */}
                                       <Grid container columns={2} spacing={0.5}>
                                            <Grid item xs={1}>
                                                <Card>
                                                    <CardHeader subheader='Granite'/>
                                                    <CardContent>
                                                        <Grid container columns={6} spacing={0.5}>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Equip ID:'}/></Grid>
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.descr}`}/></Grid>

                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Vendor:'}/></Grid>
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.vendor}`}/></Grid>

                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Model:'}/></Grid>
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.model}`}/></Grid>

                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Status:'}/></Grid>
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.status}`}/></Grid>

                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'FQDN:'}/></Grid>
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.target_id}`}/></Grid>
                                            
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'IPv4:'}/></Grid>
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.attr_value}`}/></Grid>

                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'IPv4 MGMT TYPE:'}/></Grid>
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.ip_mgmt_type}`}/></Grid>
                                                            
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Card>
                                                    <CardHeader subheader='IPC'/>
                                                    <CardContent>
                                                        <Grid container columns={7} spacing={0.5}>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Container:'}/></Grid>
                                                            <Grid item xs ={5}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.ipc_container}`}/></Grid>

                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Device Type:'}/></Grid>
                                                            <Grid item xs ={5}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.ipc_deviceType}`}/></Grid>

                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Hostname:'}/></Grid>
                                                            <Grid item xs ={5}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.ipc_hostname}`}/></Grid>

                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Domain Name:'}/></Grid>
                                                            <Grid item xs ={5}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.ipc_domainName}`}/></Grid>

                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'IP Address:'}/></Grid>
                                                            <Grid item xs ={5}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.ipc_ipAddress}`}/></Grid>

                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Address Type:'}/></Grid>
                                                            <Grid item xs ={5}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.ipc_addressType}`}/></Grid>

                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Record Flag:'}/></Grid>
                                                            <Grid item xs ={5}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.ipc_resourceRecordFlag}`}/></Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>

                                        {/* ROW 2 */}
                                        <Grid container columns={2} spacing={0.5}>
                                            <Grid item xs={1}>
                                                <Card>
                                                    <CardHeader subheader='DX (CA) Spectrum'/>
                                                    <CardContent>
                                                        <Grid container columns={6} spacing={0.5}>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Last Poll Date:'}/></Grid>
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.dx_last_poll}`}/></Grid>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Vendor:'}/></Grid>
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.dx_vendor_name}`}/></Grid>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Device Type:'}/></Grid>
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.dx_device_type}`}/></Grid>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'IP Address:'}/></Grid>
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.dx_ip}`}/></Grid>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'MAC Address:'}/></Grid>
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.dx_mac}`}/></Grid>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Serial No:'}/></Grid>
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.dx_serial_nbr}`}/></Grid>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Entry Count:'}/></Grid>                                    
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.dx_entry_count}`}/></Grid>
                                                            
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs ={1}>
                                                <Card>
                                                    <CardHeader subheader='DNS'/>
                                                    <CardContent>
                                                        <Grid container columns={7} spacing={0}>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'A Records:'}/></Grid>
                                                            <Grid item xs ={5}>
                                                                {data?.a_recs?.map(record => {
                                                                    return <Typography sx={{ textAlign: 'right', width: '100%'}} children={`${Object.keys(record)} -> ${record[Object.keys(record)]}`}/>
                                                                })}
                                                            </Grid>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'A Count:'}/></Grid>                                                            
                                                            <Grid item xs ={5}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.a_rec_count}`}/></Grid>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'Unique IP Count:'}/></Grid>
                                                            <Grid item xs ={5}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.a_rec_num_unique_ips}`}/></Grid>
                                                            <Grid item xs ={7}><br/></Grid>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'PTR Records:'}/></Grid>
                                                            <Grid item xs ={5}>
                                                                {data?.ptr_recs?.map(record => {
                                                                    return <Typography sx={{ textAlign: 'right', width: '100%'}} children={`${Object.keys(record)} -> ${record[Object.keys(record)]}`}/>
                                                                })}
                                                            </Grid>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'PTR Count:'}/></Grid>                                                   
                                                            <Grid item xs ={5}><Typography sx={{ textAlign: 'right', width: '100%'}} children={`${data?.ptr_rec_count}`}/></Grid>
                                                            
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>

                                        {/* ROW 3 */}
                                        <Grid container columns={9} spacing={2}>
                                            <Grid item xs={1}>
                                                <Card>
                                                    <CardHeader subheader='ISE'/>
                                                    <CardContent>
                                                        <Grid container columns={6} spacing={0.5}>
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'West'}/></Grid>                                                            
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%', color: data?.ise_status_west ? 'MediumSeaGreen':'DeepPink'}} children={`\u2b24`}/></Grid>
                                                            
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'East'}/></Grid>                                                            
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%', color: data?.ise_status_east ? 'MediumSeaGreen':'DeepPink'}} children={`\u2b24`}/></Grid>
                                                            
                                                            <Grid item xs ={2}><Typography sx={{ textAlign: 'left', width: '100%'}} children={'South'}/></Grid>                                                            
                                                            <Grid item xs ={4}><Typography sx={{ textAlign: 'right', width: '100%', color: data?.ise_status_south ? 'MediumSeaGreen':'DeepPink'}} children={`\u2b24`}/></Grid>
                                                        
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs ={8}>
                                                <Card>
                                                    <CardHeader subheader='Errors:'/>
                                                    <CardContent>
                                                        <Grid>
                                                            {data?.errors.map(error => {
                                                                return <Typography sx={{ textAlign: 'left', width: '100%', ml: 0, mb: 1}} children = {`\u2022 ${error}`}/>
                                                                })
                                                                }
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>                         

                                    </AccordionDetails>
                                    
                                </Accordion>
                            </OuterContentPaper>
                        ):'')}
                </OuterContentPaper>
            )}
        />

    );
};

export default I2D2ComplianceTool;

