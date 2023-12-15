import { lazy } from 'react';
import Gander from './Gander';

// ** LAZY LOAD COMPONENTS VERSION BELOW ** //
const ComplianceAndDesign = lazy(() => import('./ComplianceAndDesign'));
const DesignPortal = lazy(() => import('./DesignPortal'));
const ErrorBoundary = lazy(() => import('./ErrorBoundary'));
const ExpressBandwidthUpgrade = lazy(() => import('./ExpressBandwidthUpgrade/ExpressBandwidthUpgrade'));
// const Gander = lazy(() => import('./Gander'));
const GraniteNetworkCompliance = lazy(() => import('./GraniteNetworkCompliance'));
const Home = lazy(() => import('./Home'));
const IpSwip = lazy(() => import('./IpSwip'));
const Isin = lazy(() => import('./IseCheck'));
// const ManagedServices = lazy(() => import('./ManagedServices'));
const Odin = lazy(() => import('./Odin'));
const Profile = lazy(() => import('./Profile'));
const Notification = lazy(()=>import('./Notification'))
const RemedyTicketGenerator = lazy(() => import('./RemedyTicketGenerator'));
const SeefaReporting = lazy(() => import('./SeefaReporting'));
const SimpleDataDictionary = lazy(() => import('./SimpleDataDictionary'));
const Unauthorized = lazy(() => import('./Unauthorized'));
const UserAdmin = lazy(() => import('./UserAdmin'));
const VoiceGatewayPicker = lazy(() => import('./VoiceGatewayPicker'));
const AutomationImpactTracker = lazy(() => import('./AutomationImpactTracker'));
const VendorModelMapping = lazy(() => import('./VendorModelMapping'));
const I2D2ComplianceTool = lazy(() => import('./I2D2ComplianceTool'));

export {
    AutomationImpactTracker,
    ComplianceAndDesign,
    DesignPortal,
    ErrorBoundary,
    ExpressBandwidthUpgrade,
    Gander,
    GraniteNetworkCompliance,
    Home,
    IpSwip,
    Isin,
    // ManagedServices,
    Odin,
    Profile,
    RemedyTicketGenerator,
    SeefaReporting,
    SimpleDataDictionary,
    Unauthorized,
    UserAdmin,
    VoiceGatewayPicker,
    Notification,
    VendorModelMapping,
    I2D2ComplianceTool
};