// Packages
import React from 'react';
import { useDispatch } from 'react-redux'
import axios from 'axios';
import {
  Box, Button, CircularProgress, FormControlLabel, FormGroup, Grid,
  Checkbox, Typography, Table, TableBody,
} from '@mui/material';

// Components

// Hooks
import { useAlerts } from '../../hooks';

// Utils
import { actions } from '../../../store';
;
import paths from '../../../paths'

// Types

// Styles
import {
  StyledLabelCell,
  StyledTableCell,
  StyledTableRow,
} from '../../common/styled.components'
import './RemedyTicketGenerator.scss';


export const DisconnectForm = ({ data, remedyType }) => {
  // =============================================
  // Hooks
  // =============================================
  const { Alerts } = useAlerts()
  const dispatch = useDispatch()
  
  // =============================================
  // State / Refs
  // =============================================
  const [isCreatingTicket, setIsCreatingTicket] = React.useState(false)

  // =============================================
  // Helpers (Memo, CB, vars)
  // =============================================
  
  

  const showAlert = (type, message) => dispatch(actions.createAlert({ message, type })) 
  
  const firstRecord = data.tickets_created[0]

  const { 
    Billing_Account__c,
    Circuit_Design_Notes__c,
    Circuit_ID2__c,
    Circuit_ID_Assignment_Notes__c,
    Id,
    Name,
    Product_Family__c,
    Service_Location_Address__c,
    Service_Location_Street__c,
    Service_Location_Zip_Code__c,
   } = data?.activeOrder
  
  const customerFields = [
      {
        label: 'Customer Name',
        value: Billing_Account__c
      },
      {
        label: 'Address',
        value: Service_Location_Address__c
      },
      {
        label: 'Circuit ID',
        value: Circuit_ID2__c
      },
      {
        label: 'Product Family',
        value: Product_Family__c
      },
    ]
  
    const relatedPathsMiddleFields = [
      {
        label: 'Service Type',
        value: ''
      },
      {
        label: 'Category',
        value: ''
      },
      {
        label: 'Hub Site',
        value: firstRecord?.ticket.hub
      },
      {
        label: 'Assigned ISP Group',
        value: firstRecord?.ticket.isp_group.isp_group
      },
    ]
  
    const relatedPathsRightFields = [
      {
        label: 'Equipment Description',
        value: firstRecord?.ticket.device_name
      },
      {
        label: 'Vendor/Model',
        value: firstRecord?.ticket.vendor + '  ' + firstRecord?.ticket.model
      },
      {
        label: 'Port Access ID',
        value: firstRecord?.ticket.paid
      },
      {
        label: 'Network Information',
        value: ''
      },
    ]
  
  
    const handleDisconnect = async () => {
      
      try {
        setIsCreatingTicket(true)

        // const response = (await Promise.all(data.map(record => (axios.post(paths.REMEDY_DISCONNECT_WO, record)).data)))

        const { response } = (await axios.post(paths.REMEDY_DISCONNECT_WO, firstRecord)).data

        console.log('Submit Disconnect Work Order ticket response: ', response)
        
        showAlert('success', `Successfully submitted work order!`)

      } catch (error) {
        console.error(error)
        
        showAlert('error', error.message)
      
      } finally {

        setIsCreatingTicket(false)
      }
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
      <Box m={1} p={2} px={6} sx={{ border: 'theme.border', borderRadius: 'theme.borderRadius' }}>
        <Grid container>

          <Grid item sm={12}>
            <Box sx={{ width: '100%', textAlign: 'left' }}>
              <Typography variant="body1" pb={1} children="Customer Information" />
            </Box>
            <Table sx={{ height: '100%', width: '100%', border: 'theme.border' }} size="small">
              {data && (
                <TableBody>
                  {customerFields.map(({ label, value }) => (
                    <StyledTableRow key={label + '-row'} sx={{ border: 'theme.border' }}>
                      <StyledLabelCell>
                        {label}
                      </StyledLabelCell>
                      <StyledTableCell>
                        <Typography variant="body1" component="p" children={value} />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </Grid>

          <Box sx={{ width: '100%', textAlign: 'left', mt: 4 }}>
            <Typography variant="body1" py={1} children={`Related Transport Paths (${firstRecord?.ticket.circuit_id || Circuit_ID2__c})`} />
          </Box>

        {firstRecord?.ticket.circuit_id && (
          <>
          <Grid item sm={12}>
            <Box sx={{ width: '100%', height: '100%', px: 1 }}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox id="remedyType" value={remedyType} onChange={() => {}} />}
                  label={firstRecord?.ticket.path_id}
                  variant="body2"
                />
              </FormGroup>
            </Box>
          </Grid>

          <Grid item sm={6}>
            <Table sx={{ height: '100%', width: '100%' }} size="small">
              {data && (
                <TableBody>
                  {relatedPathsMiddleFields.map(({ label, value }) => (
                    <StyledTableRow key={label + '-row'}>
                      <StyledLabelCell>
                        {label}
                      </StyledLabelCell>
                      <StyledTableCell>
                        <Typography variant="body2" component="p" children={value} />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              )}
          </Table>
        </Grid>

        <Grid item sm={6}>
          <Table sx={{ height: '100%', width: '100%' }} size="small">
            {data && (
              <TableBody>
                {relatedPathsRightFields.map(({ label, value }) => (
                  <StyledTableRow key={label + '-row'}>
                    <StyledLabelCell>
                      {label}
                    </StyledLabelCell>
                    <StyledTableCell>
                      <Typography variant="body1" component="p" children={value} />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </Grid>
        </>
        )}

      </Grid>

      <Box mt={2} textAlign="right">
        <Button variant="contained" children={isCreatingTicket ? <CircularProgress color="info" /> : 'Submit Disconnect WO'} onClick={handleDisconnect} />
      </Box>

    </Box>
    )
  }
