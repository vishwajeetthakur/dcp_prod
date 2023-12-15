// Packages
import React from 'react';
import { useSelector } from 'react-redux'
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import PropTypes from 'prop-types';

// Components
import { Alerts, LinearStepper, ToolTabs } from '..'

// Hooks

// Utils

// Types

// Styles
import {
  OuterContentPaper,
  PrimaryTitleBox,
} from '../styled.components'
import './ToolWrapper.scss';

const ToolWrapper = ({
  titleElement,
  wrapperLabel,
  inputElement,
  resetFetchState,
  toggleWarningListener,
  content = null,
  containerWidth = 'lg',
  steps = [],
  tabDefinitions = [],
  isLoading = false,
}) => {
  const { tabs } = useSelector(state => state.globalStates)
  
  return (
    <Container className="tool-wrapper" maxWidth={containerWidth}>

      {steps.length ? <LinearStepper steps={steps} /> : null}
      
      {wrapperLabel && (
        <PrimaryTitleBox color={false}>
          <Typography variant="h4" children={wrapperLabel} />
        </PrimaryTitleBox>
      )}
      
      <OuterContentPaper elevation={14}>
        {titleElement && (
          <PrimaryTitleBox>
            {typeof(titleElement) === 'string' 
              ? <Typography variant="h3" children={titleElement} />
              : titleElement
            }
          </PrimaryTitleBox>
        )}
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          {tabDefinitions.length > 0 ? (
            <ToolTabs
              tabNames={tabDefinitions.map(({ label }) => ({ label }))}
              resetFetchState={resetFetchState}
              toggleWarningListener={toggleWarningListener}
            />
          ) : null}
        </Box>

        {inputElement}

      </OuterContentPaper>

      {isLoading && (
        <Box sx={{ textAlign: 'center', width: '100%', mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {tabDefinitions.length > 0 ? tabDefinitions[tabs].content : content}
      
      <Alerts />

    </Container>
  );
};

export default ToolWrapper;

ToolWrapper.propTypes = {
  titleElement: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  wrapperLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  inputElement: PropTypes.element,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  responseElement: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  resetFetchState: PropTypes.func,
  toggleWarningListener: PropTypes.any,
  containerWidth: PropTypes.oneOf([false, 'xl', 'lg', 'md', 'sm', 'xs']),
  steps: PropTypes.array,
  tabDefinitions: PropTypes.array,
  isLoading: PropTypes.bool,
}
