// Packages
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Config
import { routes } from '../common/Routes/routesConfig'


export const useSearch = () => {
    // Hooks
    const location = useLocation()

    // Helpers
    const searchStringInArray = (str, strArray) => strArray.filter(item => item && item.toLowerCase().match(str))
    
    const getSearchItem = (item) => {
        const searchedItem = searchStringInArray(item.toLowerCase().trim(), routes.map(({ name }) => name))
        
        return searchedItem.map(item => routes.filter(({ name }) => item === name)[0] )
    }
    
    // Effects
    useEffect(() => {   
        const history = JSON.parse(sessionStorage.getItem('history'))
        
        if (!history) sessionStorage.setItem('history', JSON.stringify([]))

    }, [])

    useEffect(() => {
        const history = JSON.parse(sessionStorage.getItem('history'))

        if (!history.includes(location.pathname)) history.push(location.pathname)

        sessionStorage.setItem('history', JSON.stringify(history))

    }, [location])

    // Return
    return {
        getSearchItem,
        history: JSON
            .parse(sessionStorage
                .getItem('history'))
                ?.map(item => routes.filter(route => item === '/' + route.path)[0])
    }
}
