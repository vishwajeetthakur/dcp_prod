// Packages
import { 
    Box, Drawer, ListItem, ListItemButton,
} from '@mui/material';
import { styled } from '@mui/material/styles'
import  drawerWidth  from './drawerWidth'

// theme.spacing(1) === '8px'
// theme.spacing(2) === '16px' ... etc...

// all other theme props can be found in ./themes/themeConfig

  
// Side Nav
export const LeftNavDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background: theme.palette.sideNav.main,
    color: theme.palette.common.white,
    borderColor: 'transparent',
    boxShadow: '10px 8px 15px rgba(33, 33, 33, 0.3)',
    overflowY: 'inherit',
  },
}));
  
export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  color: '#fff',
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

export const BoxSubTitle = styled(Box)(() => ({ 
  fontSize: '1rem', 
  marginTop: '8px',
  fontFamily: 'sans-serif', 
  color: '#6F7E8C',  
  fontWeight: '700'
}));

export const ListItemsButton = styled(ListItem)(({ theme }) => ({
  paddingTop: '2px', 
  paddingBottom: '2px', 
  margin: '2px',
  color: theme.palette.common.white,
}));

export const ListItemButtons = styled(ListItemButton)(() => ({
  paddingTop: '0px', 
  paddingBottom: '0px', 
  margin: '2px'
}));
  