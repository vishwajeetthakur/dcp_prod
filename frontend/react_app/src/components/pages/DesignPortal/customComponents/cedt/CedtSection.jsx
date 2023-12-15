import { useState, useRef } from 'react'

import {
    Alert,
    Button,
    DialogActions,
    DialogContent,
    Divider,
    Stack,
    Grid,
} from '@mui/material'

import { BootstrapDialog, BootstrapDialogTitle } from '../../../../common/forms/CustomModal'

import { getDevicesByServiceCode } from '../../helpers'

import CedtDataTab from './CedtDataTab'
import FormMne from './FormMne'

const CedtSection = ({ designPortalData, setDesignPortalData, username }) => {
    const cedtData =
        useRef(
            !designPortalData?.eset?.cedt?.data
                ? {}
                : typeof designPortalData?.eset?.cedt?.data == 'string'
                    ? JSON.parse(designPortalData?.eset?.cedt?.data)?.answers
                    : designPortalData?.eset?.cedt?.data?.answers
        )

    const [formOpen, setFormOpen] = useState(false)
    const [formAccepted, setFormAccepted] = useState(false)
    const formDisabled = formAccepted != false
    const [showCedtData, setShowCedtData] = useState(false)
    const [showTooltips, setShowTooltips] = useState(false)

    const [formValues, setFormValues] = useState({})

    function updateFormValues (eventOrName, dropdownOption) {

        setFormValues({
            ...formValues,
            ...dropdownOption
                ? { [eventOrName]: dropdownOption }
                : { [eventOrName.target.id]: eventOrName.target.value }
        })
    }


    const serviceTransaction = useRef(
        designPortalData
            .salesforce
            .service_transactions?.[0]
    )

    async function submit() {
        const acceptedValues =
            Object.entries(checkboxValues)
                .filter(([key, val]) => val == true)
                .reduce((acc, [key,]) => {
                    const val = cedtAnswers[key]

                    // Filter out parent keys
                    return typeof val == 'undefined'
                        ? acc
                        : { ...acc, [key]: val }
                }, {})

        // setFormAccepted({
        //     username: username,
        //     timestamp: (new Date).toISOString().replace('T', ' ').slice(0, -5)
        // })

        console.log('submit', { checkboxValues, acceptedValues })

        // const updateDpOrder = await axios.put(`/api/design_portal/table/dp_order?id=${designPortalData.eset.dp_order.id}`, { status: 'Design In Progress' })

        // setDesignPortalData({
        //     ...designPortalData,
        //     eset: {
        //         ...designPortalData.eset,
        //         dp_order: {
        //             ...designPortalData.eset.dp_order,
        //             status: 'Design In Progress'
        //         }
        //     }
        // })
    }

    // console.log({designPortalData})

    return (
        <>
            <BootstrapDialog
                onClose={() => setFormOpen(false)}
                aria-labelledby="customized-dialog-title"
                open={formOpen}
                fullWidth={true}
                { ...showCedtData ? { width: '1000px' } : {}}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={() => setFormOpen(false)}>
                    Accept CEDT Data
                    <Button  
                        sx={{ 
                            position: 'absolute', 
                            right: 220, 
                            top: 10 
                        }} 
                        variant="outlined"
                        onClick={ () => setShowTooltips(!showTooltips) }
                    >
                        { showTooltips ? 'Hide' : 'Show' } Tooltips
                    </Button>
                    <Button  
                        sx={{ 
                            position: 'absolute', 
                            right: 60, 
                            top: 10 
                        }} 
                        variant="outlined"
                        onClick={ () => setShowCedtData(!showCedtData) }
                    >
                        { showCedtData ? 'Hide' : 'Show' } CEDT Data
                    </Button>
                </BootstrapDialogTitle>
                

                <DialogContent dividers>
                    {
                        formAccepted != false &&
                        <Alert severity="success">
                            {`Accepted by: ${username} (${formAccepted.timestamp})`}
                        </Alert>
                    }
                    <Grid container>
                        <Grid item xs style={ showCedtData ? { marginRight: '16px' } : {} }> 
                            {/* <Typography variant='h5' style={{ textAlign: 'center' }}>What will be created...</Typography> */}
                            <FormMne designPortalData={designPortalData} updateFormValues={updateFormValues} cedtData={cedtData} showTooltips={showTooltips} />
                        </Grid>
                        
                        {
                            showCedtData && (
                                <>
                                    <Divider orientation="vertical" flexItem />
                                    <CedtDataTab designPortalData={designPortalData} cedtData={cedtData.current} />
                                </>
                            )
                        }
                        
                    </Grid>
                </DialogContent>

                <DialogActions>                    
                    <Button id="create-button" autoFocus type="submit" onClick={submit} disabled={formDisabled}>
                        Submit
                    </Button>
                </DialogActions>
            </BootstrapDialog>

            {
                designPortalData.eset?.cedt?.data
                    ? (
                        <>
                            <Alert severity="info">This section is currently under development. Clicking submit will not affect any data.</Alert>
                            <Stack spacing={2} alignItems="center" style={{ marginTop: '16px' }}>

                                {/* <Chip icon={<CheckIcon />} label={"Accepted: " + designPortalData.eset.cedt.created_at.replace('T', ' ').slice(0, -5)} variant="outlined" color="primary"/> */}
                                <div>Last updated: {designPortalData.eset.cedt.created_at.replace('T', ' ').slice(0, -5)}</div>
                                <Button style={{ width: '200px' }} variant="outlined" onClick={() => setFormOpen(true)}>View</Button>
                            </Stack>
                        </>
                    )
                    : 'No data available'
            }
        </>
    )
}

export default CedtSection

// {
//     "answers": {
//         "equipment": {
//             "dhcp": {
//                 "configBgpSettings": false,
//                 "createStaticRoutes": true,
//                 "enableNatPat": true,
//                 "settingsRange": "192.168.1.100 – 200"
//             },
//             "enableDhcp": true,
//             "equipGatewayAssignedIp": "192.168.1.1",
//             "subnetIpAddresses": "192.168.1.0/24",
//             "vlanId": "2000"
//         },
//         "version": "v1",
//         "vpnSettings": {
//             "hasVpn": true,
//             "haveMoreThanFour": false,
//             "vpnTunnelSettings": [
//                 {
//                     "destNetwork": "172.16.5.2",
//                     "infoAboutVpn": "Its a tunnel!",
//                     "p1Auth": "SHA 256",
//                     "p1DiffieGroup": "1",
//                     "p1Encryption": "AES 256",
//                     "p1LifeTime": "900",
//                     "p2Auth": "SHA 256",
//                     "p2EncTransform": "AES 256",
//                     "p2Lifetime": "900",
//                     "perfForwardSec": "Off",
//                     "preSharedKey": "Bananaphone",
//                     "remotePeerIp": "10.10.10.10",
//                     "tunnelName": "Blarg"
//                 },
//                 {
//                     "destNetwork": "172.16.42.5",
//                     "infoAboutVpn": "It exists!",
//                     "p1Auth": "SHA 256",
//                     "p1DiffieGroup": "1",
//                     "p1Encryption": "AES 256",
//                     "p1LifeTime": "800",
//                     "p2Auth": "SHA 256",
//                     "p2EncTransform": "AES 256",
//                     "p2Lifetime": "800",
//                     "perfForwardSec": "Off",
//                     "preSharedKey": "ItsAsnake",
//                     "remotePeerIp": "100.10.10.10",
//                     "tunnelName": "Another!"
//                 }
//             ]
//         },
//         "dnsAndFiltering": {
//             "dnsServerSettings": {
//                 "additionalDnsIPs": false,
//                 "primaryDnsIP": "24.93.41.125",
//                 "secondaryDnsIP": "24.93.41.126"
//             },
//             "hasDnsSettings": true,
//             "hasPrioritizedApplications": true,
//             "hasWebFilteringForInternalUsers": true,
//             "prioritizedApplicationList": [
//                 "VoIP"
//             ],
//             "webFiltering": {
//                 "allowWebsitesList": [
//                     "yourdad.com"
//                 ],
//                 "blockWebsitesList": [
//                     "yourmom.com"
//                 ],
//                 "filterByCategory": true,
//                 "filterCategories": {
//                     "contentCategoryFiltering": [
//                         "Adult",
//                         "Advertisements",
//                         "Alcohol",
//                         "Animals and Pets",
//                         "Auctions",
//                         "Business and Industry",
//                         "Cannabis",
//                         "Child Abuse Content",
//                         "Cloud and Data Centers",
//                         "Conventions, Conferences and Trade Shows",
//                         "Cryptocurrency",
//                         "Cryptomining",
//                         "Dating",
//                         "DNS-Tunneling",
//                         "Extreme",
//                         "Filter Avoidance",
//                         "Gambling",
//                         "Hacking",
//                         "Hate Speech",
//                         "Hunting",
//                         "Illegal Activities",
//                         "Illegal Downloads",
//                         "Illegal Drugs",
//                         "Lingerie and Swimsuits",
//                         "Non-sexual Nudity",
//                         "Paranormal",
//                         "Pornography",
//                         "Terrorism and Violent Extremism",
//                         "Tobacco",
//                         "Weapons"
//                     ],
//                     "threatCategoryFiltering": [
//                         "Bogon",
//                         "Botnets",
//                         "Cryptojacking",
//                         "DNS Tunneling",
//                         "Domain Generated Algorithm",
//                         "Dynamic DNS",
//                         "Ebanking Fraud",
//                         "Exploits",
//                         "High Risk Sites and Locations",
//                         "Indicators of Compromise (IOC)",
//                         "Linkshare",
//                         "Malicious Sites",
//                         "Malware Sites",
//                         "Open Mail Relay",
//                         "Phishing",
//                         "Spam",
//                         "Spyware and Adware",
//                         "TOR exit Nodes"
//                     ]
//                 },
//                 "hasAllowedWebsites": true,
//                 "hasBlockedWebsites": true
//             }
//         },
//         "vpnClients": {
//             "hasVpnClients": true,
//             "vpnClientsConfig": {
//                 "activeDirectory": {
//                     "adCredentials": {
//                         "adPassword": "SqIOIRofTDuBHA+0UYFWqpjMureZ7MVr8HyJJm6Vi+YPPNt3oIKcg8Uyi2z69xUC79ikqv2/SNX412Y+7utWB3rjVqwwCW3+OsROVl4haC0ManWN4TbXXuvHKyVYptuhnxDiCih8k03F35JbK0Y5SGO83cmAxnFfu6B1ip70bpdCMF2rQM9Ry+KgtwLtl+NM68oCrI3XXcuRfWjmrzaY/C27iMmBTVJbyNbfbu1biGlbuXkkofGShy5Oky3xd9w/zN26ctbBsLIgpllXQmYx2J5BAn5uyN9HNA2w5sBgJXrK1tfZwcPbh9EkC9mXLmqM1SQ/7uWwoKgsJNqprj6yKQ==",
//                         "adServerIP": "123.3.3.123",
//                         "adShortDomainName": "chart.domain",
//                         "adUserName": "Why"
//                     },
//                     "confirmationMerakiDocTLSCertReq": true
//                 },
//                 "confirmationMerakiDocVpnOsConf": true,
//                 "hasPreconfigVpnClients": false,
//                 "integrateActiveDirectory": true,
//                 "preconfigVpnClients": null
//             }
//         }
//     },
//     "orderStatus": "Completed",
//     "currentStep": "5"
// }

