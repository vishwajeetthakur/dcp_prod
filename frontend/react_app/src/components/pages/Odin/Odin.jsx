// Backend File : scripts/js/utilities/odin2.0.js
// Frontend File : views/tools/odin.ejs
// Purpose : Query CID to verify design standards
// URL : https://enid.chtrse.com/tools/odin

// Packages
import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import {
    Alert, Box, CircularProgress,
    FormControlLabel, FormGroup, Grid, FormControl,
    IconButton, MenuItem, Select, Switch, Typography, TextField,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel, Button
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

// Components
import { NewToolWrapper } from '../../common'
import CustomTable from '../../common/tables/CustomTable'

// Utils
import { actions } from '../../../store'
import paths from '../../../paths'

//hooks
import { useColorMode, useKeycloakUser } from "../../hooks";

// Styles
import {
    OuterContentPaper,
    LeftFormAction,
    MiddleFormControl,
    RightFormAction,
} from '../../common/styled.components'
import './Odin.scss'
// import { TextField } from 'formik-mui'

const Odin = () => {
    const autoSelectTaskName = '* AUTO SELECT *'

    // =============================================
    // State/Refs
    // =============================================
    const keycloakUser = useKeycloakUser()
  
    const dispatch = useDispatch()
    const { mode } = useColorMode();

    const cidRef = useRef()
    const taskRef = useRef()

    const [state, setState] = useState({
        data: [],
        checked: true,
        isFetching: false,
        detailsOpen: true,
        taskName: autoSelectTaskName
    })
    const [reportState, setReportOpen] = useState(false);
    const [issuePayload, setissuePayload] = useState({issueType:'1', issueSummary: '', exampleCircuit:'', issueDescr:''})

    // =============================================
    // Helpers (Memo, CB, vars)
    // =============================================
    const { data, isFetching, checked, detailsOpen } = state

    const circuitIdRegex = /^\d\d\..{4}\.\d{6}\..*?\..{4}(|\.\d\d\d)$|^\d{5}\..{3,5}\..{11}\..{11}$/

    const taskNames = [
        autoSelectTaskName,
        'FIA_BY_PATH',
        'DWDM_BY_PATH',
        'CWDM_BY_PATH',
        'CAR_DIA_BY_PATH',
        'SIP_BY_PATH',
        'EVPL_BY_PATH',
        'ELAN_BY_PATH',
        'FIN_INT_BY_PATH',
        'ELINE_CTBH_BY_PATH',
        'CWS_BY_PATH',
        'PRI_BY_PATH',
        'E_ACC_EVPL_BY_PATH',
        'EPL_BY_PATH',
        'E_ACC_EPL_BY_PATH',
        'ETH_TRANSP_BY_PATH',
        'WIA_BY_PATH',
        'Hosted Voice By Path',
        'CLOUD-CON By Path'
    ]

    const serviceTypeToTaskName = {
        'CAR-DIA': 'CAR_DIA_BY_PATH',
        'CAR-EPL': 'CWS_BY_PATH',
        'CAR-E-TRANSPORT FIBER/FIBER EPL': 'CWS_BY_PATH',
        'CAR-E-ACCESS FIBER/FIBER EPL': 'E_ACC_EPL_BY_PATH',
        'CAR-E-ACCESS FIBER/FIBER EVPL': 'E_ACC_EVPL_BY_PATH',
        // 'COM-EPLAN': 'ELAN_BY_PATH',
        // 'CAR-EPLAN': 'ELAN_BY_PATH',
        'COM-EPLAN': (graniteData) => { 
            const cloudService = {
                'vCLOUD': 'CLOUD-CON By Path',
                'xCLOUD': 'CLOUD-CON By Path',
                'NOT REQUESTED': 'ELAN_BY_PATH',
                'NONE': 'ELAN_BY_PATH'
            }
            return cloudService[graniteData.CLOUD_SERVICE]
        },
        'CAR-EPLAN': (graniteData) => { 
            const cloudService = {
                'vCLOUD': 'CLOUD-CON By Path',
                'xCLOUD': 'CLOUD-CON By Path',
                'NOT REQUESTED': 'ELAN_BY_PATH',
                'NONE': 'ELAN_BY_PATH'
            }
            return cloudService[graniteData.CLOUD_SERVICE]
        },
        'CAR-CTBH 4G': 'ELINE_CTBH_BY_PATH',
        'COM-EPL': 'EPL_BY_PATH',
        'COM-EVPL': 'EVPL_BY_PATH',
        'CAR-EVPL': 'EVPL_BY_PATH',
        'COM-DIA': 'FIA_BY_PATH',
        'COM-BURSTABLE DIA': 'FIA_BY_PATH',
        'HSD-RESALE': 'FIN_INTERNET_BY_PATH',
        'COM-BUSINESS CLASS PRI': 'PRI_BY_PATH',
        'CUS-VOICE-PRI': 'PRI_BY_PATH',
        'COM-BUSINESS CLASS SIP TRUNKS': 'SIP_BY_PATH',
        'CUS-VOICE-SIP': 'SIP_BY_PATH',
        'CUS-VOICE-HOSTED': 'Hosted Voice By Path',
        'CUS-INTERNET ACCESS': (graniteData) => {
            const serviceMediaTaskNames = {
                'LTE': 'WIA_BY_PATH',
                'FIBER-RESALE': 'FIN_INT_BY_PATH',
                'HSD-RESALE': 'FIN_INT_BY_PATH',
            }

            return serviceMediaTaskNames[graniteData.SERVICE_MEDIA]
        }
    }

    const responseTableCols = [
        { field: 'circ_path_rev_nbr', headerName: 'Revision', width: 70, flex: 0 },
        { field: 'RULE_NAME', headerName: 'Rule Name', width: 150, flex: 1 },
        { field: 'ERROR_CODE', headerName: 'Error Code', width: 150, flex: 1},
        { field: 'FIELD_NAME', headerName: 'Field Name', width: 150, flex: 0},
        { field: 'CURRENT_VALUE', headerName: 'Current Value', width: 150, flex: 0},
    ]

    const showAlert = (type, message) => dispatch(actions.createAlert({ message, type }))

    const handleChange = (event) => {
        const { id, checked, name, value } = event.target

        switch (id || name) {
            case 'checked': return setState(prev => ({ ...prev, checked }))
            default: return setState(prev => ({ ...prev, [id || name]: value }))
        }
    }

    const getCids = () => {
        const cid = cidRef.current.value;
        const circuitIds =
            cid.split(",")
                .map((cir) => cir.trim())
                .filter(i => i)

        return circuitIds
    }

    const handleSubmit = async event => {
        event.preventDefault()
        setState({ ...state, isFetching: true, data: [] })

        const circuits = [...new Set(getCids())]

        if (circuits.length == 0) showAlert('error', 'No circuit ID/s provided.')

        const promises = circuits.map(async (circuit) => {
            return new Promise(async (resolve, reject) => {
                // Invalid Circuit ID
                if (circuitIdRegex.test(circuit) == false) {
                    return resolve({circuit, error: `Invalid Circuit ID.`})
                }

                try {
                    let task = state.taskName

                    if (task === autoSelectTaskName) {
                        const graniteResponse = await axios.get(paths.GRANITE_CIRCUIT_SEARCH + `?q=${circuit}`)
                        // Unable to find the CID
                        if (!graniteResponse?.data?.length) {
                            return resolve({circuit, error: `Circuit not found in Granite.`})
                        }

                        const circuitData =
                            (graniteResponse?.data?.length > 1 && !checked)
                                ? graniteResponse?.data?.[1]
                                : graniteResponse?.data?.[0]

                        const selectedTask = serviceTypeToTaskName[circuitData.SERVICE_TYPE]
                        task = (typeof selectedTask == 'function') ? selectedTask(circuitData) : selectedTask
                    }

                    const requestData = {
                        circuit: circuit,
                        taskName: task,
                        statusFilter: checked
                    }

                    const { data } = await axios.post(paths.ODIN_CHECK, requestData)
                    resolve({ ...data, task_name: task })

                } catch (error) {
                    console.error(error)

                    // showAlert('error', `${error.code}: ${error.message}.\n${error?.response?.data}`, 12000);

                    resolve({circuit, error: error?.response?.data || error})
                }
            })
        })

        const data = await Promise.all(promises)

        // cidRef.current.value = ''
        setState(prev => ({ ...prev, isFetching: false, data }))
    }

    const handleIssueType = (event) => {
        const { id, checked, name, value } = event.target
        switch (id || name) {
            // case 'checked': return setissuePayload(prev => ({ ...prev, checked }))
            default: return setissuePayload(prev => ({ ...prev, [id || name]: value }))
        }
    }

    const handleReportOpen = () => {
        setReportOpen(true);
    }

    const handleReportClose = () => {
        setReportOpen(false);
    }

    const handleReportCancel = () => {
        handleReportClose()
    }

    const handleReportSubmit = () => {
        submitReport()
        handleReportClose()
    }

    const submitReport = async event => {
        const user      = await getUser()
        const ticket    = await createJira(buildTicketPayload(user))

        if(ticket.data.key){
            if(user != 'svc-enteng-crntrkdsn'){
                addWatcher(ticket.data.key, user)
            }
            showAlert('info',`Ticket Submitted: ${ticket.data.key}`)
        }
        else{
            showAlert('error','Ticket Creation Failed')
        }    
        resetReport()
    }

    const resetReport = () => {
        setissuePayload({issueType:'1', issueSummary: '', exampleCircuit:'', issueDescr:''})
    }

    const getUser = async () => {
        let user = await checkUser(keycloakUser['keycloakUser']['data']['username'])
        if (user.data.key) {
            user = keycloakUser['keycloakUser']['data']['username']
        }
        else {
           user = 'svc-enteng-crntrkdsn'
        }
        return user
    }

    const checkUser = async (username) => {
        try{
            const jira_response = await axios.get(paths.JIRA + '/getUser'+`?args=${username}`)
            return jira_response
        }
        catch (e) {
            return e.response
        }
    }

    const buildTicketPayload = (user) => {
        const payload = {
            project         : {id: "92901"},
            issuetype       : {id: issuePayload.issueType ? issuePayload.issueType : "1"},
            priority        : {id: '3'},
            summary         : issuePayload.issueSummary ? issuePayload.issueSummary : "None Provided",
            description     : (keycloakUser['keycloakUser']['data']['username']? keycloakUser['keycloakUser']['data']['username'] : user).concat(" | ", issuePayload.exampleCircuit ? issuePayload.exampleCircuit : "None Provided", " | ",issuePayload.issueDescr? issuePayload.issueDescr : "None Provided"),
            reporter        : {name: user},
            components      : [{id: "117720"}]
        }
        return payload
    }

    const createJira = async payload => {
        try{
            const jira_response =  await axios.post(paths.JIRA + '/createSEEDI', payload)
            return jira_response
        }
        catch (e) {
            return e.response
        }
    }

    const addWatcher = async (ticket, user) => {
        try{
            const jira_response =  await axios.post(paths.JIRA + '/addWatcher', {ticket : ticket, user : user})
        } 
        catch (e) {
           
        }

    }


    // Render
    return (
        <>
            <NewToolWrapper
                titleElement={(
                    <Grid container textAlign='center'>
                        <Grid item sm={9} pl={28}>
                            <Typography variant="h3" children="ODIN Check Tool" />
                        </Grid>
                        <Grid item sm={3} pr={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <FormGroup >
                                <FormControlLabel
                                    control={<Switch id="checked" checked={checked} onChange={handleChange}  color={mode == "light" ? "secondary" : "warning"}/>}
                                    label="Check Designed Path"
                                />
                            </FormGroup>
                        </Grid>
                    </Grid>
                )}

                content={
                    <Box m={1} p={4} px={6} component="form">
                        <Grid container>
                            <Grid item sm={7}>
                                <LeftFormAction
                                    id="cid"
                                    label="Circuit ID"
                                    variant="outlined"
                                    inputRef={cidRef}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item sm={3}>
                                <MiddleFormControl fullWidth>
                                    <Select
                                        name="taskName"
                                        inputRef={taskRef}
                                        value={state.taskName}
                                        onChange={handleChange}
                                    >
                                        {taskNames.map(task => <MenuItem key={task} value={task}>{task}</MenuItem>)}
                                    </Select>
                                </MiddleFormControl>
                            </Grid>
                            <Grid item sm={2}>
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

                response={
                    data?.map(elem => {
                        // // Adding id column to records for table
                        elem.records = elem?.records?.map((obj, index) => ({ id: index, ...obj }))

                        return elem?.pass
                            ? <OuterContentPaper key={elem?.circuit} elevation={14}><Alert severity="success"> {`${elem?.circuit} (${elem?.task_name})`}</Alert></OuterContentPaper>
                            : !elem.circuit_found
                                ? elem.error
                                    ? <OuterContentPaper key={elem?.circuit} elevation={14}><Alert severity="warning"> {`${elem?.circuit} (${elem?.task_name}) - ${elem?.error}`}</Alert></OuterContentPaper>
                                    : <OuterContentPaper key={elem?.circuit} elevation={14}><Alert severity="warning"> {`${elem?.circuit} (${elem?.task_name}) - Circuit not found`}</Alert></OuterContentPaper>
                                : <OuterContentPaper key={elem?.circuit} elevation={14}>
                                            <Alert severity='error' action={
                                                <IconButton
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => setState(prev => ({ ...prev, detailsOpen: !detailsOpen }))}
                                                >
                                                    {detailsOpen ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                                                </IconButton>
                                            }>
                                                {`${elem?.circuit} (${elem?.task_name})`}
                                            </Alert>
                                            {detailsOpen && (
                                                <Box sx={{ textAlign: 'center', width: '100%', mt: 2 }}>
                                                    {elem.records.CATEGORY}
                                                    {elem?.records.length > 0 && <CustomTable columns={responseTableCols} data={elem?.records} tableButtons='' />}
                                                </Box>
                                            )}
                                    </OuterContentPaper>
                    })
                }
            />
            <Grid container textAlign='center'>
                <Grid item sm={9} pl={39}>
                    <Button onClick={handleReportOpen}>Submit ODIN Change Request</Button> 
                    <Dialog open={reportState} onClose={handleReportClose} PaperProps={{sx: {height: 655, width: 800}}}>
                        <DialogTitle textAlign='center'> Submit ODIN Change Request Ticket</DialogTitle>
                        <DialogContent>
                            <DialogContentText textAlign='center' style={{paddingBottom:15}}>Check <a href='https://chalk.charter.com/x/_i5aUw' target='_blank'>HERE</a> to view currently open issues</DialogContentText>
                            <FormControl id="issueType" fullWidth style={{paddingBottom:5}}>
                                <InputLabel ></InputLabel>
                                <Select 
                                  defaultValue={"1"}
                                  id="issueType"
                                  name='issueType'
                                  onChange = {handleIssueType}>
                                    <MenuItem value="1">Bug</MenuItem> 
                                    <MenuItem value="7">Enhancement</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                id="issueSummary"
                                label="Summary"
                                fullWidth
                                multiline
                                minRows={1}
                                maxRows={1}
                                variant="outlined"
                                onChange={handleIssueType}
                                style={{paddingBottom:5}}
                            />
                            <TextField
                                id="exampleCircuit"
                                label="Example Circuit"
                                fullWidth
                                multiline
                                minRows={1}
                                maxRows={1}
                                variant="outlined"
                                onChange={handleIssueType}
                                style={{paddingBottom:5}}
                            />
                            <TextField
                                id="issueDescr"
                                label="Description"
                                fullWidth
                                multiline
                                minRows={12}
                                maxRows={12}
                                variant="outlined"
                                onChange={handleIssueType}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleReportCancel}>Cancel</Button>
                            <Button onClick={handleReportSubmit}>Submit</Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        </>
    )
}


export default Odin

