// Packages
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Tab, Tabs
} from '@mui/material';
import PropTypes from 'prop-types'

// Utilities
import { actions } from '../../../store';

// Styles
import './ToolTabs.scss';

const ToolTabs = ({
  // required
  tabNames = [],
  // optional
  resetFetchState,
  toggleWarningListener = null,
  tabsVariant = "standard",
}) => {
  // ==============================================
  // Hooks
  // ==============================================
  const dispatch = useDispatch()
  const { menus, tabs } = useSelector(state => state.globalStates)
  
  // ==============================================
  // State / Refs
  // ==============================================
  const awaitingTabIndex = useRef(0)
  
  // ==============================================
  // Interaction Handlers
  // ==============================================
  const handleTabChange = tabIndex => {
    // if there is a value in the warning listener then open the confirm prompt
    if (toggleWarningListener) {
      awaitingTabIndex.current = tabIndex
      
      dispatch(actions.handleMenu({ key: 'tool-toggle', value: true }))
    }

    // otherwise set the tab index
    else dispatch(actions.handleTabChange(tabIndex))
  }

  const handleConfirm = () => {
    // reset the data in the useFetch hook state
    resetFetchState()
    
    console.log('handleConfirm: ', awaitingTabIndex)
    // change tabs using the saved tab index
    handleTabChange(awaitingTabIndex.current)
    
    // close the dialog warning prompt
    dispatch(actions.handleMenu({ key: 'tool-toggle', value: false }))
  }

  // =============================================
  // Return
  // =============================================
  return (
    <>
      <Tabs
        value={tabs}
        onChange={(e, newValue) => handleTabChange(parseInt(newValue))}
        variant={tabsVariant}
        scrollButtons="auto"
        aria-label={'tool-tabs'}
      >
        {tabNames.map((tab, i) => (
          <Tab
            key={tab?.label ? tab.label : 'tab-' + i}
            id={i}
            label={tab?.label ? tab.label : i}
            sx={{ '&:hover': { backgroundColor: 'rgba(100,100,100,0.1)' }}}
          />
        ))}
      </Tabs>
      
      {/* Toggle Tools Confirmation Pop up Warning */}
      <Dialog
        open={menus['tool-toggle'] || false}
        onClose={() => dispatch(actions.handleMenu({ key: 'tool-toggle', value: false }))}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Toggle Tools?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you would like to switch tools?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} autoFocus>Yes</Button>
          <Button onClick={() => dispatch(actions.handleMenu({ key: 'tool-toggle', value: false }))}>No</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ToolTabs;

ToolTabs.propTypes = {
  tabNames: PropTypes.array.isRequired,
  resetFetchState: PropTypes.func,
  toggleWarningListener: PropTypes.any,
  tabsVariant: PropTypes.oneOf([
    'fullWidth',
    'standard',
    'scrollable',
  ]),
}