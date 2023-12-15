// Packages
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  Grid,
  Typography,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Stack,
  Link,
} from "@mui/material";
import AddAlertIcon from "@mui/icons-material/AddAlert";
// Mui Icons
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Settings from "@mui/icons-material/Settings";

// Components
import SideNav from "./SideNav";
import { BootstrapDialog } from "../forms/CustomModal";

// Utilities
import { actions } from "../../../store";
import { checkRoles } from "../Routes/routesConfig";

// Hooks
import { useColorMode, useKeycloakUser, useSearch } from "../../hooks";

// Styles
import {
  EsetButton,
  Search,
  SearchIconWrapper,
  StyledDropDown,
  StyledInputBase,
  StyledNavbar,
  StyledToolbar,
} from "../styled.components";
import "./Nav.scss";

const serviceLinks = {
  Design_Standards: [
    {
      label: "DSIP | Design Standards",
      to: "https://chalk.charter.com/pages/viewpage.action?pageId=194642103",
    },
    {
      label: "GSIP | Granite Standards",
      to: "https://chalk.charter.com/display/public/NPD/GSIP",
    },
    {
      label: "PSIP | Process Standards",
      to: "https://chalk.charter.com/display/NPD/ProSIP",
    },
    {
      label: "EVI | CPE Configuration Standards",
      to: "https://chalk.charter.com/display/EVI/Enterprise+Edge+Validation+and+Integration+Home",
    },
    {
      label: "CVI | Core Configuration Standards",
      to: "https://chalk.charter.com/pages/viewpage.action?pageId=987509709",
    },
  ],
  SEEFA_Reporting: [
    {
      label: "SEEFA Dashboard | Design / Provisioning / Compliance",
      to: "https://tableau.chartercom.com/#/site/CommercialEngineering/views/SEEFAdashboard/AutomationOverview?:iid=1",
    },
  ],
  General_Development: [
    {
      label: "Spectrum Gitlab",
      to: "https://gitlab.spectrumflow.net/users/sign_in",
    },
    {
      label: "Spectrum Toolbox Homepage",
      to: "https://docs.spectrumtoolbox.com/introduction/",
    },
  ],
  MDSO_Development: [
    {
      label: "Orchestration Chalk Home",
      to: "https://chalk.charter.com/display/SESE/Service+Orchestration?src=contextnavpagetreemode",
    },
    { label: "BP Dev Guide", to: "https://developer.blueplanet.com/" },
    { label: "BP Git", to: "https://git.blueplanet.com/users/sign_in" },
  ],
  SENSE_Development: [
    {
      label: "SENSE Chalk Home",
      to: "https://chalk.charter.com/display/SESE/Service+Automation?src=contextnavpagetreemode",
    },
  ],
};

const TopNav = () => {
  // Hooks
  const dispatch = useDispatch();
  const { menus } = useSelector((state) => state.globalStates);
  const { mode, toggleColorMode } = useColorMode();
  const { keycloakUser } = useKeycloakUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const search = useSearch();

  // console.log('topNav user details: ', keycloakUser)

  // State / Refs
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [openSearchMenu, setOpenSearchMenu] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchItems, setSearchItems] = useState([]);
  const [quickLinkMenu, setQuickLinkMenu] = useState({});
  const anchorRef = useRef();

  // =============================================
  // Helpers (Memo, CB, vars)
  // =============================================
  const getUserInitials = () =>
    keycloakUser.name
      .split(" ")
      .map((name) => name.slice(0, 1).toUpperCase())
      .join("");

  // =============================================
  // Interaction Handlers
  // =============================================
  const handleNavigate = (path) => {
    setOpenSearchMenu(false);

    setSearchItems([]);

    navigate(path);

    handleClose();
  };

  const handleChange = (e) => {
    e.preventDefault();

    setSearchTerm(e.target.value);
  };

  const handleModal = () => {
    setOpenModal(true);

    // console.log(document.getElementById('search-modal-searchbox'))
    document.getElementById("search-modal-searchbox")?.focus();
  };

  const handleClose = () => setOpenModal(false);

  const handleQuickLinkMenus = (key) =>
    setQuickLinkMenu((prev) => ({
      ...prev,
      [key]: prev[key] ? !prev[key] : true,
    }));

  // =============================================
  // Effects
  // =============================================
  useEffect(() => {
    if (searchTerm.length && !openSearchMenu) setOpenSearchMenu(true);

    if (searchTerm.length) {
      const matchingItems = search.getSearchItem(searchTerm);

      setSearchItems(matchingItems);
    }

    if (searchTerm === "") {
      setOpenSearchMenu(false);
      setOpenModal(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm("");
  }, [pathname]);

  // =============================================
  // Return
  // =============================================
  return (
    <React.Fragment>
      <SideNav />

      <StyledNavbar
        className="navbar"
        open={menus["sidenav"]}
        sx={{ borderBottom: "0px" }}
      >
        <StyledToolbar disableGutters>
          {!menus["sidenav"] && (
            <React.Fragment>
              <IconButton
                color="primary"
                aria-label="open drawer"
                onClick={() =>
                  dispatch(actions.handleMenu({ key: "sidenav", value: true }))
                }
                // onClick={() => handleDrawer(true)}
                edge="start"
                sx={{ p: 2, ml: 0.2 }}
              >
                <MenuIcon />
              </IconButton>
              <EsetButton component={RouterLink} to="/">
                <Typography
                  variant="h5"
                  noWrap
                  sx={{ height: "100%", p: 1.5, color: "primary.main" }}
                  children="DCP"
                />
              </EsetButton>
            </React.Fragment>
          )}

          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search", readOnly: true }}
              onClick={handleModal}
            />
          </Search>

          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openModal}
            fullWidth
          >
            <DialogContent
              dividers
              style={{ minHeight: "300px", height: "auto", minWidth: "370px" }}
            >
              <TextField
                placeholder="Search…"
                variant="standard"
                autoFocus
                focused={openModal}
                InputProps={{
                  id: "search-modal-searchbox",
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "100%",
                  py: 4,
                  px: 0,
                  mx: 0,
                }}
                value={searchTerm}
                onChange={handleChange}
              />

              {/* Drop down menu for search */}
              {openSearchMenu && (
                <div id="search-form-dropdown" style={{ paddingTop: "5px" }}>
                  <Box sx={{ fontWeight: "bold" }} children="Matching" />
                  {searchItems &&
                    searchItems.map(
                      (searchItem, index) =>
                        checkRoles(searchItem?.roles, keycloakUser) && (
                          <Grid
                            container
                            key={searchItem.path + "-" + index}
                            sx={{
                              borderBottom:
                                "1px solid rgba(100, 100, 100, 0.1)",
                              my: 1,
                              py: 1,
                            }}
                          >
                            <Grid
                              item
                              sm={8}
                              onClick={() => handleNavigate(searchItem.path)}
                              textAlign="left"
                              sx={{
                                cursor: "pointer",
                                borderRadius: "8px",
                                pl: 2,
                                "&:hover": {
                                  backgroundColor: "rgba(150,150,150,0.1)",
                                },
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  textDecoration: "underline",
                                  color: "#003057",
                                }}
                              >
                                {searchItem.name}
                              </Typography>
                            </Grid>
                          </Grid>
                        )
                    )}
                </div>
              )}
              <Box sx={{ fontWeight: "bold" }} children="Recent" />
              {search.history &&
                [...search.history]
                  .slice(0, showMore ? search.history.length : 4)
                  .sort(
                    (a, b) => new Date(b.dateAndTime) - new Date(a.dateAndTime)
                  )
                  .map(
                    (historyItem) =>
                      checkRoles(historyItem?.roles, keycloakUser) &&
                      historyItem?.name && (
                        <Grid
                          container
                          key={historyItem?.path}
                          sx={{
                            borderBottom: "1px solid rgba(100, 100, 100, 0.1)",
                            my: 1,
                            py: 1,
                          }}
                        >
                          <Grid
                            item
                            sm={8}
                            onClick={() =>
                              historyItem?.path !==
                              location.pathname.split("/")[1]
                                ? handleNavigate(historyItem?.path)
                                : handleClose()
                            }
                            textAlign="left"
                            sx={{
                              cursor: "pointer",
                              borderRadius: "8px",
                              pl: 2,
                              "&:hover": {
                                backgroundColor: "rgba(150,150,150,0.1)",
                              },
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                textDecoration: "underline",
                                color: "#003057",
                              }}
                            >
                              {historyItem?.name}
                            </Typography>
                          </Grid>
                        </Grid>
                      )
                  )}
              <Grid container justifyContent="space-around">
                <Grid item>
                  {search?.history && search.history.length > 4 && (
                    <Button
                      sx={{ fontWeight: "bold" }}
                      variant="text"
                      children={showMore ? "Show less" : "Show more"}
                      onClick={() => setShowMore(!showMore)}
                    />
                  )}
                </Grid>
              </Grid>
              <Box sx={{ fontWeight: "bold" }} children="Quick Links" />
              {Object.keys(serviceLinks).map((key, i) => (
                <Grid
                  container
                  key={key + i}
                  sx={{
                    borderBottom: "1px solid rgba(100, 100, 100, 0.1)",
                    my: 1,
                    py: 1,
                  }}
                >
                  <Grid
                    item
                    sm={8}
                    onClick={() => handleQuickLinkMenus(key)}
                    textAlign="left"
                    sx={{
                      cursor: "pointer",
                      borderRadius: "8px",
                      pl: 2,
                      "&:hover": {
                        backgroundColor: "rgba(150,150,150,0.1)",
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ textDecoration: "underline", color: "#003057" }}
                    >
                      {key.replace("_", " ")}
                    </Typography>
                    <Menu
                      anchorEl={document.getElementById(key)}
                      open={quickLinkMenu[key] || false}
                      onClose={() =>
                        setQuickLinkMenu((prev) => ({ ...prev, [key]: false }))
                      }
                    >
                      {serviceLinks[key].map((props) => (
                        <MenuItem key={props.label}>
                          <Button
                            variant="text"
                            href={props.to}
                            target="_blank"
                            children={props.label}
                            sx={{
                              textDecoration: "underline",
                              color: "#003057",
                            }}
                          />
                        </MenuItem>
                      ))}
                    </Menu>
                  </Grid>
                </Grid>
              ))}
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={() => handleClose()}>
                Cancel
              </Button>
            </DialogActions>
          </BootstrapDialog>

          <IconButton
            aria-label="view profile"
            // onClick={() => setOpenProfileMenu(!openProfileMenu)}
            onClick={() => navigate("/profile")}
            ref={anchorRef}
            color="primary"
          >
            <Avatar
              sx={{ height: 40, width: 40, backgroundColor: "primary.main" }}
            >
              {getUserInitials()}
            </Avatar>
          </IconButton>
          <ProfileMenu
            anchorRef={anchorRef}
            open={openProfileMenu}
            closeMenu={() => setOpenProfileMenu(false)}
          />

        {/* <IconButton
            onClick={() => navigate("/notification")}
            // color="primary"
          >
              <AddAlertIcon sx={{ height: 35, width: 35 }}/>
          </IconButton> */}

          <IconButton
            aria-label="toggle dark mode"
            onClick={toggleColorMode}
            sx={{ mr: 2 }}
          >
            {mode === "light" ? <DarkModeIcon sx={{ height: 35, width: 35 }}/> : <LightModeIcon sx={{ height: 35, width: 35 }}/>}
          </IconButton>
        </StyledToolbar>
      </StyledNavbar>
    </React.Fragment>
  );
};

export default TopNav;

const ProfileMenu = ({ anchorRef, open, closeMenu }) => {
  const navigate = useNavigate();

  return (
    <Menu
      anchorEl={anchorRef.current}
      id="account-menu"
      open={open}
      onClose={() => closeMenu()}
      PaperProps={<StyledDropDown />}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem onClick={() => navigate("/profile")}>
        <Avatar /> Profile
      </MenuItem>
      <MenuItem onClick={() => navigate("/profile")}>
        <Avatar /> My account
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => navigate("/profile")}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
};
