// Packages
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import PropTypes from 'prop-types'

import { actions } from '../../../store'

const Alerts = ({
  action = false,
  onClose = () => {},
}) => {
  // Hooks
  const dispatch = useDispatch()
  const { alerts } = useSelector(state => state.globalStates)
  
  // States / Refs
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [open, setOpen] = useState(false)

  // Helpers
  const origin = { vertical: 'bottom', horizontal: 'right' };

  // Effects
  useEffect(() => {

    if (alerts.message) {
      setOpen(true)

      setAlert(alerts);

      setTimeout(() => {
        setOpen(false)
        dispatch(actions.createAlert({ type: null, message: null }))
      }, 3000);
    }

  }, [alerts]);
  
  return (
    <Snackbar open={open} autoHideDuration={6000} anchorOrigin={origin}>
      <Alert severity={(alert.type || 'info')} sx={{ width: '100%' }} onClose={() => setOpen(false)} action={action}>
        <AlertTitle>
          {alert.type?.toUpperCase()}
        </AlertTitle>
        {alert.message}
      </Alert>
    </Snackbar>
  )
}

export default Alerts;

Alerts.propTypes = {
  action: PropTypes.bool,
  onClose: PropTypes.func,
  message: PropTypes.string,
  type: PropTypes.oneOf([
    'success',
    'info',
    'warning',
    'error',
  ]),
}