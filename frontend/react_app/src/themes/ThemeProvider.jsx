// Packages
import { useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux'
import { createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@emotion/react';

// Hooks
import { useColorMode } from '../components/hooks';

// Utilities
import { themeConfig } from './themeConfig';


const getTheme = ({ mode }) => useMemo(() => createTheme({
    // *note* must spread common values before light or dark mode values ...
    // ... light or dark mode values overwrite some of the common values ...
    // ... theme will crash otherwise.
    ...themeConfig['common'],
    ...themeConfig[mode],
}), [mode])

export const ThemeProvider = ({ children }) => {
    // const { colorMode } = useSelector(state => state.globalStates)
    const { mode } = useColorMode()

    return (
        <MuiThemeProvider theme={getTheme({ mode })}>
            <CssBaseline enableColorScheme />
            {children}
        </MuiThemeProvider>
    )
}

