// Packages
import React, { useEffect, useRef, useState } from 'react'
import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import axios from 'axios'

import './CustomSearch.scss'


const SearchDropdown = ({ 
    label, 
    url, 
    multiple, 
    getOptionLabel, 
    pageSize='30', 
    optionsPagination=true, 
    onChange, 
    initialOptions=[], 
    value, 
    isOptionEqualToValue, 
    error,
    renderOptions,
    ...args 
}) => {
    // Used to prevent searching based on provided value on first render
    const [isFirstRender, setIsFirstRender] = useState(true)
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false)
    const [searchResultsCache, setSearchResultsCache] = useState({})

    const [options, setOptions] = useState(initialOptions)
    const [_value, setValue] = useState(
        value 
            ? value 
            : multiple
                ? []
                : null
    )
    const [inputValue, setInputValue] = useState('')

    // Loading on scroll
    const [position, setPosition] = useState(0)
    const listElem = useRef()
    const mounted = useRef()
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState()

    useEffect(() => {
        if (!mounted.current) mounted.current = true;
        else if (position && listElem.current)
            listElem.current.scrollTop = position - listElem.current.offsetHeight;
    })

    async function fetchData(loadNextPage){
        const page = (loadNextPage) ? currentPage + 1 : currentPage

        const fullUrl = 
            url.replace(/{query}/g, `%${inputValue}%`) 
                + (url.includes('?') ? '' : '?')
                + (optionsPagination ? `&page=${page}&pageSize=${pageSize}` : '')
        
        const data = searchResultsCache[fullUrl] || (await axios(fullUrl)).data

        setLastPage(data.metadata?.lastPage)

        setSearchResultsCache(old => ({...old, [fullUrl]: data}))

        if (loadNextPage) {
            setOptions([...initialOptions, ...options, ...data.data])
            setCurrentPage(page)
        }
        else setOptions([...initialOptions, ...data.data])
    }

    useEffect(() => {
        if (isFirstRender) return setIsFirstRender(false)

        setOptions([])

        const delayDebounceFn = setTimeout(() => {
            fetchData()
        }, 1000)
      
        return () => clearTimeout(delayDebounceFn)
    }, [inputValue])

    useEffect(() => {
        if (!dropdownIsOpen) return

        if (!options.length || options.length == initialOptions.length) fetchData()

    }, [dropdownIsOpen])

    useEffect(() => {
        // Should prevent useEffect loop
        function setValueWrapper(v){
            if (JSON.stringify(v) != JSON.stringify(_value)) setValue(v)
        }

        onChange(_value, setValueWrapper)
    }, [_value])

    return (
        <Autocomplete
            multiple={multiple}
            id={label}
            options={renderOptions ? renderOptions(options) : options}
            getOptionLabel={(option) => (getOptionLabel) ? getOptionLabel(option) : option.title || ''}
            onInputChange={(event, _inputValue, reason) => {
                if ( !event || (reason != 'clear' && event.type == 'click') ) return
        
                setCurrentPage(1)
                setInputValue(_inputValue)
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label || ''}
                    error={error}
                />
            )}
            ListboxProps={{
                ref: listElem,
                onScroll: ({ currentTarget }) => {
                    const scrollPosition =
                        currentTarget.scrollTop + currentTarget.clientHeight

                    if (currentTarget.scrollHeight - scrollPosition <= 1 && currentPage < lastPage) {
                        fetchData(true)
                    }
                },
            }}
            value={_value}            
            isOptionEqualToValue={(option, value) => 
                isOptionEqualToValue
                    ? isOptionEqualToValue(option, value)
                    : typeof option == 'object'
                        ? option.id === value.id
                        : option == value
            }
            error={error}
            {...args}
            onChange={(event, values) => {
                setValue(values)
                setInputValue('')
            }}

            // Used to not auto load dropdown on initial render
            onOpen={event => setDropdownIsOpen(true)}
            onClose={event => setDropdownIsOpen(false)}
        />
    )
}

export default SearchDropdown
