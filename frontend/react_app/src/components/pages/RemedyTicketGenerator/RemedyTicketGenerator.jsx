// Trying to merge the two tools together

// Remedy Ticket Generator
// Backend File : scripts\js\tools\ss_nova_log.js
// Frontend File : views\reports\nova_ticket_creation.ejs
// Purpose : Tool to create remedy tickets
// URL : https://enid.chtrse.com/tools/nova

// Remedy Disconnect Ticket Generator
// Backend File : scripts\js\tools\ss_nova_ticket_generator.js
// Frontend File : views\tools\nova_disconnect.ejs
// Purpose : Tool to create remedy disconnect tickets
// URL : https://enid.chtrse.com/tools/nova_disconnect

// Packages
import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useConfirm } from 'material-ui-confirm';
import { Box, Typography, Stack } from '@mui/material';

// Components
import { ConnectForm } from './ConnectForm'
import { DisconnectForm } from './DisconnectForm';
import { ToolWrapper, SearchInput } from '../../common'

// Hooks
import { useFetch } from '../../hooks';

// Utils
import { actions } from '../../../store'
import paths from '../../../paths'

// Types

// Styles
import './RemedyTicketGenerator.scss';


const RemedyTicketGenerator = () => {
  const dispatch = useDispatch()
  const confirm = useConfirm();
  const { tabs } = useSelector(state => state.globalStates)
  const {
    state: { data, loading, error },
    makeRequest,
    resetFetchState,
  } = useFetch()
  
  const fetchRecord = async selected => {
    resetFetchState()

    dispatch(actions.handleMenu({ key: 'autocomplete', value: false }))
    
    if (tabs === 0) {
      const queryString = `?engineeringID=${selected.Name}&serviceLocation=${selected.Service_Location__c}`

      await makeRequest({ url: paths.REMEDY_CONNECT + queryString })
    } 

    else {
      const queryString = `?engineeringID=${selected.Name}`
      
      await makeRequest({ url: paths.REMEDY_DISCONNECT + queryString })
    }

    if (data?.error) confirm({ title: 'Warning!', description: data?.error, cancellationText: null })
  }

  // =============================================
  // Return
  // =============================================
  return (
    <ToolWrapper
      titleElement="Remedy Ticket Generator"
      tabDefinitions={[
        {
          label: 'Connect',
          content: data && <ConnectForm data={data} />
        },
        {
          label: 'Disconnect',
          content: data && <DisconnectForm data={data} remedyType={tabs} />
        },
      ]}
      toggleWarningListener={data}
      resetFetchState={resetFetchState}
      inputElement={(
        <Box m={1} p={4} px={6}>
          <SearchInput 
            label='Salesforce Search...'
            url={`${paths.REMEDY_SEARCH}?sfId={query}`}
            getOptionLabel={(option) => option.Name}
            renderOption={(option, options) => (
              <Stack
                key={options.Name}
                id={options.Name}
                borderBottom="1px solid rgba(100, 100, 100, 0.2)"
                onClick={() => fetchRecord(options)}
                sx={{
                  px: 2,
                  textAlign: 'left',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(50,50,50,0.1)'
                  }
                }}
              >
                <Typography id={options.Name} variant="subtitle1">{options.Name}</Typography>
                <Typography id={options.Name} variant="subtitle1">{options?.Billing_Account__c}</Typography>
                <Typography id={options.Name} variant="subtitle1">{options.Service_Location_Address__c}</Typography>
              </Stack>
            )}
          />
        </Box>
      )}
      isLoading={loading}
    />
  );
};

export default RemedyTicketGenerator;
