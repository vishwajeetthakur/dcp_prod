import React, { useState, useEffect } from "react"
import axios from 'axios'
import { useKeycloakUser } from '../../../hooks/useKeycloakUser'

import {
    Alert,
    Button,
    DialogActions,
    DialogContent,
    Stack,
    CircularProgress,
    Box,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Typography,
} from '@mui/material'


import { BootstrapDialog, BootstrapDialogTitle } from '../../../common/forms/CustomModal'

const DesignComplete = ({
    formOpen,
    handleClose,
    designPortalData,
    setDesignPortalData,
    setFormData
}) => {
    const { keycloakUser } = useKeycloakUser()

    const [designSubmitted, setDesignSubmitted] = useState(false)
    const [designSubmitFinished, setDesignSubmitFinished] = useState(false)

    const [resourceId, setResourceId] = useState()
    const [resourceIdError, setResourceIdError] = useState(false)
    const [resourceIdResponse, setResourceIdResponse] = useState()
    const [resourceIdResponseError, setResourceIdResponseError] = useState(false)
    const [updateSfAndGraniteError, setUpdateSfAndGraniteError] = useState(false)
    const [updateDpError, setUpdateDpError] = useState(false)
    const [error, setError] = useState()
    const [errorMessage, setErrorMessage] = useState()
    const [manualConfigReqText, setManualConfigReqText] = useState('')

    const [activeStep, setActiveStep] = useState(0)

    const steps = [
        {
            label: 'Submit data and retreive a resource ID',
            optional: resourceId,
            error: resourceIdError
        },
        {
            label: 'Wait for resource to complete',
            optional: resourceIdResponse,
            error: resourceIdResponseError
        },
        {
            label: 'Update Salesforce and Granite',
            error: updateSfAndGraniteError
        },
        {
            label: 'Update Design Portal and set to Design Complete',
            error: updateDpError
        },
    ]

    const [errorCheckMessage, setErrorCheckMessage] = useState({ type: 'info', message: 'Running checks...'})

    useEffect(() => {
        if (!formOpen) return

        async function runChecks(){
            if (!designPortalData?.eset?.dp_site?.clli) return { type: 'error', message: 'Please add CLLI code' }
            if (!designPortalData?.eset?.dp_device?.length) return { type: 'error', message: 'No devices to configure' }
            if (['Design Complete', 'Install Complete'].includes(designPortalData?.eset?.dp_order?.status)) return { type: 'error', message: 'Design has already been submitted' }
            if (['Design Failed'].includes(designPortalData?.eset?.dp_order?.status)) return { canSubmit: true, type: 'error', message: 'Design has already been submitted but failed.\nPlease verify the customer in the Meraki Portal before attempting to rerun.' }

            const designCompleteChecks = (await axios.get('/api/design_portal/design_complete_checks?id=' + designPortalData.eset.dp_site.id)).data
            
            const manualConfigReq = 
                Object.entries(
                    designCompleteChecks.manual_config_req
                ).filter(([key, val]) => val).map(([key,]) => key)

            if (manualConfigReq.length > 0) {
                const _manualConfigReqText = 'The following sections will need to be manually configured:\n' +  manualConfigReq.map(i => '    • ' + i).join('\n')
                setManualConfigReqText(_manualConfigReqText)

                return { 
                    canSubmit: true, 
                    type: 'success', 
                    message: 'All checks passed. Design is ready to be submitted.\n\n' + _manualConfigReqText
                }
            }

            return { canSubmit: true, type: 'success', message: 'All checks passed. Design is ready to be submitted.' }
        }

        runChecks().then(errorCheckMessage => {
            setErrorCheckMessage(errorCheckMessage)
        })

    }, [formOpen])


    // Catch in submitDesign loses state, using useEffect as a workaround
    useEffect(() => {
        if (!error) return

        async function processError(){    
            setDesignSubmitFinished(true)         
            setErrorMessage(error.message)
            
            if (activeStep == 0) setResourceIdError(true)
            else if (activeStep == 1) setResourceIdResponseError(true)
            else if (activeStep == 2) setUpdateSfAndGraniteError(true)
            else setUpdateDpError(true)
    
            // Update site history
            const updateSiteHistoryResponse =
                await axios.post(`/api/eset_db/dp_site_history`, {
                    site_id: designPortalData.eset.dp_site.id,
                    address: designPortalData.eset.dp_site.address,
                    clli: designPortalData.eset.dp_site.clli,
                    account_id: designPortalData.eset.dp_site.account_id,
                    customer_name: designPortalData.eset.dp_site.customer_name,
                    table_name: null,
                    action: 'submit',
                    new_value: error,
                    user: keycloakUser.sAMAccountName,
                })
    
            // Update site status to 'Design Failed'
            if (designPortalData?.eset?.dp_order?.status != 'Design Failed') {
                const updateOrderStatusResponse =
                    await axios.put(`/api/design_portal/table/dp_order?id=${designPortalData.eset.dp_order.id}`, { status: 'Design Failed' })
    
                // Update front end data
                setDesignPortalData({
                    ...designPortalData,
                    eset: {
                        ...designPortalData.eset,
                        dp_order: {
                            ...designPortalData.eset.dp_order,
                            status: 'Design Failed'
                        }
                    }
                })
            }
        }

        processError()
        
    }, [error])


    async function submitDesign() {
        if (designPortalData?.eset?.dp_order?.status == 'Design Failed') {
            if (confirm(`Are you sure you want to rerun ${designPortalData?.eset?.dp_order?.epr}?`) == false) {
                return handleCloseWrapper()
            }
        }

        setDesignSubmitted(true)

        try {
            // Send data to sense endpoint
            setActiveStep(0)
            const mneDay0PostResponse =
                await axios.post('/api/design_portal/MNEDay0', { site_id: designPortalData.eset.dp_site.id })
                    .catch(error => ({
                        error: {
                            message: 'Failed to send payload to MDSO',
                            status: error?.response?.status,
                            data: error?.response?.data,
                        }
                    }))
            if (mneDay0PostResponse.error) throw mneDay0PostResponse.error

            const rid = mneDay0PostResponse?.data?.resource_id

            if (!rid) throw { message: 'Failed to reserve licenses in Meraki portal', data: mneDay0PostResponse?.data }

            setResourceId(rid)

            // Get the resource status, this may take a min
            setActiveStep(1)
            const mneDay0GetResponse =
                await axios.get('/api/design_portal/MNEDay0?resource_id=' + rid)
                    .catch(error => ({
                        error: {
                            message: `Failed to retrieve resource from MDSO (Resource ID: ${rid})`,
                            status: error?.response?.status,
                            data: error?.response?.data,
                        }
                    }))
            if (mneDay0GetResponse.error) throw mneDay0GetResponse.error

            if (Object.keys(mneDay0GetResponse.data).length === 0) throw { message: `MDSO returned empty response for resource: ${rid}` }

            const {
                network_id,
                network_name,
                org_id,
                org_name
            } = mneDay0GetResponse.data

            // if any of these are true, then something failed
            const failConditions = {
                network_id: network_id == null,
                org_id: org_id == null,
                network_name: network_name == null,
                org_name: org_name == null,
                mdso_fail: mneDay0GetResponse?.data?.reason != null
            }

            if (Object.values(failConditions).includes(true)) {
                if (
                    !mneDay0GetResponse?.data?.reason.includes('All requested licenses appear to be in the organization inventory already') &&
                    mneDay0GetResponse?.data?.reason !== null
                ) throw { message: `Error occurred reserving licenses: ${mneDay0GetResponse.data.reason}`, mdso_fail_reason: mneDay0GetResponse.data.reason }
                else throw { message: 'Unknown error occured while reservice licenses', failConditions }
            }

            setResourceIdResponse(`Network Name: ${network_name}
                Network ID: ${network_id}
                Organization Name: ${org_name}
                Organization ID: ${org_id}`)

            /////////////
            // Success //
            /////////////

            // Update Salesforce and Granite
            setActiveStep(2)

            // Update Salesforce
            const newSalesforceValues = {
                Id: designPortalData.salesforce.Id,
                ...manualConfigReqText 
                    ? 
                        { 
                            Circuit_Provisioning_Notes__c: manualConfigReqText + '\n\n' + designPortalData.salesforce.Circuit_Provisioning_Notes__c, 
                        } 
                    : 
                        {
                            Circuit_Provisioning_Engineer__c: '0058Z000006MmR8', // dl-seeo-automation@charter.com.eom
                            Circuit_Provisioning_Complete_Date__c: new Date().toISOString().split('T')[0],
                        }
            }

            const updateSalesforce = 
                await axios.post('/api/design_portal/update_salesforce', newSalesforceValues)
                    .catch(error => ({
                        error: {
                            message: `Unable to update Saleforce (${designPortalData?.salesforce?.Id})`,
                            status: error?.response?.status,
                            data: error?.response?.data,
                        }
                    }))
            if (updateSalesforce.error) throw updateSalesforce.error


            // Update Granite
            const updateGranite = 
                await axios.post(
                        '/api/design_portal/update_granite',
                        { 
                            path_inst_id: designPortalData?.granite?.CIRC_PATH_INST_ID,
                            network_id,
                            is_high_availability: !!designPortalData?.eset?.dp_device?.find(i => i.mne_high_availability)
                        }
                    )
                    .catch(error => ({
                        error: {
                            message: `Unable to update the network ID in Granite (${designPortalData?.granite?.CIRC_PATH_INST_ID})`,
                            status: error?.response?.status,
                            data: error?.response?.data,
                        }
                    }))
            if (updateGranite.error) throw updateGranite.error

                
            // Update Design Portal
            setActiveStep(3)
            
            // Update site_history
            const updateSiteHistoryResponse =
                await axios.post(`/api/eset_db/dp_site_history`, {
                    site_id: designPortalData.eset.dp_site.id,
                    address: designPortalData.eset.dp_site.address,
                    clli: designPortalData.eset.dp_site.clli,
                    account_id: designPortalData.eset.dp_site.account_id,
                    customer_name: designPortalData.eset.dp_site.customer_name,
                    table_name: null,
                    action: 'submit',
                    new_value: 'Successfully reserved device license(s)',
                    user: keycloakUser.sAMAccountName,
                })


            // Update site_detail
            const networkAndOrgData = {
                network_id: network_id,
                organization_id: org_id
            }
            
            const updateSiteDetailResponse =
                await axios.put(`/api/design_portal/table/dp_site_detail?id=${designPortalData.eset.dp_site_detail.id}`, networkAndOrgData)

            // Update site status to 'Design Complete'
            const updateOrderStatusResponse =
                await axios.put(`/api/design_portal/table/dp_order?id=${designPortalData.eset.dp_order.id}`, { status: 'Design Complete' })


            // Update front end data
            setDesignPortalData({
                ...designPortalData,
                eset: {
                    ...designPortalData.eset,
                    dp_order: {
                        ...designPortalData.eset.dp_order,
                        status: 'Design Complete'
                    },
                    dp_site_detail: {
                        ...designPortalData.eset.dp_site_detail,
                        ...networkAndOrgData
                    }
                }
            })

            setFormData(old => ({
                ...old,
                ...networkAndOrgData
            }))

            setActiveStep(4)
            setDesignSubmitFinished(true)
        }
        catch (e) {
            // Catch loses state, see useEffect [error]
            setError(e)
        }
    }

    function handleCloseWrapper() {
        if (designSubmitted && !designSubmitFinished) return alert('Unable to close window during operation.')
        handleClose()

        setDesignSubmitted(false)
        setDesignSubmitFinished(false)

        setErrorCheckMessage({ type: 'info', message: 'Running checks...'})

        setResourceId()
        setResourceIdError(false)
        setResourceIdResponse()
        setResourceIdResponseError(false)
        setUpdateSfAndGraniteError(false)
        setUpdateDpError(false)
        setErrorMessage()
        setError()
        setManualConfigReqText('')

        setActiveStep(0)
    }

    return (
        <BootstrapDialog
            onClose={handleCloseWrapper}
            aria-labelledby="customized-dialog-title"
            open={formOpen}
            fullWidth={true}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseWrapper}>
                Submit Design Complete
            </BootstrapDialogTitle>

            <DialogContent dividers >
                {!designSubmitted && <Alert sx={{ whiteSpace: 'pre' }} severity={errorCheckMessage.type}>{errorCheckMessage.message}</Alert>}
                {designSubmitted &&
                    <Box sx={{ maxWidth: 400, marginBottom: '5px' }}>
                        <Stepper activeStep={activeStep} orientation="vertical" >
                            {steps.map(step => (
                                <Step key={step.label}>
                                    <StepLabel
                                        error={step.error}
                                        optional={
                                            step.optional
                                                ? (
                                                    <Stack>

                                                        {step.optional.split('\n').map(string => (
                                                            <Typography variant="caption">{string}</Typography>
                                                        ))}
                                                    </Stack>
                                                )
                                                : ''
                                        }
                                    >
                                        {step.label}
                                    </StepLabel>
                                    <StepContent>
                                        { !step.error && !designSubmitFinished && <Typography><CircularProgress size={30} /></Typography> }
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                }
                { errorMessage && (
                    <Alert severity="error">{errorMessage}</Alert>
                )}
                {designSubmitFinished && !errorMessage && (
                    <Alert severity="success">Order successfully submitted</Alert>
                )}
            </DialogContent>

            <DialogActions>
                <Button id="create-button" disabled={designSubmitted || !errorCheckMessage.canSubmit} autoFocus type="submit" onClick={submitDesign}>
                    Submit
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
};

export default React.memo(DesignComplete);