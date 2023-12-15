// Packages
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom';
import {
    Box, Button, Collapse, IconButton, Link, List, ListItemText, Grid,
    Slide,
    Stack,
    Typography,
    Tooltip
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import QuizIcon from '@mui/icons-material/Quiz';
import BugReportIcon from '@mui/icons-material/BugReport';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

// Hooks
import { useKeycloakUser } from '../../hooks';

// Utilities
import { actions } from '../../../store'
import { checkRoles, routes } from '../Routes/routesConfig'

// Styles
import {
    BoxSubTitle,
    ListItemButtons,
    DrawerHeader,
    LeftNavDrawer,
    EsetButton,
} from '../styled.components'
import './Nav.scss'

import { themeConfig } from '../../../themes/themeConfig';


const SideNav = () => {
    // ==============================================
    // Hooks
    // ==============================================
    const dispatch = useDispatch()
    const { menus } = useSelector(state => state.globalStates)
    const { keycloakUser } = useKeycloakUser()

    const colorMode = localStorage.getItem('colorMode')

    // =============================================
    // State/Refs
    // =============================================
    const [menuStates, setMenuStates] = useState({})

    // =============================================
    // Helpers (Memo, CB, vars)
    // =============================================
    const hiddenNavItems = ['Home', 'Profile', 'Notification', 'Design Portal Search', 'Design Portal Customer Info', 'Design Portal WAN',
        'Design Portal LAN', 'Design Portal Fortilink', 'Design Portal Static Routes', 'Design Portal OSPF', 'Design Portal BGP',
        'Design Portal Addresses', 'Design Portal Services', 'Design Portal NAT', 'Design Portal Firewall Policies']

    const getSideNavStructure = () => {
        // check for required roles for the route for each list item
        const authenticatedItems = routes.map(routeConfig => {

            if (!routeConfig.roles) routeConfig.roles = []

            if (checkRoles(routeConfig.roles, keycloakUser)) return routeConfig

            else return null
        })

        // return the new list of items which are authenticated
        const allowedRoutes = authenticatedItems.filter(item => item && item)

        return Object.entries(
            allowedRoutes.reduce((acc, route) => {
                if (!route.folder.length) route.folder = ['']

                route.folder.forEach(folder => {
                    const folderName = route.subfolder ? `${folder}-${route.subfolder}` : folder;
                    acc[folderName] = [route, ...(acc[folderName] || [])]
                })
                return acc
            }, {})
        )
    }


    // =============================================
    // Interaction Handlers
    // =============================================
    const handleMenu = (folder) => setMenuStates(prev => ({ ...prev, [folder]: prev ? !prev[folder] : true }))

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
        <Box sx={{ display: 'flex' }}>
            <LeftNavDrawer
                variant="persistent"
                anchor="left"
                // open={!props.open}
                open={menus['sidenav']}
            >
                <DrawerHeader>
                    <EsetButton component={RouterLink} to="/">
                        <Typography variant="h5" noWrap sx={{ height: '100%', p: 1.5, color: 'common.white' }} children="DCP" />
                    </EsetButton>
                    <IconButton onClick={() => dispatch(actions.handleMenu({ key: 'sidenav', value: false }))} sx={{ color: 'common.white' }}>
                        <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>
                 <List style={{ marginBottom: '60px'}}> {/* overflow: 'scroll' on dark mode creates ugly bars */}
                    {getSideNavStructure()
                        .map(([folder, routesArray], i) =>
                            !folder
                                ? (
                                    // render top level
                                    <React.Fragment key={i}>
                                        {routesArray.map(routes => (
                                            <React.Fragment key={routes.path + '_listItem'}>
                                                {!hiddenNavItems.includes(routes.name) && (
                                                    <ListItemButtons component={RouterLink} to={routes.path === 'managed_services' ? `/${routes.path}/search` : `/${routes.path}`}>
                                                        <ListItemText primary={routes.name} />
                                                    </ListItemButtons>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </React.Fragment>
                                )
                                : (
                                    // render inside folder
                                    <React.Fragment key={i}>
                                        <ListItemButtons onClick={() => handleMenu(folder)}>
                                            <BoxSubTitle>{folder?.split('-')[0]}</BoxSubTitle>
                                            {/* {menuStates[folder] ? <ExpandMore /> : <ChevronRightIcon />} */}
                                        </ListItemButtons>
                                        {/* <Collapse in={menuStates[folder]} timeout="auto" unmountOnExit> */}
                                        <Collapse in={true} timeout="auto" unmountOnExit>
                                            <List style={{ padding: '0px' }}>
                                                {routesArray.map((routes) => (
                                                    <ListItemButtons
                                                        key={routes.path === 'managed_services' ? `/${routes.path}/customer_search` : `/${routes.path}`}
                                                        component={RouterLink}
                                                        to={routes.path === 'managed_services' ? `/${routes.path}/customer_search` : `/${routes.path}`}
                                                        sx={{ pl: 4 }}
                                                        onClick={() => routes.path === 'managed_services' && dispatch(actions.handleMenu({
                                                            key: 'mne-sidenav',
                                                            value: !menus['mne-sidenav'],
                                                        }))}
                                                    >
                                                        <ListItemText primary={routes.name} />
                                                    </ListItemButtons>
                                                ))}
                                            </List>
                                        </Collapse>
                                    </React.Fragment>
                                )
                        )}
                </List>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        visibility: 'visible',
                        background: themeConfig[colorMode].palette.sideNav.main
                    }}
                >
                    <Grid item sx={{margin: '20px'}}>
                        <Stack direction="row" spacing={5}>
                            <Tooltip title="Request Access">
                                <QuizIcon sx={{ fontSize: 30 }} onClick={() => window.open('mailto:C-Rajeev.Ranjan@charter.com?subject=DCP Access Request&body=* Please CC your manager or a SME for the page/s you are requesting *%0A%0APID: %0APage/s: %0A%0AMatch roles of PID: %0A(or)%0ARoles required: ')}/>
                            </Tooltip>
                            <Tooltip title="Report a Bug">
                                <BugReportIcon sx={{ fontSize: 30 }} onClick={() => window.open('mailto:C-Rajeev.Ranjan@charter.com?subject=DCP Bug Report&body=* Please attach a screenshot of the issue with the developer console open (press F12) *%0A%0APage: %0ASummary: %0APriority: %0ADescription: ')} />
                            </Tooltip>
                            <Tooltip title="Request a Feature">
                                <TipsAndUpdatesIcon sx={{ fontSize: 30 }} onClick={() => window.open('mailto:C-Rajeev.Ranjan@charter.com?subject=DCP Feature Request&body=Summary: %0APriority: %0ADescription: ')} />
                            </Tooltip>
                            
                        </Stack>
                    </Grid>
                    
                </Grid>
            </LeftNavDrawer>

        </Box>
    );
}

export default SideNav
