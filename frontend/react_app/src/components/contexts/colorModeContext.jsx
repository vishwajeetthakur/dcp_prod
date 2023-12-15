import { createContext, useState } from 'react'


export const colorModeContext = createContext()

export const ColorModeProvider = ({ children }) => {
    const colorMode = localStorage.getItem('colorMode')
        ? localStorage.getItem('colorMode')
        : localStorage.setItem('colorMode', 'light')

    const [mode, setMode] = useState(colorMode ? colorMode : 'light');

    const value = {
        mode,
        toggleColorMode: () => {
            setMode(prevMode => prevMode === 'light' ? 'dark' : 'light')

            localStorage.setItem('colorMode', mode === 'light' ? 'dark' : 'light')
        }
    }

    return (
        <colorModeContext.Provider value={value}>
            {children}
        </colorModeContext.Provider>
    )
}
