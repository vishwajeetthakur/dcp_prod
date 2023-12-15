// Packages
import React, { useRef, useState } from "react";
import {
  Divider,
  Box,
  TextField,
  Container,
  Grid,
  FormGroup,
  Switch,
  FormControlLabel,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Toolbar,
  InputLabel,
} from "@mui/material";

// Components
// Hooks
import { useColorMode } from "../../hooks";

// Utils

// Styles
import {
  OuterContentPaper,
  PrimaryTitleBox,
  LeftButton,
  RightButton,
} from "../../common/styled.components";
import "./Notification.scss";
const backColor = {
  positive: "#008000",
  negative: "#FF0000",
  info: "#0000FF",
  warning: "#FFA500",
  blank: "",
};
const notificationList = [
  { value: 'blank', list: 'Normal (White)' },
  { value: 'positive', list: 'Resolved (Green)' },
  { value: 'info', list: 'Informational (Blue)' },
  { value: 'warning', list: 'Warning (Orange)' },
  { value: 'negative', list: 'Alert (Red)' },
];

const Notification = () => {
  // ==============================================
  // Hooks
  // ==============================================
  const { mode } = useColorMode();

  // =============================================
  // State/Refs
  // =============================================

  const [notificationEnabled, SetNotificationEnabled] = useState(true);
  const [colorValues, setColorValues] = useState({color: ''});
  const messageRef = useRef();
  // =============================================
  // Interaction Handlers
  // =============================================
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Notification requests: ", colorValues.color, messageRef.current.value, notificationEnabled);
  };
  const clearHandler = () =>{
    messageRef.current.value = ''
    setColorValues({color: ''})
  }
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
      <Container className="notification">
    
        <OuterContentPaper elevation={14} marginTop={'15px'}>
      {notificationEnabled &&
        <Grid
        item
        sm={12}
        md={12}
        sx={{
          position: 'fixed',
          top: 68,
          left: 0,
          zIndex: 999,
          width: '100%',
          height: '40px',
          backgroundColor:`${backColor[colorValues.color]}`,
          textAlign: 'center',
          color: colorValues.color =='blank' || colorValues.color =='warning'?'black': 'white'
        }}
      
      >
        <Typography
          sx={{ width: "100%", height: "45px", padding: "10px"}}
          children={messageRef?.current?.value || 'No notfication to display'}
          />
      </Grid>}
          <Typography variant="h4" margin="15px" >
            Notification
          </Typography>
          <Divider />

          <Toolbar sx={{ m: 4, height: "10px" }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    id="checked"
                    checked={notificationEnabled}
                    onChange={(e) => SetNotificationEnabled(e.target.checked)}
                    color={mode == "light" ? "secondary" : "warning"}
                  />
                }
                label="Enbale Notification"
              />
            </FormGroup>
          </Toolbar>
          <Box
            component="form"
            sx={{ padding: "0 100px", textAlign: "center" }}
            onSubmit={handleSubmit}
          >
            <Grid container spacing={3} justifyContent="space-around">
              <Grid item sm={12} md={12}>
                <FormControl fullWidth={true}>
                <InputLabel>Colors</InputLabel>
                  <Select 
                  onChange={(e) => setColorValues({color: e.target.value})}
                  id="select"
                  value={colorValues.color}
                  label="color"
                  name="color"
                  >
                  {notificationList.map(({ value, list }) => <MenuItem key={value + '-menu-item'} value={value}>{list}</MenuItem>)}

                  </Select>
                </FormControl>
              </Grid>

              <Grid item sm={12} md={12}>
                <TextField
                  id="notes-textfield"
                  label="Statement"
                  multiline
                  rows={2}
                  maxRows={4}
                  sx={{ width: "100%" }}
                  inputRef={messageRef}
                />
              </Grid>
            </Grid>
            <Grid container m={1} my={4}>
              <Grid item sm={6}>
                <LeftButton
                  variant="outlined"
                  color="success"
                  type="submit"
                  fullWidth
                >
                  Submit
                </LeftButton>
              </Grid>
              <Grid item sm={6}>
                <RightButton variant="outlined" color="error" fullWidth onClick={clearHandler}>
                  Clear
                </RightButton>
              </Grid>
            </Grid>
          </Box>
          <Divider />
         {notificationEnabled && 
          <Grid
          item
          sm={12}
          md={12}
          backgroundColor={backColor[colorValues.color]}
          marginBottom={"20px"}
          marginTop="30px"
          color= {colorValues.color =='blank' || colorValues.color =='warning'?'black': 'white'}

        >
          <Typography
            sx={{ width: "100%", height: "40px", padding: "10px" }}
            children={messageRef?.current?.value || 'No notfication to display'}
          />
        </Grid>}
          <Box></Box>
        </OuterContentPaper>
      </Container>
  );
};

export default Notification;
