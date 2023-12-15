// Packages
import { 
    AppBar, Box, Paper, FormControl, Toolbar, TextField,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles'
import  drawerWidth  from './drawerWidth'

// theme.spacing(1) === '8px'
// theme.spacing(2) === '16px' ... etc...

// all other theme props can be found in ./themes/themeConfig

// Nav
export const StyledNavbar = styled(AppBar)(({ theme, open }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0)',
  zIndex: 10, 
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const EsetButton = styled(Box)(({ theme }) => ({
  textDecoration: 'none',
  backgroundColor: 'primary',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.10),
  },
}))

export const Search = styled(FormControl)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.search.main, 0.25),
  '&:hover': {
    backgroundColor: alpha(theme.palette.search.main, 0.35),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export const StyledToolbar = styled(Toolbar)(() => ({
  minHeight: 64,
  left: 0,
  px: 2,
  width: '100%',
  margin: 'auto',
  border: 0,
}))


export const StyledDropDown = styled(Paper)(({ theme }) => ({
  overflow: 'visible',
  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
  marginTop: '12px',
  '& .MuiAvatar-root': {
    width: 32,
    height: 32,
    marginLeft: '-4px',
    marginRight: '8px',
  },
  '&:before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    right: 14,
    width: 10,
    height: 10,
    backgroundColor: 'background.paper',
    transform: 'translateY(-50%) rotate(45deg)',
    zIndex: 0,
  },
}))
