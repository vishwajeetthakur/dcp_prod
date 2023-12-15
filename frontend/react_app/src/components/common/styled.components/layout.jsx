import { styled } from '@mui/material/styles'
import drawerWidth  from './drawerWidth'
// theme.spacing(1) === '8px'
// theme.spacing(2) === '16px' ... etc...

// all other theme props can be found in ./themes/themeConfig


// Layout
export const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: '84px',
    marginLeft: `${drawerWidth}px`,
    
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);
