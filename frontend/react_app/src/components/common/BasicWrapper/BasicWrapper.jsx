// Packages
import React from 'react';
import { Box, CircularProgress, Container } from '@mui/material';
import PropTypes from 'prop-types';

// Components
import { Alerts } from '..';
// Styles
import './BasicWrapper.scss';


const loadingBoxStyles = { textAlign: 'center', width: '100%', mt: 6 };

const BasicWrapper = ({ children, pageID, isLoading, containerWidth = false, }) => (
  <Container className={pageID} maxWidth={containerWidth}>
    {children}
    
    {isLoading && (
      <Box sx={loadingBoxStyles}>
        <CircularProgress />
      </Box>
    )}
    
    <Alerts />

  </Container>
);

export default BasicWrapper;

BasicWrapper.propTypes = {
  children: PropTypes.element,
  pageID: PropTypes.string,
  isLoading: PropTypes.bool,
  containerWidth: PropTypes.oneOf([
    false,
    'xl',
    'lg',
    'md',
    'sm',
    'xs',
  ])
}