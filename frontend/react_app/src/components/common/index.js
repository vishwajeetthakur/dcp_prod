import { lazy } from 'react';

// import Alerts from './alerts';
import AppRoutes from './Routes';
import BasicWrapper from './BasicWrapper/BasicWrapper';
// import Keycloak from './Keycloak';
import Layout from './Layout';
// import LinearStepper from './LinearStepper';
import Nav from './Nav';
import SingleInputSearch from './SingleInputSearch';
// import ToolTabs from './ToolTabs'
import { ToolWrapper, NewToolWrapper } from './ToolWrapper';
import { SearchDropdown, SearchInput } from './CustomSearch';
import CustomForm from './forms/CustomForm';
// import CustomTable from './tables/CustomTable';
// import { CustomTable as CustomTable2 } from './CustomTable/';
import { CustomTable } from './CustomTable';
import MuiTooltip from './forms/MuiTooltip';
import { BasicCategoryTable } from './tables/BasicCategoryTable'

// Lazy loading components that are not always required on an initial renders
const Alerts = lazy(() => import('./alerts')); // *occasional events
const LinearStepper = lazy(() => import('./LinearStepper')); // *optional
const ToolTabs = lazy(() => import('./ToolTabs')); // *optional

export {
  Alerts,
  AppRoutes,
  BasicWrapper,
  BasicCategoryTable,
  CustomForm,
  CustomTable,
  // CustomTable2,
  // Keycloak,
  Layout,
  LinearStepper,
  MuiTooltip,
  Nav,
  SearchDropdown,
  SearchInput,
  SingleInputSearch,
  ToolTabs,
  ToolWrapper,
  NewToolWrapper,
};