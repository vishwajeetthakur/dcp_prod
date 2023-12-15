// Packages
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert, AlertTitle, Button,
  Box, Collapse, Grid, TableContainer,
  Paper, Table, TableBody, TableCell, Typography, Card, CardContent, CardMedia, CardActionArea, CardActions
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

// Components
import { ToolWrapper } from '../../common'
import SingleInputSearch from '../../common/SingleInputSearch';

// Hooks
import { useFetch } from '../../hooks'

// Utils
import {
  tidRegexPattern,
  ipv4RegexPattern,
  capFirst,
  normalizeCamelCase,
} from '../../../utilities'
import { actions } from '../../../store';
import paths from '../../../paths'

// Types

// Styles
import {
  OuterContentPaper,
  StyledLabelCell,
  StyledTableCell,
  StyledTableRow,
} from '../../common/styled.components';
import './IseCheck.scss';

// let ise_connectivity_check = [
//   { Device_Name: 'RAN', IP: '10.20.220.4', ISE_Working: 'Yes' },
//   { Device_Name: 'RAN', IP: '10.20.220.4', ISE_Working: 'Yes' }
// ]
const ise_connectivity_check = [];
const IseCheck = () => {
  // ==============================================
  // Hooks
  // ==============================================
  const dispatch = useDispatch()
  const { menus } = useSelector(state => state.globalStates)
  const {
    state: { data: response, loading: isLoading, error },
    makeRequest,
    resetFetchState,
  } = useFetch()

  // =============================================
  // State/Refs
  // =============================================
  const searchRef = useRef()
  const [search, setSearch] = useState('');
  const [searched, setSearched] = useState('')

  // =============================================
  // Helpers (Memo, CB, vars)
  // =============================================
  const showAlert = (type, message) => dispatch(actions.createAlert({ message, type }))

  // =============================================
  // Interaction Handlers
  // =============================================
  const handleSubmit = async event => {
    // optional in case handleSubmit by a form submit event
    event?.preventDefault()

    // const search = searchRef.current.value

    setSearched(search)

    resetFetchState()

    if (!search) return showAlert('error', 'Must enter a valid hostname or IP address.')

    let queryString = `?device=${search?.trim()}`
    if (
      !ipv4RegexPattern.test(search) &&
      !tidRegexPattern.test(search)
    ) return showAlert('error', 'Incorrect entry. Must enter a valid hostname or IP address.')

    else await makeRequest({ url: paths.ISE_CHECK + queryString })
  };

  const handleChange = event => setSearch(event.target.value)

  // =============================================
  // Return
  // =============================================
  return (
    <ToolWrapper
      titleElement="ISE Check"
      inputElement={(
        <SingleInputSearch
          // searchRef={searchRef}
          searchLabel="Enter IP Address or Device Hostname"
          searchPlaceholder="10.10.121.2"
          handleChange={handleChange}
          searchValue={search}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          buttonText="submit"
        />
      )}
      content={(
        <>
          {(searched && response) && (
            <Box my={1} p={1} sx={{ border: 'theme.border', borderRadius: 'theme.borderRadius' }}>
              <strong>{isLoading ? `Checking` : `Checked`} {ipv4RegexPattern.test(searched) ? 'IP Address' : 'Hostname'}: {searched}</strong>
            </Box>
          )}

          {ise_connectivity_check.length > 0 && (
            <Box sx={{ marginLeft: '10px' }}>
              <Typography gutterBottom variant="h5" component="div" sx={{ marginBottom: '20px' }}>
                ISE Connectivity Check
              </Typography>
              <table class="container">

                {ise_connectivity_check.map(obj => {
                  return <td> <Card sx={{ background: '#eee', marginRight: '30px', marginBottom: '30px' }}>
                    <CardActionArea>
                      <CardContent>
                        {Object.keys(obj).map(key => {
                          return <Box sx={{ margin: '15px' }} key={key}>

                            <Box component="span" m="{1}" sx={{ fontWeight: 'bold' }}>
                              {key.replace('_', ' ')}
                            </Box>
                            <Box component="span">
                              {key == 'ISE_Working' ? '?: ' : ': '}{obj[key]}
                            </Box>
                          </Box>
                        })}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                  </td>
                })}
              </table>
            </Box>
          )}

          {response && (
            <Box sx={{ marginLeft: '4px' }}>
              <Typography gutterBottom variant="h5" component="div" sx={{ marginBottom: '60px' }}>
                IPC Data
              </Typography>
              <Grid container spacing={4} sx={{ marginLeft: '17px' }}>
                <Card sx={{ background: '#eee', marginRight: '30px', marginBottom: '30px' }}>
                  <CardActionArea>
                    <CardContent>

                      {!response?.ipcData?.data ? (
                        <Box sx={{ textAlign: 'center', m: 2, mt: '10%' }}>
                          <Alert severity="warning" color="error" sx={{
                            p: 2,
                            my: 2,
                            border: 'theme.palette.alert.border.error',
                            justifyContent: 'space-around',
                          }}>
                            <Typography variant="body1" component="p">
                              Device not found in IPC. Will not onboard into ISE until IPC record is present.
                            </Typography>
                          </Alert>
                        </Box>

                      ) :

                        <Box>
                          {!response.ipcData?.data ? (
                            <Box sx={{ textAlign: 'center', m: 2, mt: '10%' }}>
                              <Alert severity="warning" color="error" sx={{
                                p: 2,
                                my: 2,
                                border: 'theme.palette.alert.border.error',
                                justifyContent: 'space-around',
                              }}>
                                <Typography variant="body1" component="p">
                                  Device not found in IPC. Will not onboard into ISE until IPC record is present.
                                </Typography>
                              </Alert>
                            </Box>
                          ) : Object
                            .keys(response?.ipcData.data)
                            .map(key => ['string', 'number'].includes(typeof (response.ipcData.data[key])) ? (

                              <Box sx={{ margin: '15px', paddingTop: '5px' }} key={key}>

                                <Box component="span" m="{1}" sx={{ fontWeight: 'bold' }}>
                                  {capFirst(normalizeCamelCase(key))}
                                </Box>
                                <Box component="span">
                                  {': ' + response.ipcData.data[key]}
                                </Box>
                              </Box>

                            ) : (
                              <Box key={'collapsible-row-' + key} sx={{ margin: '15px', paddingBottom: '20px' }}>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Box component="span" m="{1}" sx={{ fontWeight: 'bold', paddingTop: '6px' }}>
                                    {capFirst(normalizeCamelCase(key))}
                                  </Box>
                                  <Box component="span">
                                    <Button size="small" onClick={() => dispatch(actions.handleMenu({ key, value: !menus[key] }))}>
                                      {menus[key] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                    </Button>
                                  </Box>
                                </Box>
                                <Box>
                                  <Grid container spacing={4} sx={{ marginLeft: '7px' }}>
                                    <Collapse in={menus[key]} timeout="auto" unmountOnExit>

                                      <Card sx={{ background: '#eee', marginTop: '40px' }}>
                                        <CardActionArea>
                                          <CardContent>
                                            {response?.ipcData.data[key].length ? response.ipcData.data[key]
                                              .map(item => Object.keys(item)
                                                .map(nestedKey => ({ key: nestedKey, nestedKey, value: item[nestedKey] }))
                                                .map(({ nestedKey, value }, i) => {

                                                  return <Box sx={{ margin: '15px' }} key={nestedKey}>

                                                    <Box component="span" m="{1}" sx={{ fontWeight: 'bold' }}>
                                                      {capFirst(normalizeCamelCase(nestedKey)) + ': '}                                                  </Box>
                                                    <Box component="span">
                                                      {['string', 'number'].includes(typeof (value)) ? value : value[0]}
                                                    </Box>
                                                  </Box>
                                                })) :
                                              <Box>No additional data available</Box>

                                            }

                                          </CardContent>
                                        </CardActionArea>
                                      </Card>

                                    </Collapse>
                                  </Grid>
                                </Box>
                              </Box>
                            ))}
                        </Box>

                      }
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Box>
          )}

{
            response && (
              <Box sx={{ marginLeft: '4px' }}>
                <Typography gutterBottom variant="h5" component="div">
                  ISE Data
                </Typography>
                <Box sx={{width: '100%'}} > 
                <TableContainer>
                <Table class="container" style={{overflowX: 'auto',  display: 'flex', minWidth: 550}}>
                  {response?.iseData?.message ? (
                    <td> 
                    <Box sx={{ textAlign: 'left', m: 2, mt: '10%' }}>
                      <Alert severity="warning" color="error" sx={{
                        p: 2,
                        my: 2,
                        border: 'theme.palette.alert.border.error',
                        justifyContent: 'space-around',
                      }}>
                        <AlertTitle children="Error" />
                        <Typography variant="body1" component="p">
                          ISE data not found.
                        </Typography>
                        <Typography variant="body1" component="p">
                          {response?.iseData.message}
                        </Typography>
                      </Alert>
                    </Box>
                     </td>
                  ) : Object
                    .keys(response?.iseData || '')
                    .sort()
                    .map(result => !response.iseData[result].length ? (
                      <td> 
                      <Box sx={{ marginTop: '30px'  }}>
                          <Card sx={{ background: '#eee', marginRight: '30px', marginBottom: '30px' }} >
                            <CardActionArea>
                              <CardContent>
                                <Typography gutterBottom variant="h5" component="div" sx={{ marginBottom: '50px' }}>
                                  {capFirst(result.split('_')[0])}
                                </Typography>
                                <Box>No data</Box>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                      </Box>
                      </td>
                    ) :
                      (
                        <Box sx={{ marginLeft: '10px', marginTop: '30px' }}>
                            {response?.iseData[result]?.map((table, i) => {
                              return                         <td> 
                              <Card sx={{ background: '#eee', marginRight: '30px', marginBottom: '30px', maxWidth:'397px' }} key={table.id + i} >
                                <CardActionArea>
                                  <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                      {capFirst(result.split('_')[0])}
                                    </Typography>
                                    {

                                      Object.keys(table).map((key, i) => {
                                        return <Box sx={{ margin: '15px'}} key={key}>

                                          <Box component="span" m="{1}" sx={{ fontWeight: 'bold' }}>
                                            {key === 'link' ? 'Cluster:' : capFirst(key)}
                                          </Box>
                                          <Box component="span">
                                            {key === 'link'
                                              ? <Button variant="text" href={table[key].href} target="_blank" children={<small>{table[key].href}</small>} />
                                              : ': ' + table[key]
                                            }
                                          </Box>
                                        </Box>
                                      })


                                    }
                                  </CardContent>
                                </CardActionArea>
                              </Card>
                              </td>

                            })}
                        </Box>

                      )

                    )}
                    </Table>
                    </TableContainer>
                    </Box>
              </Box>
            )}

        </>
      )}
    />

  );
};

export default IseCheck;
