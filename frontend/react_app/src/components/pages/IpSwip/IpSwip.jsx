// ENID Information
// Backend File : scripts/js/tools/ss_ip_swip_tool.js
// Frontend File : views/tools/ip_swip.ejs
// Purpose : Updates WHOIS with ARIN, be careful
// URL : https://enid.chtrse.com/tools/ip_swip

// Packages
import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import axios from 'axios';
import { 
  Box, Container, FormControl, Grid,
  IconButton, InputAdornment, Select, TextField,
  Typography, MenuItem, Toolbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Components

// Hooks
import { useAlerts } from '../../hooks';

// Utilities
import { actions } from '../../../store';
;
import { states } from './usStates';

// paths
import paths from '../../../paths';

// Types

// Styles
import {
  OuterContentPaper,
  PrimaryTitleBox,
  LeftButtonBox,
  LeftButton,
  RightButton,
  LookupField,
} from '../../common/styled.components';
import './IpSwip.scss';


const IpSwip = () => {
  // ==============================================
  // Hooks
  // ==============================================
  const { show, Alerts } = useAlerts();
  const dispatch = useDispatch()


  // =============================================
  // State/Refs
  // =============================================
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    cid: '',
    ip: '',
    customerName: '',
    streetAddress: '',
    apartmentNumber: '',
    city: '',
    state: '',
    zip: '',
  });

  // =============================================
  // Helpers (Memo, CB, vars)
  // =============================================
  
  

  const showAlert = (type, message) => dispatch(actions.createAlert({ message, type })) 

  // =============================================
  // Interaction Handlers
  // =============================================
  const handleChange = event => {
    const { id, value, name } = event.target;

    if (id === 'search') {

      setSearch(value);

      // ... handle search logic.. ex. make api request with search value
    }

    else setFormData(prev => ({ ...prev, [id || name]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const response = (await axios.post(paths.SUBMIT_SWIP, { formData })).data;

      console.log(response)
     
      showAlert('success', `Form successfully submitted! ${JSON.stringify(response)}`); 
    
    } catch (error) {
      console.error(error)

      showAlert('error', `${JSON.stringify(error)}`);

    } finally {

      resetForm();
    }
  };

  const resetForm = () => setFormData({
    cid: '',
    ip: '',
    customerName: '',
    address: '',
    apartmentNumber: '',
    city: '',
    state: '',
    zip: '',
  });
  
  // =============================================
  // Render Methods
  // =============================================
  const textFieldProps = {
    onChange: handleChange,
    required: !formData.cid,
    sx: { m: 1, width: '100%' }, 
  }

  // =============================================
  // Effects
  // =============================================

  // =============================================
  // Return
  // =============================================
  return (
    <Container className="ip-swip" >
      <OuterContentPaper elevation={14}>
        <PrimaryTitleBox>
          <Typography variant="h3">IP SWIP Tool</Typography>
        </PrimaryTitleBox>
        <Toolbar sx={{ m: 4, height: '10px' }}>  
          <LeftButtonBox component="button" onClick={() => setShowForm(true)}>
            <Typography variant="body1" component="p">New Swip Request</Typography>
          </LeftButtonBox>
          <Toolbar sx={{ height: '100%', width: '30%', border: 'rgba(33, 33, 33, 0.1) solid 1px' }} />
          <LookupField 
            id="search" 
            label="Search SWIP Records..."
            variant="outlined" 
            onChange={handleChange} 
            value={search}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle-form-visibility"
                    onClick={() => setShowForm(false)}
                    edge="end"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Toolbar>
        {showForm && (
          <Box
            component="form"
            sx={{ padding: '0 100px', textAlign: 'center' }}
            // noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <Grid container spacing={3} justifyContent="space-around">
              <Grid item sm={12} md={12}>
                <TextField
                  id="cid"
                  placeholder="Enter Circuit ID"
                  onChange={handleChange}
                  required={formData.ip === ''}
                  sx={{ m: 1, width: '100%' }}
                  value={formData.cid}
                />
              </Grid>
              <Grid item sm={12}>
                <Grid container>
                  <Grid item sm={5.5} mt={2}>
                    <hr/>
                  </Grid>
                  <Grid item sm={1}>
                    <Typography variant="body1"><b>OR</b></Typography>
                  </Grid>
                  <Grid item sm={5.5} mt={2}>
                    <hr/>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} md={12}>
                <TextField
                  id="ip"
                  placeholder="IP Address(es)"
                  value={formData.ip}
                  {...textFieldProps}
                />
              </Grid>
              <Grid item sm={12} md={12}>
                <TextField
                  id="customerName"
                  placeholder="Customer Name"
                  value={formData.customerName}
                  {...textFieldProps}
                />
              </Grid>
              <Grid item sm={9} md={9}>
                <TextField
                  id="address"
                  placeholder="Street Address"
                  value={formData.address}
                  {...textFieldProps}
                />
              </Grid>
              <Grid item sm={3} md={3}>
                <TextField
                  id="apartmentNumber"
                  placeholder="Apt #"
                  type="number"
                  onChange={handleChange}
                  sx={{ width: '100%', m: 1 }}
                  value={formData.apartmentNumber}
                />
              </Grid>
              <Grid item sm={12} md={4}>
                <TextField
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  {...textFieldProps}
                />
              </Grid>
              <Grid item sm={12} md={4}>
                <FormControl sx={{ width: '100%', m: 1 }}>
                  <Select
                    id="state"
                    value={formData.state}
                    label="State"
                    required={!formData.cid}
                    onChange={handleChange}
                    name="state"
                  >
                    {states.map(({ value, state }) => <MenuItem key={value + '-menu-item'} value={value}>{state}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={12} md={4}>
                <TextField
                  id="zip"
                  placeholder="Zip Code"
                  value={formData.zip}
                  {...textFieldProps}
                />
              </Grid>
            </Grid>
            <Grid container m={1} my={4}>
              <Grid item sm={6}>
                <LeftButton variant="outlined" color="success" type="submit" fullWidth>Submit</LeftButton>
              </Grid>
              <Grid item sm={6}>
                <RightButton variant="outlined" color="error" onClick={() => resetForm()} fullWidth>Reset</RightButton>
              </Grid>
            </Grid>
          </Box>
        )}
      </OuterContentPaper>
      {show && <Alerts />}
    </Container>
  );
};

export default IpSwip;
