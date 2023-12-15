// Packages
import React, { useState } from 'react';
import { Box, Button, Step, Stepper, StepLabel, Typography } from '@mui/material';
import PropTypes from 'prop-types'

// Components

// Hooks

// Utils

// Types

// Styles
import './LinearStepper.scss';


const LinearStepper = ({ steps }) => {
  // ==============================================
  // Hooks
  // ==============================================

  // =============================================
  // State/Refs
  // =============================================
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  // =============================================
  // Helpers (Memo, CB, vars)
  // =============================================
  const stairs = steps || [
    'Step 1',
    'Step 2',
    'Step 3',
  ];

  // =============================================
  // Interaction Handlers
  // =============================================
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => setActiveStep(0)

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
    <Box sx={{ width: '100%', m: 1, p: 1, mb: 4 }}>
      <Stepper activeStep={activeStep}>
        {stairs.map((label, index) => {
          
          const stepProps = {
            fontSize: '0.75rem'
          };
          
          const labelProps = {
          };

          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step> 
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* 
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
          */}
        </React.Fragment>
      )}
    </Box>
  );
}

export default LinearStepper

LinearStepper.propTypes = {
  steps: PropTypes.array.isRequired
}