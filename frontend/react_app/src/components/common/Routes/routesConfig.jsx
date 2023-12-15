import { Chip } from '@mui/material'

// Pages
import {
    ExpressBandwidthUpgrade, Gander,
    Home, IpSwip, Isin, Odin,
    Profile, RemedyTicketGenerator, SeefaReporting,
    UserAdmin, VoiceGatewayPicker,
    SimpleDataDictionary,
    GraniteNetworkCompliance,
    WorkAroundForSEEFA,
    DesignPortal,
    AutomationImpactTracker,
    Notification,
    VendorModelMapping,
    I2D2ComplianceTool
} from '../../pages';
// import ManagedServices from '../../pages/ManagedServices';
import { PageNotFound } from '../../pages/ErrorBoundary/ErrorBoundary';
import SearchComponent from '../../pages/button1/button1';

// Constants
const ADMIN = 'admin'
const DEVELOPER = 'developer'
const DESIGN_PORTAL_RO = 'design_portal_ro'
const DESIGN_PORTAL_RW = 'design_portal_rw'


// Helpers
export const checkRoles = (requiredRoles, user, requireAllRoles = false) => {

    // Temporary special exceptions

    // If user is not signed in
    //if (!user) return false

    // if no required roles
    if (!requiredRoles || !requiredRoles.length) return true

    return true

    // to require all roles for access
    if (requireAllRoles) return requiredRoles.sort() === user.user_roles.sort()

    // to require only one role for access
    else return requiredRoles.some(requiredRole => user.user_roles.includes(requiredRole))
}

function wipChip(routeName) {
    return (
        <>{routeName}<Chip size="small" label="WIP" color="secondary" style={{ marginLeft: '5px' }} /></>
    )
}

// Routes Configuration
export const routes = [
    // {
    //     path: 'profile',
    //     element: <Profile />,
    //     name: 'Profile',
    //     roles: [],
    //     folder: [],
    // },
    // {
    //     path: 'seefa_error_reporting',
    //     element: <SeefaReporting />,
    //     roles: [],
    //     name: 'SEEFA Error Reporting',
    //     folder: ['Network Automation'],
    // },

    {
        // path: 'button_1',
        path: 'info',
        element: <AutomationImpactTracker />,
        roles: [],
        name: 'DCP Info',
        // folder: ['Network Automation'],
        folder: ['Information'],
    },
    {
        path: 'device_details',
        element: <SearchComponent />,
        roles: [],
        name: 'Get device details',
        // folder: ['Network Automation'],
        folder: ['Query Apis'],
    },
    // {
    //     path: 'remedy_ticket_generator',
    //     element: <RemedyTicketGenerator />,
    //     roles: [],
    //     name: wipChip('Remedy Ticket Generator'),
    //     folder: ['Compliance and Design'],
    //     subfolder: 'List'
    // },
    // {
    //     path: 'ip_swip',
    //     element: <IpSwip />,
    //     roles: [],
    //     name: wipChip('IP SWIP Tool'),
    //     folder: ['Compliance and Design'],
    //     subfolder: 'List'
    // },
    // {
    //     path: 'i2d2_compliance_tool',
    //     element: <I2D2ComplianceTool />,
    //     roles: [],
    //     name: 'I2D2 Compliance Tool',
    //     folder: ['Compliance and Design'],
    //     subfolder: 'List'
    // },
    // {
    //     path: 'vendor_model_mapping',
    //     element: <VendorModelMapping />,
    //     roles: [ADMIN, DEVELOPER, 'vendor_model_mapping_rw'],
    //     name: 'Vendor Model Mapping',
    //     folder: ['Compliance and Design'],
    //     subfolder: 'List'
    // },
    // {
    //     path: 'express_bandwidth_upgrade',
    //     element: <ExpressBandwidthUpgrade />,
    //     roles: [],
    //     name: 'EBU Tool',
    //     folder: ['Compliance and Design'],
    //     subfolder: 'List'
    // },
    // {
    //     path: 'ise_check',
    //     element: <Isin />,
    //     roles: [],
    //     name: 'ISE Check',
    //     folder: ['Compliance and Design'],
    //     subfolder: 'List'
    // },
    // {
    //     path: '',
    //     element: <Home />,
    //     name: 'Home',
    //     roles: [],
    //     folder: [],
    // },
    // {
    //     path: 'gander',
    //     element: <Gander />,
    //     roles: [],
    //     name: 'Gander',
    //     folder: ['Compliance and Design'],
    //     subfolder: 'List'
    // },
    // {
    //     path: 'odin',
    //     element: <Odin />,
    //     roles: [],
    //     name: 'Odin Check Tool',
    //     folder: ['Compliance and Design'],
    //     subfolder: 'List'
    // },
    // {
    //     path: 'voice_gateway_picker',
    //     element: <VoiceGatewayPicker />,
    //     roles: [],
    //     name: 'Voice Gateway Picker',
    //     folder: ['Compliance and Design'],
    //     subfolder: 'List'
    // },
    // {
    //     path: '*',
    //     element: <PageNotFound /> || <main><p>404</p></main>,
    //     folder: [],
    // },
    // {
    //     path: 'design_portal',
    //     roles: [DEVELOPER, DESIGN_PORTAL_RO, DESIGN_PORTAL_RW],
    //     name: 'Design Portal',
    //     folder: ['Managed Services'],
    //     subfolder: 'List',
    //     element: <DesignPortal />,
    // },
    // {
    //   path: 'managed_services',
    //   element: <ManagedServices />,
    //   roles: [DEVELOPER, DESIGN_PORTAL_RO, DESIGN_PORTAL_RW],
    //   name: 'Design Portal',
    //   folder: ['Managed Services'],
    //   subfolder: 'List',
    //   children: [
    //     {
    //       path: ':folder',
    //       element: <ManagedServices />,
    //     },
    //     {
    //       path: ':folder/:subfolder',
    //       element: <ManagedServices />,
    //     },
    //     {
    //       path: ':folder/:subfolder/:subroute',
    //       element: <ManagedServices />,
    //     },
    //   ]
    // },
    // {
    //     path: 'notification',
    //     element: <Notification />,
    //     name: 'Notification',
    //     roles: [ADMIN, DEVELOPER],
    //     folder: ['Admin'],
    //     subfolder: 'List'
    // },
    // {
    //     path: 'user_admin',
    //     element: <UserAdmin />,
    //     roles: [ADMIN, DEVELOPER],
    //     name: 'User Admin',
    //     folder: ['Admin'],
    //     subfolder: 'List'
    // },
    // {
    //     path: 'granite_network_compliance',
    //     element: <GraniteNetworkCompliance />,
    //     roles: [],
    //     name: 'Granite Network Compliance',
    //     folder: ['Compliance and Design'],
    //     subfolder: 'List'
    // },
    // {
    //     path: 'se_data_dictionary',
    //     element: <SimpleDataDictionary />,
    //     roles: [DEVELOPER, ADMIN],
    //     name: 'SE Data Dictionary',
    //     folder: ['Examples'],
    // },
]

