// Packages
import React, { forwardRef } from 'react';
import { Box, CircularProgress, Grid, } from '@mui/material';
import PropTypes from 'prop-types'

// Components

// Hooks

// Utils

// Types

// Styles
import {
  LeftFormAction,
  RightFormAction,
} from '../styled.components';
import './SingleInputSearch.scss';

const SingleInputSearch = ({
  searchLabel,
  searchPlaceholder,
  handleChange,
  searchValue,
  handleSubmit,
  isLoading,
  buttonText,
}) => {
  // const {
  //   searchLabel,
  //   searchPlaceholder,
  //   handleChange,
  //   searchValue,
  //   handleSubmit,
  //   isLoading,
  //   buttonText,
  // } = props
  return (
    <Box m={1} p={4} px={6} component="form">
      <Grid container>
        <Grid item sm={9}>
          <LeftFormAction 
            id="search" 
            label={searchLabel}
            // aria-label={'single-input-search'}
            // ref={ref}
            variant="outlined"
            onChange={handleChange} 
            value={searchValue}
            placeholder={searchPlaceholder}
            fullWidth
          />
        </Grid>
        <Grid item sm={3}>
          <RightFormAction
            type="submit"
            variant="outlined"
            // aria-label={'single-input-search'}
            size="large"
            color="primary"
            onClick={handleSubmit}
            type="submit"
            disabled={isLoading}
            children={isLoading ? <CircularProgress sx={{ color: 'theme.palette.primary.main' }} /> : buttonText}
            sx={{ width: '100%' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SingleInputSearch;

SingleInputSearch.propTypes = {
  searchLabel: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  handleChange: PropTypes.func,
  searchValue: PropTypes.string,
  handleSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
  buttonText: PropTypes.string,
  searchRef: PropTypes.any,
}