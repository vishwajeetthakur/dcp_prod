import { useState } from 'react'

import {
    Grid,
    Typography,
    Divider,
    Box
} from '@mui/material'

import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import KeyIcon from '@mui/icons-material/Key'

const capitalizedAcronyms = [
    "ad",
    "dhcp",
    "bgp",
    "nat",
    "pat",
    "ip",
    "vlan",
    "id",
    "vpn",
    "dns",
    "ip",
    "ip",
    "os"
]

const hiddenCedtKeys = ['version', 'configBgpSettings']

const secretCedtKeys = ['AD Password', 'Password', 'Pre Shared Key']

function customFlattenObject(obj, currentKey) {
    if (Array.isArray(obj) && (typeof obj[0] != 'object' || obj[0] == null)) return { [currentKey]: obj }

    return Object.entries(obj)
        .filter(([key,]) => !hiddenCedtKeys.includes(key))
        .reduce((acc, [key, val]) => {
            const fullKey = [currentKey, key].filter(k => k).join('.')

            if (typeof val != 'object' || val == null) {
                return { ...acc, [fullKey]: val }
            }
            else {
                return { ...acc, ...customFlattenObject(val, fullKey) }
            }
        }, {})
}

export default function CedtDataTab ({ designPortalData, cedtData }) {
    const [cedtAnswers,] = useState(customFlattenObject(cedtData))
    const [initialCheckboxValues,] =
        useState(
            Object.keys(cedtAnswers)
                .reduce((acc, key) => {
                    const parentKeys =
                        getParentKeys(key)
                            .reduce((acc, parentKey) => ({ ...acc, [parentKey]: false }), {})

                    return { ...acc, ...parentKeys, [key]: false }
                }, {})
        )

    function getParentKeys(key) {
        return key
            .split('.')
            .slice(0, -1)
            .map((key, index, original) => original.slice(0, index + 1).join('.'))
    }

    return (
        <Grid item xs>
            {/* <Typography variant='h6' style={{ textAlign: 'center', marginBottom: '5px' }}>CEDT Data</Typography> */}
            <Box style={{ marginLeft: '16px' }}>
                {
                    Object.entries(initialCheckboxValues)
                        .map(([key, isChecked], index) => {
                            const keyHierarchy = key.split('.')
                            const keyHierarchyLevel = keyHierarchy.length
                            const value = cedtAnswers[key]

                            const label =
                                keyHierarchy
                                    .slice(-1)[0]
                                    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
                                    .split(' ')
                                    .map(word => (
                                        isNaN(word) == false
                                            ? `#${parseInt(word) + 1}`
                                            : capitalizedAcronyms.includes(word.toLowerCase())
                                                ? word.toUpperCase()
                                                : word.charAt(0).toUpperCase() + word.slice(1)
                                    ))
                                    .join(' ')

                            const disabledField =
                                typeof value != 'undefined' &&
                                (value == null || value.length == 0)

                            return hiddenCedtKeys.includes(label)
                                ? null
                                : (
                                    <>
                                        {keyHierarchyLevel == 1 && index != 0 ? <Divider /> : ''}
                                        <Typography
                                            component='div'
                                            style={
                                                {
                                                    margin: 4,
                                                    marginLeft: 30 * (keyHierarchyLevel - 1),
                                                    ...typeof value == 'boolean' || secretCedtKeys.includes(label)
                                                        ? { display: 'flex', alignItems: 'center', flexWrap: 'wrap' }
                                                        : {},
                                                    ...disabledField
                                                        ? { color: 'gray' }
                                                        : {}
                                                }

                                            }
                                        >
                                            <Box fontWeight='fontWeightMedium' display='inline'>
                                                {`• ${label}${typeof value != 'undefined' ? ': ' : ''}`}
                                            </Box>
                                            {
                                                secretCedtKeys.includes(label) && !!value
                                                    ? <KeyIcon color="primary" style={{ marginLeft: '3px' }} />
                                                    : typeof value == 'boolean'
                                                        ? value == true
                                                            ? <CheckIcon color="success" style={{ marginLeft: '3px' }} />
                                                            : <CloseIcon color="error" style={{ marginLeft: '3px' }} />
                                                        : typeof value == 'string'
                                                            ? value.replace(/,(?!\s)/g, ', ')
                                                            : Array.isArray(value) && value.length != 0
                                                                ? value.join(', ')
                                                                : ''

                                            }
                                        </Typography>
                                    </>
                                )


                        })
                }
            </Box>
        </Grid>
    )
    
}