// Packages
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  Button,
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Modal,
  FormGroup,
  Switch,
  FormControlLabel,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// Components
import { ToolWrapper } from "../../common";

// Hooks
import { useColorMode } from "../../hooks";

// Utils
import paths from "../../../paths";
import { actions } from "../../../store";
import { navToTop } from "../../../../src/themes/SmoothScroll";
// Types

// Styles
import {
  InnerContentPaper,
  LeftFormAction,
  RightFormAction,
  StyledSpan,
  LargerInnerContentPaper,
} from "../../common/styled.components";
import "./Gander.scss";

const Gander = () => {
  // ==============================================
  // Hooks
  // ==============================================
  const dispatch = useDispatch();
  const { mode } = useColorMode();

  // =============================================
  // State/Refs
  // =============================================
  const [cidValue, setcidValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [historyData, setHistoryData] = useState({});
  const cidRef = useRef();
  const [showImportantNotes, setShowImportantNotes] = useState(false);
  const [showCIDs, setShowCIDS] = useState(true);
  // =============================================
  // Helpers (Memo, CB, vars)
  // =============================================
  const circuitIdRegex =
    /^\d\d\..{4}\.\d{6}\..*?\..{4}$|^\d{5}\..{3,5}\..{11}\..{11}$/;

  const bulletPoints = [
    "Exact duplicates have been removed from the output. Most effective duplicates as well but some might still come through.",
    "Random odd VLANs will appear that have nothing to do with the circuit. This is unavoidable as they come from the VLAN INFO field under equipment ports in Granite. You will find a shared port such as an NNI which has that field filled out with a VLAN from a specific circuit crossing that port.",
    "Optical circuits such as wave or legacy Dukenet cause the script to run slowly and sometimes hang indefinitely. These are best viewed directly in Granite.",
    "Type II circuits have fields in Granite where the free text can cause abnormal output. Most can now be queried successfully. Always compare to Granite if something looks off.",
  ];

  const showAlert = (type, message) =>
    dispatch(actions.createAlert({ message, type }));

  // =============================================
  // Interaction Handlers
  // =============================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    const cid = cidRef?.current.value?.trim();
    if (!cid) {
      setIsLoading(false);
      return showAlert("error", "No circuit ID/s provided.");
    } else if (!circuitIdRegex.test(cid)) {
      setIsLoading(false);
      return showAlert("error", "Invalid Circuit ID. Please try again!!");
    } else
      try {
        const queryString = `?args=${cid?.trim()}`;
        const fileName = "gander_data.py";

        const response = (await axios.get(
          paths.RUN_PYTHON + fileName + queryString
        )).data;
        let resData = [];
        if (response && Array.isArray(response)) {
          response.forEach((list) => {
            if (list.length > 0 && Array.isArray(list)) {
              list.forEach((elem) => {
                const test = elem
                  .split("<br>")
                  .map((e) => e.replace(/(<([^>]+)>)/gi, "").trim())
                  .map((e) => e.replace("&emsp;", ""))
                  .filter((e) => e !== "" && !e.includes("\n"));
                resData.push(test);
                setIsLoading(false);
                setcidValue(cid);
                setHistoryData((prev) => ({ ...prev, [cid]: resData }));
                setResponseData(resData);
              });
              console.log("Gander response: ", response);
            } else {
              setIsLoading(false);
              showAlert("error", `Error: ${list}`);
            }
          });
        } else {
          setIsLoading(false);
          showAlert("error", "Error: No data found");
        }
      } catch (problem) {
        showAlert("error", `Error: ${JSON.stringify(problem.response?.data?.error?problem.response.data.error: problem.message)}`);
      } finally {
        setIsLoading(false);
      }
  };
  const handleClose = () => setShowImportantNotes(false);

  const historyHandler = (key) => {
    const cidData = historyData[key];
    cidRef.current.value = key;
    setcidValue(key);
    setResponseData(cidData);
  };
  const notesHandler = () => {
    setShowImportantNotes(!showImportantNotes);
  };

  const getColorBold = (t, c) => {
    return <strong style={{ color: c }}>{t + " "}</strong>;
  };
  const getColorSpan = (t, c) => {
    return (
      <span>
        <strong style={{ color: c }}>{t}</strong>
        {": "}
      </span>
    );
  };
  const getHighlightedSummary = (elem, index) => {
    const regYellow =
      /((?<=\D|^)(?<!\.))((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|(?=\s|'|\/|<|$))){4}/g;
    const parts = elem?.split(" ");
    return (
      <Typography
        sx={{
          paddingLeft: "20px",
          fontFamily: "Courier",
          textAlign: "left",
          marginTop: elem.includes("LEG") ? "30px" : null,
        }}
        key={elem + index}
      >
        {parts.map((part) =>
          part == "||" ||
          /(?<=\()Designed/g.test(part) ||
          /(?<=\s)\|\|(?=\s)/g.test(part) ? (
            getColorBold(part, "#00FFFF")
          ) : part.includes("!!! THIS IS A TSP CIRCUIT !!!") ||
            part.includes("RESALE") ? (
            getColorBold(part, "#FF0000")
          ) : /INNI/g.test(part) ||
            /(?<!I|-)NNI(?=:)/g.test(part) ||
            /EVC(?=:)/g.test(part) ? (
            getColorSpan(part?.split(":")[0], "#FF00FF")
          ) : /Type II(?=\s)/g.test(part) ? (
            getColorSpan("Type II", "#FF00FF")
          ) : part.includes("Pending Decommission") ||
            part.includes("Planned") ? (
            getColorSpan(part, "#FF00FF")
          ) : part.includes("/") && regYellow.test(part.split("/")[0]) ? (
            <span>
              <strong style={{ color: "#FFFF00" }}>{part.split("/")[0]}</strong>
              <strong style={{ color: "#00FFFF" }}>
                {"/" + part.split("/")[1]}
              </strong>
            </span>
          ) : part.includes("/") &&
            /(\/([1-2][0-9]|3[0-2]))(?! \||\d|\w|\/|:)/g.test(part) ? (
            getColorBold(part, "#00FFFF")
          ) : part.match(regYellow) ? (
            getColorBold(part, "#FFFF00")
          ) : (
            part + " "
          )
        )}
      </Typography>
    );
  };
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
    <Box>
      {responseData.length > 0 && (
        <Grid
          sx={{ marginTop: "330px", textAlign: "center", position: "absolute" }}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  id="checked"
                  checked={showCIDs}
                  onChange={(e) => setShowCIDS(e.target.checked)}
                  color={mode == "light" ? "secondary" : "warning"}
                />
              }
              label="CIDs History"
            />
          </FormGroup>
          {showCIDs && (
            <Box>
              {Object.keys(historyData)?.map((key, i) => {
                const customer = historyData[key][0][1]?.includes("Customer")
                  ? historyData[key][0][1]?.split(":")[1]
                  : "";
                return (
                  <Grid
                    sx={{
                      marginTop: "5px",
                      backgroundColor: "#2185d0",
                      borderRadius: "10px",
                    }}
                    key={customer + i}
                  >
                    <Button
                      onClick={() => historyHandler(key)}
                      sx={{ width: "165px" }}
                    >
                      <Grid>
                        <Typography sx={{ fontSize: "15px", color: "#FFFFFF" }}>
                          {customer}
                        </Typography>
                        <Typography sx={{ fontSize: "15px", color: "#FFFFFF" }}>
                          {key}
                        </Typography>
                      </Grid>
                    </Button>
                  </Grid>
                );
              })}
            </Box>
          )}
        </Grid>
      )}
      {responseData.length > 0 && (
        <Box sx={{ bottom: 30, right: 160, position: "fixed" }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#2185d0" }}
            onClick={navToTop}
          >
            <KeyboardArrowUpIcon/>
            {" "}
            Back to TOP
          </Button>
        </Box>
      )}

      <ToolWrapper
        titleElement="Gander"
        inputElement={
          <>
            <Box
              component="div"
              sx={{ textAlign: "right", marginRight: "15px" }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "red",
                  marginTop: "5px",
                  marginBottom: "15px",
                  position: "right",
                }}
                onClick={notesHandler}
              >
                Disclaimer
              </Button>
            </Box>
            <Box p={4} px={6} component="form">
              <Grid container>
                <Grid item sm={12}>
                  <Typography variant="body1" component="p" gutterBottom>
                    Gander takes a circuit ID or transport ID and outputs an
                    at-a-glance summary of the service info and designed network
                    path. Data is pulled from Granite.
                  </Typography>
                </Grid>
                <Grid item sm={12} textAlign="left">
                  <Typography
                    variant="h6"
                    gutterBottom
                    children="Enter a CID"
                  />
                </Grid>
                <Grid item sm={9}>
                  <LeftFormAction
                    id="gander-textfield"
                    aria-label="gander-textfield"
                    label="Ex. '33.L1XX.805834..TWCC' or '20001.GE10.HLWLME081TW.MNCHMEAS02W'"
                    variant="outlined"
                    fullWidth
                    inputRef={cidRef}
                    autoFocus={true}
                  />
                </Grid>
                <Grid item sm={3}>
                  <RightFormAction
                    aria-label="gander-submit-button"
                    type="submit"
                    variant="outlined"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    children={
                      isLoading ? (
                        <CircularProgress
                          sx={{ color: "theme.palette.primary" }}
                        />
                      ) : (
                        "Take a gander"
                      )
                    }
                    sx={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
            </Box>

            {responseData.length > 0 && (
              <Button
                variant="text"
                href={`https://spectrum-enterprise.my.salesforce.com/_ui/search/ui/UnifiedSearchResults?searchType=2&sen=001&sen=005&sen=a1D&sen=006&sen=a2g&sen=a08&sen=a60&sen=a20&sen=a31&sen=00O&str=${cidValue}`}
                target="_blank"
                children="> SEARCH SALESFORCE FOR RELATED ENGS <"
              />
            )}

            {responseData.length > 0 && (
              <LargerInnerContentPaper
                sx={{
                  background: "#282828",
                  width: 1115,
                  color: "white",
                  zIndex: "5",
                }}
              >
                <Typography
                  sx={{
                    marginTop: "20px",
                    textAlign: "center",
                    fontFamily: "Courier",
                  }}
                >
                  {cidValue}
                </Typography>
                {responseData?.map((data, i) => {
                  return (
                    <Box key={i}>
                      <Grid sx={{ marginTop: "30px" }}>
                        {data.map((elem, index) => {
                          return getHighlightedSummary(elem, index);
                        })}
                      </Grid>
                    </Box>
                  );
                })}
                <Typography
                  sx={{
                    margin: "20px",
                    textAlign: "center",
                    fontFamily: "Courier",
                  }}
                >
                  {cidValue}
                </Typography>
              </LargerInnerContentPaper>
            )}

            <Modal
              open={showImportantNotes}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              sx={{
                marginRight: "13%",
                marginLeft: "12%",
                marginTop: "30px",
                overflow: "auto",
              }}
            >
              <InnerContentPaper sx={{ padding: "5px" }}>
                <Box sx={{ display: "flex", justifyContent: "right" }}>
                  <Button onClick={handleClose}>x</Button>
                </Box>
                <Typography
                  variant="h6"
                  component="h6"
                  py={1}
                  gutterBottom
                  color="primary"
                >
                  IMPORTANT
                </Typography>
                <Box>
                  <Typography variant="body1" component="p" gutterBottom>
                    Gander's intended use is to expedite troubleshooting by
                    quickly gathering the necessary info to begin logging into
                    devices and checking the network. It intentionally excludes
                    certain elements such as patch panel/mux info, card/shelf
                    numbers, and other such layer 1 details that are unrelated
                    to circuit-specific managed device configurations.
                  </Typography>
                  <Typography variant="body1" component="p" gutterBottom>
                    <b>
                      This tool is not perfect and should not be used as a
                      replacement for Granite.
                    </b>{" "}
                    When in doubt about the script's output or to see the
                    complete design path, check Granite.
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    gutterBottom
                    childen="Known Issues:"
                  />
                  <List>
                    {bulletPoints.map((bulletPoint, i) => (
                      <ListItem key={`bullet_point_${i + 1}`}>
                        <ListItemIcon
                          children={<CircleIcon sx={{ fontSize: "8px" }} />}
                        />
                        <ListItemText children={bulletPoint} />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    variant="text"
                    href="https://chalk.charter.com/display/NPD/How+Do+I+Use+ENID#HowDoIUseENID-Gander"
                    target="_blank"
                    children="> Link to Chalk document for Gander"
                  />
                </Box>
              </InnerContentPaper>
            </Modal>
          </>
        }
        content={<></>}
      />
    </Box>
  );
};

export default Gander;
