import React, { useState } from "react";
import { BootstrapDialog, BootstrapDialogTitle } from '../forms/CustomModal'
import { 
    Button,
    DialogActions,
    DialogContent,
    Stack,
} from '@mui/material'


const AutoSaveForm = ({ open, mode, handleClose, handleCancel, saveHandler }) => (
    <BootstrapDialog
        onClose={handleCancel}
        aria-labelledby="customized-dialog-title"
        open={open}
    >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
            {mode.charAt(0).toUpperCase() + mode.slice(1) + ' Form'}
        </BootstrapDialogTitle>

        <DialogContent dividers>
            <p>{`Oops. There are unsaved changes. Save them before moving on?`} </p>
        </DialogContent>

        <DialogActions>
            <Stack spacing={1} direction="row">
                <Button variant="contained"  autoFocus onClick={() => saveHandler()}>
                    Yes
                </Button>
                <Button variant="contained" color="error" autoFocus onClick={() => handleClose()}>
                    No, Move On
                </Button>
            </Stack>
            
        </DialogActions>
    </BootstrapDialog>
);

export default React.memo(AutoSaveForm);