// Packages
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useConfirm } from 'material-ui-confirm';
import axios from 'axios';
import {
  Alert, Box, Button, CircularProgress,
  FormControlLabel, FormGroup, Grid, IconButton, 
  MenuItem, Stack, Select, Checkbox, Toolbar,
  Typography, Table, TableContainer, TableBody, TextField, 
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { Warning } from '@mui/icons-material';

// Components
import { BasicRead } from '../../common/tables/BasicRead';
import { ToolWrapper } from '../../common';

// Hooks
import { useFetch } from '../../hooks';

// Utils
import { actions } from '../../../store';
import paths from '../../../paths'

// Types

// Styles
import {
  MiddleFormControl,
  OuterContentPaper,
  RightFormAction,
  LeftFormAction,
  StyledLabelCell,
  StyledTableCell,
  StyledTableRow,
} from '../../common/styled.components'
import './RemedyTicketGenerator.scss';



export const ConnectForm = ({ data }) => {
    // ==============================================
    // Hooks
    // ==============================================
    const confirm = useConfirm()
    const dispatch = useDispatch()
    // const {
    //   state: { data: response, loading, error },
    //   makeRequest,
    //   resetFetchState,
    // } = useFetch()
    
    
    // =============================================
    // State/Refs
    // =============================================
    const [reworkReason, setReworkReason] = useState()
    const [comments, setComments] = useState({})
    const [menuStates, setMenuStates] = useState({})
    const [isRework, setIsRework] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [isCreatingTicket, setIsCreatingTicket] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [isResponseCorrect, setIsResponseCorrect] = useState('No')
    const [option, setOption] = useState('1 Gbps')
    const [incorrectFieldReason, setIncorrectFieldReason] = useState()
    const [refreshedGraniteData, setRefreshedGraniteData] = useState()

    const {
      Billing_Account__c,
      Service_Location_Address__c,
      Circuit_ID_Assignment_Notes__c,
      Legacy_Company__c
    } = data.data.result.activeOrder

    // =============================================
    // Helpers (Memo, CB, vars)
    // =============================================
    const showAlert = (type, message) => dispatch(actions.createAlert({ message, type })) 

    const customerInfoFields = [
      {
        label: 'Customer Name',
        value: Billing_Account__c,
        key: 'Billing_Account__c',
      },
      {
        label: 'Address',
        value: Service_Location_Address__c,
        key: 'Service_Location_Address__c',
      },
      {
        label: 'CID Assignment Notes',
        value: Circuit_ID_Assignment_Notes__c,
        key: 'Circuit_ID_Assignment_Notes__c',
      },
      {
        label: 'Legacy Company',
        value: Legacy_Company__c,
        key: 'Legacy_Company__c',
      },
    ]
  
    const constructionFields = [
      { key: 'PRISM_Id__c', header: 'PRISM ID' }, 
      { key: 'Construction_Complete_Date__c', header: 'Construction Complete?' }, 
      { key: 'Build_Type__c', header: 'Build Type' },
      { key: 'hubCLLI', header: 'Hub CLLI' },
      { key: 'Terminating_Hub_Rack_FTP_Port__c', header: 'FTP Assignment' }, 
      { key: 'Primary_Sheath_Type__c', header: 'Sheath' }, 
      { key: 'Estimated_Fiber_Distance_km__c', header: 'Fiber Distance' },
      { key: 'CWDM_Wavelength__c', header: 'Target Wavelength' },
      { key: 'isp_group', header: 'Assigned ISP Group' },
      { key: 'isp_group_notes', header: 'ISP Group Notes' },
    ]

    const formatValue = key => key.split('_')[0] === 'isp'
      ? data.data.assignedISPGroup[key]
      : data.data.result.activeOrder[key] === null
        ? 'null' 
        : data.data.result.activeOrder[key] === false
          ? 'No'
          : data.data.result.activeOrder[key]
            ? data.data.result.activeOrder[key]
            : data.data[key]
  
    const relatedOrdersCols = [
      { key: 'Name', header: 'Engineering ID' },
      { key: 'Billing_Account__c', header: 'Customer Name' },
      { key: 'Product_Family__c', header: 'Product Type' },
      { key: 'Bandwidth__c', header: 'BW' },
      { key: 'Circuit_ID2__c', header: 'Circuit ID' },
    ]
  
    const transportPathsFieldsLeft = [
      { key: 'PARENT_SVC_TYPE', header: 'Service Type' }, 
      { key: 'PARENT_CATEGORY', header: 'Category' }, 
      { key: 'EQUIP_SITE', header: 'Hub Site' },
      { key: 'NETWORK_INFO', header: 'Network Information*' },
    ]
  
    const transportPathsFieldsRight = [
      { key: 'DESCR', header: 'Equipment Description' }, 
      { key: 'VENDOR', header: 'Vendor' }, 
      { key: 'MODEL', header: 'Model' },
      { key: 'PORT_ACCESS_ID', header: 'Port Access ID' },
    ]
  
    const reworkReasons = [
      'Equipment - Bad Port',
      'General - Order requirements changed',
      'ISP - Hub Mux Move Required',
      'ISP - Incorrect Optic Slotted',
      'ISP - Incorrect Port Slotted',
      'ISP - Optic not fully seated',
      'ISP - Disco Ticket Requested',
      'ISP - Routing Table For Hub Selection Wrong',
      'OSP - Incorrect/Conflicting OSP information',
      'OSP - Change in OSP Information/Fiber Verification',
      'Prism Update DL - Build Type Change',
      'Prism Update DL - OSP Info Changed',
      'SE ISP Ticket Eng - Port already in use',
      'SE ISP Ticket Eng - Missing information on the ticket',
    ]

    const incorrectFieldsReasons = [
      '',
      'Incorrect OSP data',
      'Incorrect Granite data',
      'Incorrect Related Orders',
      'Incorrect NOVA/WO History',
      'Missing OSP data',
      'Missing Granite Data',
      'Missing Related Orders',
      'Missing NOVA/WO History',
      'PAT Link Incorrect',
      'Missing ISP Group',
      'Other',
    ]
  
    const handleChange = e => setComments(prev => ({ ...prev, [e.target.id]: e.target.value }))
    
    const handleMenu = (key) => setMenuStates(prev => ({ ...prev, [key]: prev ? !prev[key] : true }))
    
    const refreshGraniteData = async () => {
      if (!data?.data.newRemedyValues.Construction_PRISM_CLLI__c?.length) return showAlert('warning', 'Hub CLLI is required')
  
      try {
        setIsRefreshing(true)

        const response = (await axios.post(paths.REFRESH_GRANITE_DATA, {
          circuit: data?.data.newRemedyValues.Circuit_ID2__c,
          clli: data?.data.newRemedyValues.Construction_PRISM_CLLI__c.slice(0,8)
        })).data

        setRefreshedGraniteData(response)
    
      } catch (error) {
        console.error(error)

      } finally {

        setIsRefreshing(false)
      }
    }

    const formatOptic = (distance, circPath) => {

      let distanceInt = parseInt(distance)
      let opticDistance
      let optic

      if (isNaN(distanceInt) || (distanceInt < 80)) opticDistance = '<80km'
      else if (distanceInt > 80 && distanceInt < 120) opticDistance = '80-120km'
      else opticDistance = '>120km'

      if (circPath.match('GE1\\.')) optic = 'SFP'
      else if (circPath.match('GE10') && circPath.match('CW\\.')) optic = 'XFP'
      else if (circPath.match('GE10') && circPath.match('QW\\.')) optic = 'SFP+'
      
      return `${opticDistance} ${optic}`
    }
    
    const formatTicketParamaters = async (newRemedyValues) => {
      
      const requiredFields = [
        'CWDM_Wavelength__c',
        'Construction_PRISM_CLLI__c',
        'Terminating_Hub_Rack_FTP_Port__c',
        'PARENT_PATH_ID',
        'EQUIP_SITE',
        'PORT_ACCESS_ID',
        'DESCR',
        'Estimated_Fiber_Distance_km__c',
        'Service_Location_Address__c',
        'Circuit_ID2__c',
        'Billing_Account__c',
        // 'Primary_Sheath_Type__c'
      ]
  
      const sanitizedFieldNames = [
        'Wavelength',
        'Hub CLLI',
        'FTP Assignment',
        'Circuit Path',
        'Hub Site',
        'Port',
        'Device TID',
        'Fiber Distance',
        'Service Location Address',
        'Circuit ID',
        'Customer Name',
        'Sheath'
      ]

      //Checks to make sure all the required fields have values
      requiredFields.forEach(field => {

        console.log('Checking required field: ', newRemedyValues, data, field)
      //   if (!newRemedyValues[field] || newRemedyValues[field] === '' || !data.graniteTransportPaths[0][field]) {
          
      //     console.log(newRemedyValues[field] || data.graniteTransportPaths[0][field])

      //     return showAlert(
      //       'error',
      //       `There are missing parameters required for ticket submission.\n(Required Field: ${field})`,
      //       10000
      //     )
      //   }
      })

      //Warning if there is no ISP group assigned
      if (newRemedyValues.isp_group === 'Undetermined') return showAlert(
        'error',
        'An ISP Group must be assigned before ticket creation. Please verify that the \'Hub CLLI\' is valid and try again. If this issue persists, please use the \'Missing ISP Group\' option to report a problem.',
        10000
      )
      
      // Warning if ISP Group is not Automation Eligible or Notes exist for hub
      if (data.assignedISPGroup?.notes) {
        if (confirm({ 
          description: `The following Notes exist for the specifed hub. Please read the notes carefully and press 'Ok' to continue with ticket creation or 'Cancel' to return:\n\n${data.assignedISPGroup.notes.replace(/\\n/g, '<br>')}` 
        })) {
          // pass
        }
        else return;
      }

      if (!data.data.assignedISPGroup.automation_eligible) return showAlert('error', `The specified hub (${data.hubCLLI}) is not currently eligible for NOVA automation. Please submit any required tickets manually.`);
          
      // //Checks for Granite Data
      if (
        data.graniteTransportPaths.length &&
        !data.graniteTransportPaths.some(path => menuStates[path.PARENT_PATH_ID])
      ) return showAlert('error', 'At least one Transport Path must be selected before submitting a ticket.')
       
      //Enter the Network Config Manually if Data is unable to be pulled from CA Spectrum
      if (newRemedyValues.portComments === 'Unable to get uplink information from CA Spectrum' || !newRemedyValues.portComments) {
          // newRemedyValues.portComments = prompt('NOVA was unable to pull the interface status and description from CA Spectrum automatically. Please enter the interface information below:')
          await confirm({
            title: 'Warning!',
            description: 'NOVA was unable to pull the interface status and description from CA Spectrum automatically. Please enter the interface information below:',
            contentProps: {
              children: (
                <LeftFormAction 
                  id="port-comments-input"
                  label="port-comments"
                  variant="outlined"
                  onChange={e => newRemedyValues.portComments = e.target.value}
                  placeholder="Comments"
                  value={newRemedyValues.portComments}
                  fullWidth
                />
              ) 
            }
          })

          if (!newRemedyValues.portComments) return;
      }

      //Warning if existing ISP Ticket exists
      if (data.data.result.activeOrder.ISP_Install_Ticket__c){
        if (confirm({ 
          description: 'An existing WO was found on the Engineering Order. Are you sure you want to continue with new WO creation? This will overwrite existing WO data in Salesforce.\nClick \'Ok\' to continue.' 
        })) {
          // pass
        }
        else return;
      }

      if (isRework && !reworkReason) return showAlert('warning', 'Please select a valid rework reason before submitting a ticket.')


      let params = {
        's0:WO_Type_Field_01': newRemedyValues.Construction_Complete_Date__c ? 'Yes' : 'No',
        //'s0:WO_Type_Field_03': 'Device Slot Interface',
        's0:WO_Type_Field_20': newRemedyValues.Name,
        's0:WO_Type_Field_18': newRemedyValues.PRISM_Id__c || 'Not Available',
        's0:WO_Type_Field_04': formatOptic(newRemedyValues.Estimated_Fiber_Distance_km__c, data.graniteTransportPaths[0].PARENT_PATH_ID),
        's0:WO_Type_Field_05': newRemedyValues.Service_Location_Address__c || 'Not Available',
        's0:WO_Type_Field_10': `${newRemedyValues.Circuit_ID2__c || 'Not Available'}`, 
        's0:WO_Type_Field_11': newRemedyValues.Billing_Account__c || 'Not Available', 
        's0:WO_Type_Field_12': data.graniteTransportPaths[0].DESCR || 'Not Available',
        's0:WO_Type_Field_13': data.graniteTransportPaths[0].PORT_ACCESS_ID || 'Not Available',
        's0:WO_Type_Field_14': newRemedyValues.Terminating_Hub_Rack_FTP_Port__c || 'Not Available',
        's0:WO_Type_Field_15': newRemedyValues.CWDM_Wavelength__c || 'Not Available',
        's0:WO_Type_Field_16': newRemedyValues.Estimated_Fiber_Distance_km__c || 'Not Available',
        's0:WO_Type_Field_17': newRemedyValues.Primary_Sheath_Type__c || 'Not Available',
        's0:Manager_Support_Group_Name': newRemedyValues.isp_group,
        's0:Support_Group_Name': newRemedyValues.isp_group,
        's0:Region': newRemedyValues.isp_region || '',
        's0:Site_Group': newRemedyValues.isp_site_group || '',
        's0:Site': newRemedyValues.isp_common_name || '',
        's0:Chg_Location_Address': newRemedyValues.isp_address || '',
        's0:WO_Type_Field_02': `${newRemedyValues.portComments.replace("<br>", "&#13;")}&#13;&#13;The proceeding “Interface Status”, (DOWN/DOWN) instructs ISP to confidently pull the existing optic as needed to complete the install for this work order build.` || '',
        's0:z1D_Details': `${newRemedyValues.notesToISP || ''}\n\nThis ticket was generated by the SEE&O (NOVA) Remedy Ticket Automation System.\nTo request assistance, please email: DL-SEE&O-SESE-1Remedy-automation@charter.com`
      }

      if (isRework) {
          newRemedyValues.reworkReason = reworkReason || 'Other'
          params['s0:Summary'] = `${data.graniteTransportPaths[0].EQUIP_SITE.slice(0,60)} :: Rework/Troubleshooting Request`
          params['s0:Detailed_Description'] = `${params['s0:WO_Type_Field_05']} :: New Customer Rework/Troubleshooting Request (${newRemedyValues.reworkReason}) :: ${params['s0:WO_Type_Field_10']} :: ${params['s0:WO_Type_Field_11']} :: ${params['s0:WO_Type_Field_12'].slice(0,11)}: ${params['s0:WO_Type_Field_13']}: ${params['s0:WO_Type_Field_14']}: ${params['s0:WO_Type_Field_15']}
          Additional Details: ${params['s0:WO_Type_Field_05']} &#13; Fibers Assigned: ${newRemedyValues.Fibers_Assigned__c || 'N/A'}`
      } else {
          params['s0:Summary'] = `${data.graniteTransportPaths[0].EQUIP_SITE.slice(0,60)} :: New Single Customer Activation`
          params['s0:Detailed_Description'] = `${params['s0:WO_Type_Field_05']} :: New Single Customer Activation :: ${params['s0:WO_Type_Field_10']} :: ${params['s0:WO_Type_Field_11']} :: ${params['s0:WO_Type_Field_12'].slice(0,11)}: ${params['s0:WO_Type_Field_13']}: ${params['s0:WO_Type_Field_14']}: ${params['s0:WO_Type_Field_15']}
          Additional Details: ${params['s0:WO_Type_Field_05']} &#13; Fibers Assigned: ${newRemedyValues.Fibers_Assigned__c || 'N/A'}`
      }

      return params
    }
  
    const handleCreateTicket = async () => {
  
      const { newRemedyValues } = data?.data
  
      
      try {
        setIsCreatingTicket(true)
        
        const ticketParams = await formatTicketParamaters(newRemedyValues)
  
        if (!ticketParams) return

        const body =  { ticketParams, values: newRemedyValues }
        
        console.log({ticketParams})
        
        const response = (await axios.post(paths.REMEDY_SUBMIT_WO, body)).data

        showAlert('success', `Successfully submitted work order!`)

        console.log('create work order ticket response: ', response)
  
      } catch (error) {
        
        console.error(error)
      
      } finally {

        setIsCreatingTicket(false)
      }
    }

    const handleFeedbackFormSubmit = async e => {
      e.preventDefault()
      
      const feedbackFormValues = {
        reviewer: '',
        sf_engineering_id: data.data.newRemedyValues.Name,
        sf_circuit_id: data.data.newRemedyValues.Circuit_ID2__c,
        notes: fields.comments,
        data_correct: isResponseCorrect === 'Yes' ? 1 : 0,
        reason: incorrectFieldReason || null,
        notes: comments['optionalFeedbackComments'] ? comments['optionalFeedbackComments'] : '',
      }

      try {
        console.log(feedbackFormValues)

        const response = (await axios.post(paths.REMEDY_SUBMIT_FEEDBACK, feedbackFormValues)).data

        showAlert('success', `Successfully submitted Feedback`)

        console.log('Submitted Remedy Connect Feedback:  ', response)
        
      } catch (error) {
        
        console.error(error)

        showAlert('error', error.message)
      } finally {

      }
    }

    const handleEditable = e => {
      const { id, innerText } = e.target;
      const { newRemedyValues } = data.data;

      newRemedyValues[id] = innerText;
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
    <Box m={1} p={4} px={6} sx={{ border: 'theme.border', borderRadius: 'theme.borderRadius' }}>
      {/* {data.data.result.existingWOs.length ? (
        <Alert severity="warning" title="Warning" children={`An existing Work Order is present on the Engineering Order. Please check the existing Work Order before submitting a new ticket. (Remedy WO: ${data.data.result.existingWOs[0]})`} />
      ) : null} */}
      <Grid container spacing={2}>
        <Grid item sm={12} md={4}>
          <Stack spacing={2}>
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Typography variant="body1" children="Customer Information" />
            </Box>
            <Table sx={{ height: '100%', width: '100%' }} size="small">
              {data && (
                <TableBody>
                  {customerInfoFields.map(({ key, label, value }) => (
                    <StyledTableRow key={label + '-row'}>
                      <StyledLabelCell>
                        {label}
                      </StyledLabelCell>
                      <StyledTableCell id={key} contentEditable suppressContentEditableWarning onInput={handleEditable}>
                        {value}
                      </StyledTableCell>
                    </StyledTableRow>
  
                  ))}
                </TableBody>
              )}
            </Table>
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Typography variant="body1" children="Construction Job Details" />
            </Box>
            <Table sx={{ height: '100%', width: '100%' }} size="small">
              {data && (
                <TableBody>
                  {constructionFields.map(({ key, header }) => ({
                    key,
                    label: header,
                    value: formatValue(key)
                  })).map(({ key, label, value }) => (
                    <StyledTableRow key={label + '-row'}>
                      <StyledLabelCell>
                        {label}
                      </StyledLabelCell>
                      <StyledTableCell id={key} contentEditable suppressContentEditableWarning onInput={handleEditable}>
                        {value}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </Stack>
        </Grid>

        <Grid item sm={12} md={8}>
          <Grid container> 

            <Grid item xs={12} sm={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" children={`Related Orders (${data.data.result.all.length})`} />
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => handleMenu('orders')}
                >
                  {!menuStates['orders'] ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                </IconButton>
              </Box>
              {!menuStates['orders'] && (
                <Box sx={{ textAlign: 'center', width: '100%', mt: 1 }}>
                  <BasicRead rows={data.data.result.all} columns={relatedOrdersCols} size="small" />
                </Box>
              )}
            </Grid>
  
            <Grid item xs={12} sm={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body1" children="Granite Information" />
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => handleMenu('granite_info')}
                >
                  {!menuStates['granite_info'] ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                </IconButton>
              </Box>
            </Grid>
            {!menuStates['granite_info'] && (
              <>
              {typeof(data.graniteTransportPaths) === 'string' ? (
                <OuterContentPaper>
                <Grid container rowSpacing={1} m={2}>
                  <Grid item sm={12}>
                    <Typography variant="body1" gutterBottom>
                      <Warning color="error" />
                      {' '}
                      <strong>Unable to detect an uplink in Granite.</strong>
                    </Typography>
                  </Grid>
                  <Grid item sm={12}>
                    <Button variant="contained" children="Search Existing Transports" onClick={() => {}} />
                  </Grid>
                  <Grid item sm={12}>
                    <Typography variant="body1" children="OR" gutterBottom />
                  </Grid>
                  <Grid item sm={6} textAlign="right">
                    <MiddleFormControl size="small" sx={{ width: '50%' }}>
                      <Select
                        name="option"
                        value={option}
                        onChange={(e) => setOption(e.target.value)}
                      >
                        {['1 Gbps', '10 Gbps'].map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                      </Select>
                    </MiddleFormControl>
                  </Grid>
                  <Grid item sm={6} textAlign="left">
                    <RightFormAction
                      variant="contained"
                      type="submit"
                      size="small"
                      disabled={isFetching}
                      children={isFetching ? <CircularProgress sx={{ color: 'theme.palatte.primary' }} /> : 'Find a Port'}
                      onClick={() => {}}
                      sx={{ width: '50%' }}
                    />
                  </Grid>
                </Grid>
                </OuterContentPaper>
              ) : (
                <>
                {data.graniteTransportPaths && data.graniteTransportPaths.map((path, i) => (
                  <React.Fragment key={path.PARENT_PATH_ID}>
                    <Grid item sm={12} sx={{ display: 'flex', backgroundColor: 'theme.palette.background.paper', pl:2 }}>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox id="graniteInfo" value={isRework} onChange={() => handleMenu(path.PARENT_PATH_ID)} />}
                        />
                      </FormGroup>
                      <Typography variant="body1" pt={1} children={refreshedGraniteData ? refreshedGraniteData[i].PARENT_PATH_ID : data.graniteTransportPaths[i].PARENT_PATH_ID} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TableContainer>
                        <Table sx={{ height: '100%', width: '100%' }} size="small">
                          {data && (
                            <TableBody>
                              {transportPathsFieldsLeft
                                .map(({ key, header }) => ({
                                  label: header,
                                  value: refreshedGraniteData ? refreshedGraniteData[i][key] : data.graniteTransportPaths[i][key]
                                }))
                                .map(({ label, value }) => (
                                  <StyledTableRow key={label + '-row'}>
                                    <StyledLabelCell>
                                      {label}
                                    </StyledLabelCell>
                                    <StyledTableCell id={label} contentEditable suppressContentEditableWarning onInput={handleEditable}>
                                      {value}
                                    </StyledTableCell>
                                  </StyledTableRow>
                              ))}
                            </TableBody>
                          )}
                        </Table>
                      </TableContainer>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TableContainer>
                        <Table sx={{ height: '100%', width: '100%' }} size="small">
                          {data && (
                            <TableBody>
                              {transportPathsFieldsRight.map(({ key, header }) => ({
                                label: header,
                                value: refreshedGraniteData ? refreshedGraniteData[i][key] : data.graniteTransportPaths[i][key]
                              }))
                              .map(({ label, value }) => (
                                <StyledTableRow key={label + '-row'}>
                                  <StyledLabelCell>
                                    {label}
                                  </StyledLabelCell>
                                  <StyledTableCell id={label} contentEditable suppressContentEditableWarning onInput={handleEditable}>
                                    {value}
                                  </StyledTableCell>
                                </StyledTableRow>
                              ))}
                            </TableBody>
                          )}
                        </Table>
                      </TableContainer>
                    </Grid>
                  </React.Fragment>
                ))}
                <Grid item sm={12}>
                  <Box>
                    <Typography variant="subtitle1">
                      *Edit content by clicking within the Network Information data field.
                      Before ticket submission, please ensure this field contains the necessary 
                      information for ISP to complete installation successfully.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item sm={12} textAlign="right">
                  <Button 
                    variant="contained" 
                    children={isRefreshing
                      ? (
                        <>
                          <Typography variant="body1" component="p" children="Loading..." />
                          {' '}
                          <CircularProgress color="info" />
                        </> 
                      )
                      : 'Refresh Granite Data'
                    }
                    onClick={refreshGraniteData}
                  />
                </Grid>
              </> 
              )}
            </>
            )}
          </Grid>
        </Grid>
      </Grid>
  
      <Box sx={{ height: '100%', width: '100%', textAlign: 'left', mb: 6 }}>
        <Typography variant="body2" component="p" sx={{ width: '100%' }} gutterBottom children="Additional Notes to ISP" />
        <TextField id="ispNotes" value={comments['ispNotes'] || ''} onChange={handleChange} sx={{ width: '100%' }} />
      </Box>

      {menuStates['feedback'] && (
        <Grid container spacing={2} component="form">
          <Grid item sm={12} md={6}>
            <Typography variant="body2" component="p" sx={{ width: '100%' }} gutterBottom children="Are the above fields correct?" />
            <Select
              name="responseCorrect"
              value={isResponseCorrect}
              onChange={e => setIsResponseCorrect(e.target.value)}
              sx={{ width: '100%' }}
            >
              {['Yes', 'No'].map(response => <MenuItem key={response} value={response}>{response}</MenuItem> )}
            </Select>
          </Grid>
          <Grid item sm={12} md={6}>
            <Typography variant="body2" component="p" sx={{ width: '100%' }} gutterBottom children="(If not) choose a reason: " />
            <Select
              placeholder="Choose a Reason..."
              name="incorrectFieldsReason"
              value={incorrectFieldReason || '- Choose Reason -'}
              onChange={e => setIncorrectFieldReason(e.target.value)}
              sx={{ width: '100%' }}
            >
              {incorrectFieldsReasons.map(reason => <MenuItem key={reason} value={reason}>{reason === '' ? '- Choose Reason -' : reason}</MenuItem> )}
            </Select>
          </Grid>
          <Grid item sm={12} md={12} textAlign="left">
            <Typography variant="body2" component="p" sx={{ width: '100%' }} gutterBottom children="Comments (Optional):" />
            <TextField id="optionalFeedbackComments" value={comments['optionalFeedbackComments'] || ''} onChange={handleChange} sx={{ width: '100%' }} />
          </Grid>
          <Grid item sm={12} md={12} textAlign="right" mb={2}>
            <Button variant="contained" children="Submit" type="submit" onClick={handleFeedbackFormSubmit} />
          </Grid>
        </Grid>
      )}
  
      <Box textAlign="right" display="flex" sx={{ height: '48px', gap: '12px' }}>
        <Button variant="contained" children={!menuStates['feedback'] ? "Submit Feedback" : "Close Form"} onClick={() => handleMenu('feedback')} />
        <Toolbar sx={{ flexGrow: 1 }} />
        <FormGroup>
          <FormControlLabel
            control={<Checkbox id="isRework" value={isRework} onChange={() => setIsRework(!isRework)} />}
            label="Is this a Rework?"
          />
        </FormGroup>
  
        {isRework && (
          <Select
            placeholder="Select a Reason..."
            name="reworkReason"
            value={reworkReason || reworkReasons[0]}
            onChange={e => setReworkReason(e.target.value)}
          >
            {reworkReasons.map(reason => <MenuItem key={reason} value={reason}>{reason}</MenuItem> )}
          </Select>
        )}
        <Button 
          variant="contained"
          children={isCreatingTicket ? <CircularProgress color="info" /> : "Create WO"}
          onClick={handleCreateTicket}
        />
      </Box>
  
    </Box>
    )
  }
