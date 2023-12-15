// Packages
import React, { useEffect, useState } from 'react'
import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import axios from 'axios'
import PropTypes from 'prop-types'

import './CustomSearch.scss'


const SearchInput = ({ label, url, multiple, getOptionLabel, additionalOptionsFilter, ...args }) => {
    const [options, setOptions] = useState([])
    const [value, setValue] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [searchIsOpen, setSearchIsOpen] = useState(false)

    async function fetchData() {

        const fullUrl = url.replace(/{query}/g, inputValue)
        try {
            setIsLoading(true)

            const response = await axios.get(fullUrl)

            if (response?.data?.data) setOptions(response.data.data)
            else setOptions(response.data)

        } catch (error) {
            console.error(error)

        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!inputValue) setOptions([])

        const delayDebounceFn = setTimeout(() => {
            if (inputValue) fetchData()
        }, 1000)

        return () => clearTimeout(delayDebounceFn)
    }, [inputValue])


    function onInputChange(event, _inputValue, reason) {
        setSearchIsOpen(true)

        if (reason != 'reset') setInputValue(_inputValue)
    }

    return (
        <Autocomplete
            multiple={multiple}
            id="autocomplete-input"
            aria-label="autocomplete-input"
            open={searchIsOpen}
            onClose={() => setSearchIsOpen(false)}
            onOpen={() => setSearchIsOpen(true)}
            //name={tableOrColumnName}
            options={options}
            loading={isLoading}
            loadingText={<CircularProgress size={30} sx={{ marginLeft: '45%' }} />}
            getOptionLabel={(option) => (getOptionLabel) ? getOptionLabel(option) : option.title || ''}
            onChange={(e, values) => setValue(values)}
            onInputChange={onInputChange}
            filterOptions={(options, { getOptionLabel }) => {
                options = additionalOptionsFilter ? additionalOptionsFilter(options) : options
                
                const sortedOptions = options.filter(i => getOptionLabel(i) == inputValue)

                // If search value doesn't match any of the option labels provide full options
                return (!sortedOptions.length) ? options : sortedOptions
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label || ''}
                    // endAdornment={<args.EndAdornment />}
                //error={errorFields[tableOrColumnName]}
                //placeholder="Favorites"
                />
            )}
            {...args}
        />
    )
}

export default SearchInput

SearchInput.propTypes = {
    label: PropTypes.string,
    url: PropTypes.string.isRequired,
    // multiple: PropTypes.boolean,
    getOptionLabel: PropTypes.func.isRequired,
    args: PropTypes.any,
}