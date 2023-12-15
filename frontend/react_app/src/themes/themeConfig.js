// Packages
import { colors } from '@mui/material';
import { alpha } from '@mui/material/styles';

// Constants
export const ESET_PALETTE = {
  primary: '#003057',
  secondary: '#0099D8',
  gray: '',
};
const FEEDBACK_OPACITY = 0.85;
const DARK_MODE_SHADE = 300;
const LIGHT_MODE_SHADE = 800;
const BLACK = '#000';
const WHITE = '#fff';

// Theme config object is separated into 3 sections ...
// ... 'Light Mode', 'Dark Mode', and 'Common'.
export const themeConfig = {
  // Styles for light mode specifically
  light: {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: '#F9FAFC',
            // background: `linear-gradient(270deg, ${alpha(ESET_PALETTE.secondary, 0.6)}, ${alpha(ESET_PALETTE.secondary, 0.248)})`,
            scrollbarColor: `#F9FAFC ${ESET_PALETTE.primary}`,
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              backgroundColor: ESET_PALETTE.primary,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 6,
              backgroundColor: alpha(ESET_PALETTE.secondary, 0.6),
              minHeight: 24,
              // border: `3px solid ${ESET_PALETTE.primary}`,
            },
            '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
              backgroundColor: ESET_PALETTE.primary,
            },
            '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
              backgroundColor: ESET_PALETTE.primary,
            },
            '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
              backgroundColor: alpha(ESET_PALETTE.secondary, 0.8),
            },
            '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
              backgroundColor: ESET_PALETTE.primary,
            },
          },
        },
      },
      MuiDrawerPaper: {
        borderRight: 0,
        borderColor: 'transparent',
      },
    },
    border: {
      main: '1px solid rgba(33,33,33,0.2)',
    },
    palette: {
      mode: 'light',
      background: {
        default: '#F9FAFC',
        paper: alpha('#F9FAFC', 1),
      },
      sideNav: {
        main: ESET_PALETTE.primary,
      },
      divider: '#E6E8F0',
      primary: {
        main: ESET_PALETTE.primary,
        titleBox: ESET_PALETTE.primary,
        contrastText: WHITE,
      },
      secondary: {
        main: ESET_PALETTE.secondary,
        titleBox: ESET_PALETTE.secondary,
        contrastText: WHITE,
      },
      search: {
        main: 'rgba(144, 149, 150, .3)',
      },
      alert: {
        border: {
          success: '1px solid rgba(150, 255, 150, 1)',
          error: '1px solid rgba(255, 150, 150, 0.8)',
          warning: '1px solid rgba(250, 255, 150, 1)',
        },
      },
      success: {
        main: alpha(colors.green[LIGHT_MODE_SHADE], FEEDBACK_OPACITY),
        contrastText: WHITE,
        row: 'rgba(150, 255, 150, 0.2)',
        text: 'rgba(0, 75, 0, 1)',
      },
      info: {
        main: alpha(colors.blue[LIGHT_MODE_SHADE], FEEDBACK_OPACITY),
        contrastText: WHITE,
      },
      warning: {
        main: alpha(colors.yellow[LIGHT_MODE_SHADE], FEEDBACK_OPACITY),
        contrastText: WHITE,
      },
      error: {
        main: alpha(colors.red[LIGHT_MODE_SHADE], FEEDBACK_OPACITY),
        contrastText: WHITE,
        row: 'rgba(255, 150, 150, 0.2)',
        text: 'rgba(75, 0, 0, 1)',
      },
      text: {
        primary: '#121828',
        secondary: '#65748B',
        disabled: 'rgba(55, 65, 81, 0.48)',
      },
    },
  },

  // Styles for dark mode specifically
  dark: {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: 'rgb(15 23 42)',
            scrollbarColor: '#6b6b6b #2b2b2b',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              backgroundColor: '#2b2b2b',
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: '#6b6b6b',
              minHeight: 24,
              border: '3px solid #2b2b2b',
            },
            '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
              backgroundColor: '#959595',
            },
            '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
              backgroundColor: '#959595',
            },
            '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#959595',
            },
            '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
              backgroundColor: '#2b2b2b',
            },
          },
          // '&.Mui-disabled': {
          //     border: '1px solid rgba(100, 200, 240, .4)',
          // }
        },
      },
      MuiDrawerPaper: {
        borderColor: 'transparent',
        borderRight: '0px solid transparent',
      },
    },
    border: {
      main: `1px solid ${alpha(WHITE, 0.2)}`,
      // disabled: '1px solid rgba(100, 140, 220, 1)'
    },
    palette: {
      mode: 'dark',
      background: {
        default: alpha(colors.grey[900], 1),
        paper: 'rgba(20 31 49)',
      },
      sideNav: {
        main: ' rgb(15 23 42)',
      },
      divider: alpha(colors.grey[900], 1),
      primary: {
        default: ESET_PALETTE.primary,
        titleBox: ' rgb(15 23 42)',
        main: WHITE,
        contrastText: alpha(colors.grey[900], 1),
      },
      secondary: {
        main: '#002552',
        titleBox: 'rgba(20 31 49)',
        contrastText: alpha(colors.grey[900], 1),
      },
      search: {
        main: 'rgba(144, 149, 150, .3)',
      },
      alert: {
        border: {
          success: '1px solid rgba(150, 255, 150, 1)',
          error: '1px solid rgba(255, 150, 150, 0.8)',
          warning: '1px solid rgba(250, 255, 150, 1)',
        },
      },
      success: {
        main: alpha(colors.green[DARK_MODE_SHADE], FEEDBACK_OPACITY),
        contrastText: alpha(colors.grey[900], 1),
        row: 'rgba(150, 255, 150, 0.4)',
        text: 'rgba(150, 250, 150, 1)',
      },
      info: {
        main: alpha(colors.blue[DARK_MODE_SHADE], FEEDBACK_OPACITY),
        contrastText: alpha(colors.grey[900], 1),
      },
      warning: {
        main: alpha(colors.yellow[DARK_MODE_SHADE], FEEDBACK_OPACITY),
        contrastText: alpha(colors.grey[900], 1),
      },
      error: {
        main: alpha(colors.red[DARK_MODE_SHADE], FEEDBACK_OPACITY),
        contrastText: alpha(colors.grey[900], 1),
        row: 'rgba(255, 150, 150, 0.4)',
        text: 'rgba(255, 150, 150, 1)',
      },
      text: {
        primary: '#ddd',
        secondary: '#888',
        disabled: 'rgba(200, 200, 200, 1)',
      },
    },
  },

  // common styles for both light and dark modes
  common: {
    palette: {
      neutral: {
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
      },
      action: {
        active: '#6B7280',
        focus: 'rgba(55, 65, 81, 0.12)',
        hover: 'rgba(55, 65, 81, 0.04)',
        selected: 'rgba(55, 65, 81, 0.08)',
        disabledBackground: 'rgba(55, 65, 81, 0.12)',
        disabled: 'rgba(55, 65, 81, 0.26)',
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 1000,
        lg: 1200,
        xl: 1920,
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
          sizeSmall: {
            padding: '6px 16px',
          },
          sizeMedium: {
            padding: '8px 20px',
          },
          sizeLarge: {
            padding: '11px 24px',
          },
          textSizeSmall: {
            padding: '7px 12px',
          },
          textSizeMedium: {
            padding: '9px 16px',
          },
          textSizeLarge: {
            padding: '12px 16px',
          },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: '32px 24px',
            '&:last-child': {
              paddingBottom: '32px',
            },
          },
        },
      },
      MuiCardHeader: {
        defaultProps: {
          titleTypographyProps: {
            variant: 'h6',
          },
          subheaderTypographyProps: {
            variant: 'body2',
          },
        },
        styleOverrides: {
          root: {
            padding: '32px 24px',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
          },
          html: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
            width: '100%',
          },
          body: {
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            minHeight: '100%',
            width: '100%',
            backgroundColor: '#F9FAFC',
          },
          '#__next': {
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: '#E6E8F0',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: '#F3F4F6',
            '.MuiTableCell-root': {
              color: '#374151',
            },
            borderBottom: 'none',
            '& .MuiTableCell-root': {
              borderBottom: 'none',
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            },
            '& .MuiTableCell-paddingCheckbox': {
              paddingTop: 4,
              paddingBottom: 4,
            },
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: [
      'none',
      '0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)',
      '0px 1px 2px rgba(100, 116, 139, 0.12)',
      '0px 1px 4px rgba(100, 116, 139, 0.12)',
      '0px 1px 5px rgba(100, 116, 139, 0.12)',
      '0px 1px 6px rgba(100, 116, 139, 0.12)',
      '0px 2px 6px rgba(100, 116, 139, 0.12)',
      '0px 3px 6px rgba(100, 116, 139, 0.12)',
      '0px 2px 4px rgba(31, 41, 55, 0.06), 0px 4px 6px rgba(100, 116, 139, 0.12)',
      '0px 5px 12px rgba(100, 116, 139, 0.12)',
      '0px 5px 14px rgba(100, 116, 139, 0.12)',
      '0px 5px 15px rgba(100, 116, 139, 0.12)',
      '0px 6px 15px rgba(100, 116, 139, 0.12)',
      '0px 7px 15px rgba(100, 116, 139, 0.12)',
      '0px 8px 15px rgba(100, 116, 139, 0.12)',
      '0px 9px 15px rgba(100, 116, 139, 0.12)',
      '0px 10px 15px rgba(100, 116, 139, 0.12)',
      '0px 12px 22px -8px rgba(100, 116, 139, 0.25)',
      '0px 13px 22px -8px rgba(100, 116, 139, 0.25)',
      '0px 14px 24px -8px rgba(100, 116, 139, 0.25)',
      '0px 10px 10px rgba(31, 41, 55, 0.04), 0px 20px 25px rgba(31, 41, 55, 0.1)',
      '0px 25px 50px rgba(100, 116, 139, 0.25)',
      '0px 25px 50px rgba(100, 116, 139, 0.25)',
      '0px 25px 50px rgba(100, 116, 139, 0.25)',
      '0px 25px 50px rgba(100, 116, 139, 0.25)',
    ],
    typography: {
      button: {
        fontWeight: 600,
      },
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.57,
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.75,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.57,
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.5px',
        lineHeight: 2.5,
        textTransform: 'uppercase',
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.66,
      },
      h1: {
        fontWeight: 700,
        fontSize: '3.5rem',
        lineHeight: 1.375,
      },
      h2: {
        fontWeight: 700,
        fontSize: '3rem',
        lineHeight: 1.375,
      },
      h3: {
        fontWeight: 700,
        fontSize: '2.25rem',
        lineHeight: 1.375,
      },
      h4: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.375,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.375,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.375,
      },
    },
  },
};