import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import React, { useState, useEffect } from "react";
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { BootstrapDialog, BootstrapDialogTitle } from './CustomModal'


const FormTableWrite = ({ open, handleClose, inputs, handleSubmit, columns, valuesLength }) => {
  const [values, setValues] = useState(
    columns
      .map((column) => {
        return column.field;
      })
      .reduce((acc, cur) => {
        acc[cur] = "";
        return acc;
      }, {})
  );

  function handleChange(e, i) {
    let newEntry = {
      ...values,
      [`col${i}`]: e.target.value,
      id: valuesLength + 1,
    };
    setValues(newEntry);
  }

  return (
    <>
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Add Form
      </BootstrapDialogTitle>
      <DialogContent dividers>

      {inputs.map((input, i) => {
        return (
          <FormControl key={i} style={{ width: "100%", marginBottom: "1rem" }}>
            <InputLabel htmlFor="component-outlined">
              {input.replaceAll("_", " ").toUpperCase()}
            </InputLabel>
            <OutlinedInput
              id="component-outlined"
              value={values[i]}
              onChange={(e) => handleChange(e, i)}
              label={input.replaceAll("_", " ").toUpperCase()}
              name={inputs[i]}
            />
          </FormControl>
        );
      })}

      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => handleSubmit(values)}>
          Submit
        </Button>
      </DialogActions>
    </BootstrapDialog>
  </>
  );
};

export default FormTableWrite;
