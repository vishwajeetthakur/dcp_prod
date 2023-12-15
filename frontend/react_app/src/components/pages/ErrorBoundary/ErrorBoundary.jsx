// Packages
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Grid, Typography } from '@mui/material'

// Components

// Hooks

// Utils

// Types

// Styles
import './ErrorBoundary.scss';

export const PageNotFound = () => (
  <Container>
    <Grid container sx={{ width: '100%', height: '100%', margin: 'auto', justifyContent: 'space-evenly' }}>
      <Grid item>
        <Box sx={{ textAlign: 'center', mt: '50%' }}>
          <Typography variant="h4" component="h4">OOPS! Something went wrong.</Typography>
          <Typography variant="p" component="p">404 - The Page Cannot Be Found</Typography>
          <Button variant="primary" component={RouterLink} to="/">
              Back to Home
          </Button>
        </Box>
      </Grid>
    </Grid>
  </Container>
)

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    // return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {

    // // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    
    console.error(error, errorInfo);
  }

  render() {
    // if (this.state.hasError) {
    //   this.setState({ hasError: false })
    //   // You can render any custom fallback UI
    //   return <PageNotFound />
    // }

    return this.props.children; 
  }
}

export default ErrorBoundary