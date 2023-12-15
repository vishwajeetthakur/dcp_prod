import React, { useRef } from 'react'

import {
    Autocomplete,
    Chip,
    Divider,
    Grid,
    TextField,
    Tooltip
} from '@mui/material'


import {
    getDevicesByProductFamily,
    getDevicesByServiceCode,
    nextAlphanumericHostnameSuffix,
    subnetMasks,
    categoryBlocking,
    threatCategories
} from '../../helpers'

// Testing for performance problems
// function Chip({ label }){
//     return label
// }
// function Tooltip({ children }){
//     return children
// }


function FormMne({ designPortalData, cedtData, updateFormValues, showTooltips }) {
    const serviceTransaction = useRef(
        designPortalData
            .salesforce
            .service_transactions?.[0]
    )

    const deviceToCreate = useRef(
        getDevicesByServiceCode(serviceTransaction.current?.Service_Code__c)
            ?.[0]
    )

    function CustomTooltip({ title, children }){
        return (
            <Tooltip title={ showTooltips ? title : '' }>
                {children}
            </Tooltip>
        )
    }
    

    return (
        <>
            {/* <Divider style={{ marginTop: '12px', marginBottom: '16px' }}>Device</Divider> */}
            <Divider style={{ marginBottom: '16px' }}><Chip color="primary" label="Device" /></Divider>
            <Grid container spacing={1}>
                <Grid item xs>
                    <CustomTooltip title={'CLLI: ' + (designPortalData.eset.dp_site.clli || 'xxxxxxxx')}>
                        <TextField
                            id="hostname"
                            label="Hostname"
                            variant="outlined"
                            fullWidth={true}
                            defaultValue={
                                (designPortalData.eset.dp_site.clli || 'xxxxxxxx')
                                + 'MN'
                                + nextAlphanumericHostnameSuffix(designPortalData.eset.dp_device.filter(d => d.type == 'network'))
                            }
                            onChange={updateFormValues}
                        />
                    </CustomTooltip>
                </Grid>
                <Grid item xs>
                    <CustomTooltip title={`Service Transaction: ${serviceTransaction.current?.Service_Code__c} (${serviceTransaction.current?.Product_Name__c})`}>
                        <Autocomplete
                            id="model"
                            options={getDevicesByProductFamily(designPortalData.eset.dp_order.product)}
                            getOptionLabel={option => option.model}
                            renderInput={params => <TextField {...params} label='Model' />}
                            defaultValue={deviceToCreate.current}
                            onChange={(e, value) => updateFormValues('model', value)}
                        />
                    </CustomTooltip>
                </Grid>
            </Grid>
            {/* <Divider style={{ marginTop: '12px', marginBottom: '16px' }}>WAN</Divider> */}
            <Divider style={{ marginTop: '12px', marginBottom: '16px' }}><Chip color="primary" label="WAN" /></Divider>
            <Grid container spacing={1}>
                <Grid item xs>
                    <CustomTooltip title={'Subnet IP Addresses: ' + cedtData.current.equipment.subnetIpAddresses}>
                        <TextField
                            id="subnetIp"
                            label="Subnet (IP)"
                            variant="outlined"
                            fullWidth={true}
                            defaultValue={
                                cedtData.current?.equipment?.subnetIpAddresses?.split('/')?.[0]
                            }
                            onChange={updateFormValues}
                        />
                    </CustomTooltip>
                </Grid>
                <Grid item xs>
                    <CustomTooltip title={`Subnet IP Addresses: ${cedtData.current.equipment.subnetIpAddresses} (Default: 255.255.255.248)`}>
                        <Autocomplete
                            id="subnetIpMask"
                            options={subnetMasks}
                            renderInput={params => <TextField {...params} label='Subnet (Mask)' />}
                            defaultValue={
                                subnetMasks.reverse()[cedtData.current?.equipment?.subnetIpAddresses?.split('/')?.[1]] ||
                                '255.255.255.248'
                            }
                            style={{ width: '200px' }}
                            onChange={(e, value) => updateFormValues('subnetIpMask', value)}
                        />
                    </CustomTooltip>
                </Grid>
                <Grid item xs>
                    <CustomTooltip title={'Equip Gateway Assigned IP: ' + cedtData.current?.equipment?.equipGatewayAssignedIp}>
                        <TextField
                            id="gatewayIp"
                            label="Gateway IP"
                            variant="outlined"
                            fullWidth={true}
                            defaultValue={
                                cedtData.current?.equipment?.equipGatewayAssignedIp
                            }
                            onChange={updateFormValues}
                        />
                    </CustomTooltip>
                </Grid>
            </Grid>
            <Grid container spacing={1} style={{ marginTop: '12px' }}>
                <Grid item xs>
                    <CustomTooltip title={`Primary DNS: ${cedtData.current?.dnsAndFiltering?.dnsServerSettings?.primaryDnsIP} (Default: 8.8.8.8)`}>
                        <TextField
                            id="dns1"
                            label="DNS1"
                            variant="outlined"
                            fullWidth={true}
                            defaultValue={
                                cedtData.current?.dnsAndFiltering?.dnsServerSettings?.primaryDnsIP || '8.8.8.8'
                            }
                            onChange={updateFormValues}
                        />
                    </CustomTooltip>
                </Grid>
                <Grid item xs>
                    <CustomTooltip title={`Secondary DNS: ${cedtData.current?.dnsAndFiltering?.dnsServerSettings?.primaryDnsIP} (Default: 8.8.4.4)`}>
                        <TextField
                            id="dns2"
                            label="DNS2"
                            variant="outlined"
                            fullWidth={true}
                            defaultValue={
                                cedtData.current?.dnsAndFiltering?.dnsServerSettings?.primaryDnsIP || '8.8.4.4'
                            }
                            onChange={updateFormValues}
                        />
                    </CustomTooltip>
                </Grid>
            </Grid>
            <Grid container spacing={1} style={{ marginTop: '12px' }}>
                <Grid item xs>
                    <CustomTooltip title={`Service Transaction: ${serviceTransaction.current?.Service_Code__c} (${serviceTransaction.current?.Product_Name__c})`}>
                        <TextField
                            id="bwUp"
                            label="Bandwidth up (Mbps)"
                            type="number"
                            fullWidth={true}
                            InputLabelProps={{ shrink: true }}
                            defaultValue={
                                serviceTransaction.current?.Product_Name__c?.match(/\d+/)
                            }
                            onChange={updateFormValues}
                        />
                    </CustomTooltip>
                </Grid>
                <Grid item xs>
                    <CustomTooltip title={`Service Transaction: ${serviceTransaction.current?.Service_Code__c} (${serviceTransaction.current?.Product_Name__c})`}>
                        <TextField
                            id="bwDown"
                            label="Bandwidth down (Mbps)"
                            type="number"
                            fullWidth={true}
                            InputLabelProps={{ shrink: true }}
                            defaultValue={
                                serviceTransaction.current?.Product_Name__c?.match(/\d+/)
                            }
                            onChange={updateFormValues}
                        />
                    </CustomTooltip>
                </Grid>
            </Grid>
            {/* <Divider style={{ marginTop: '12px', marginBottom: '16px' }}>LAN-VLAN</Divider> */}
            <Divider style={{ marginTop: '12px', marginBottom: '16px' }}><Chip color="primary" label="LAN-VLAN" /></Divider>
            <Grid container spacing={1}>
                <Grid item xs>
                    <CustomTooltip title={`VLAN: ${cedtData.current?.equipment?.vlanId} (Default: 1)`}>
                        <TextField
                            id="vlan"
                            label="VLAN"
                            variant="outlined"
                            type="number"
                            fullWidth={true}
                            InputLabelProps={{ shrink: true }}
                            defaultValue={cedtData.current?.equipment?.vlanId || '1'}
                            onChange={updateFormValues}
                        />
                    </CustomTooltip>
                </Grid>
                <Grid item xs>
                    <CustomTooltip title={`Enable DHCP: ${cedtData.current?.equipment?.enableDhcp} (Default: Enabled)`}>
                        <Autocomplete
                            id="dhcp"
                            options={['Enabled', 'Disabled']}
                            renderInput={params => <TextField {...params} label='DHCP' />}
                            defaultValue={cedtData.current?.equipment?.enableDhcp == false ? 'Disabled' : 'Enabled'}
                            onChange={(e, value) => updateFormValues('dhcp', value)}
                        />
                    </CustomTooltip>
                </Grid>
            </Grid>
            <Grid container spacing={1} style={{ marginTop: '12px' }}>
                <Grid item xs>
                    <CustomTooltip title={'Equip Gateway Assigned IP: ' + cedtData.current?.equipment?.equipGatewayAssignedIp}>
                        <TextField
                            id="mxIp"
                            label="MX IP"
                            variant="outlined"
                            fullWidth={true}
                            defaultValue={
                                cedtData.current?.equipment?.equipGatewayAssignedIp
                            }
                            onChange={updateFormValues}
                        />
                    </CustomTooltip>
                </Grid>
                <Grid item xs>
                    <CustomTooltip title={'Subnet IP Addresses: ' + cedtData?.current?.equipment?.subnetIpAddresses}>
                        <TextField
                            id="lanSubnetIp"
                            label="Subnet (IP)"
                            variant="outlined"
                            fullWidth={true}
                            defaultValue={
                                cedtData.current?.equipment?.subnetIpAddresses
                            }
                            onChange={updateFormValues}
                        />
                    </CustomTooltip>
                </Grid>
            </Grid>
            {/* <Divider style={{ marginTop: '12px', marginBottom: '16px' }}>LAN - DHCP Server Settings</Divider> */}
            <Divider style={{ marginTop: '12px', marginBottom: '16px' }}><Chip color="primary" label="LAN - DHCP Server Settings" /></Divider>
            <Grid container spacing={1}>
                <Grid item xs>
                    <CustomTooltip title={'DHCP Settings Range: ' + cedtData?.current?.equipment?.dhcp?.settingsRange}>
                        <TextField
                            id="ipReservationRange"
                            label="IP Reservation Range"
                            variant="outlined"
                            fullWidth={true}
                            defaultValue={
                                cedtData?.current?.equipment?.dhcp?.settingsRange
                            }
                            onChange={updateFormValues}
                        />
                    </CustomTooltip>
                </Grid>
                <Grid item xs>
                    <CustomTooltip title={'Additional DNS IPs: ' + cedtData?.current?.dnsAndFiltering?.dnsServerSettings?.additionalDnsIPs}>
                        <TextField
                            id="additionalDnsIps"
                            label="Additional DNS IPs"
                            variant="outlined"
                            fullWidth={true}
                            defaultValue={
                                cedtData?.current?.dnsAndFiltering?.dnsServerSettings?.additionalDnsIPs || ''
                            }
                            onChange={updateFormValues}
                        />
                    </CustomTooltip>
                </Grid>
            </Grid>
            {/* <Divider style={{ marginTop: '12px', marginBottom: '16px' }}>Web Filter</Divider> */}
            <Divider style={{ marginTop: '12px', marginBottom: '16px' }}><Chip color="primary" label="Web Filter" /></Divider>
            <Grid container spacing={1}>
                <Grid item xs>
                    <CustomTooltip title={`Content Category Filtering: ${cedtData?.current?.dnsAndFiltering?.webFiltering?.filterCategories?.contentCategoryFiltering || '(blank)'}`}>
                        <Autocomplete
                            id={'contentCategoryFiltering'}
                            multiple={true}
                            fullWidth={true}
                            options={categoryBlocking}
                            defaultValue={cedtData?.current?.dnsAndFiltering?.webFiltering?.filterCategories?.contentCategoryFiltering}
                            renderInput={params => <TextField {...params} label='Content Category Blocking' />}
                            onChange={(e, value) => updateFormValues('contentCategoryFiltering', value)}
                        />
                    </CustomTooltip>
                </Grid>
            </Grid>
            <Grid container spacing={1} style={{ marginTop: '12px' }}>
                <Grid item xs>
                    <CustomTooltip title={`Threat Category Filtering: ${cedtData?.current?.dnsAndFiltering?.webFiltering?.filterCategories?.threatCategoryFiltering || '(blank)'}`}>
                        <Autocomplete
                            id={'threatCategoryFiltering'}
                            multiple={true}
                            fullWidth={true}
                            options={threatCategories}
                            defaultValue={cedtData?.current?.dnsAndFiltering?.webFiltering?.filterCategories?.threatCategoryFiltering}
                            renderInput={params => <TextField {...params} label='Threat Category Blocking' />}
                            onChange={(e, value) => updateFormValues('threatCategoryFiltering', value)}
                        />
                    </CustomTooltip>
                </Grid>
            </Grid>
            <Grid container spacing={1} style={{ marginTop: '12px' }}>
                <Grid item xs>
                    <CustomTooltip title={`Block Websites List: ${cedtData?.current?.dnsAndFiltering?.webFiltering?.blockWebsitesList || '(blank)'}`}>
                        <TextField
                            id="urlBlacklist"
                            label="Block Websites List"
                            variant="outlined"
                            fullWidth={true}
                            multiline
                            rows={4}
                            defaultValue={
                                cedtData?.current?.dnsAndFiltering?.webFiltering?.blockWebsitesList || ''
                            }
                            onChange={updateFormValues}
                        />
                    </CustomTooltip>
                </Grid>
                <Grid item xs>
                    <CustomTooltip title={`Allow Websites List: ${cedtData?.current?.dnsAndFiltering?.webFiltering?.allowWebsitesList || '(blank)'}`}>
                        <TextField
                            id="urlWhitelist"
                            label="Allow Websites List"
                            variant="outlined"
                            fullWidth={true}
                            multiline
                            rows={4}
                            defaultValue={
                                cedtData?.current?.dnsAndFiltering?.webFiltering?.allowWebsitesList || ''
                            }
                            onChange={updateFormValues}
                        />
                    </CustomTooltip>
                </Grid>
            </Grid>
            {
                cedtData?.current?.vpnSettings?.vpnTunnelSettings
                    .map((tunnelSettings, index) => (
                        <>
                            {/* <Divider style={{ marginTop: '12px' }}>Site-to-Site IPSEC {index + 1}</Divider> */}
                            <Divider style={{ marginTop: '12px' }}><Chip color="primary" label={`Site-to-Site IPSEC ${index + 1}`} /></Divider>
                            <Grid container spacing={1} style={{ marginTop: '12px' }}>
                                <Grid item xs>
                                    <TextField
                                        id={`ipsecNotes.${index}`}
                                        label="Notes"
                                        variant="outlined"
                                        fullWidth={true}
                                        multiline
                                        rows={4}
                                        disabled={true}
                                        defaultValue={
                                            tunnelSettings.infoAboutVpn || ''
                                        }
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} style={{ marginTop: '12px' }}>
                                <Grid item xs>
                                    <CustomTooltip title={`Tunnel Name: ${tunnelSettings.tunnelName}`}>
                                        <TextField
                                            id={`ipsecName.${index}`}
                                            label="Name"
                                            variant="outlined"
                                            fullWidth={true}
                                            defaultValue={tunnelSettings.tunnelName}
                                            onChange={updateFormValues}
                                        />
                                    </CustomTooltip>
                                </Grid>
                                <Grid item xs>
                                    <CustomTooltip title={`IKE Version: (default 1)`}>
                                        <Autocomplete
                                            id={`ipsecIkeVersion.${index}`}
                                            fullWidth={true}
                                            options={['1', '2']}
                                            defaultValue={'1'}
                                            renderInput={params => <TextField {...params} label='IKE Version' />}
                                            onChange={(e, value) => updateFormValues(`ipsecIkeVersion.${index}`, value)}
                                        />
                                    </CustomTooltip>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} style={{ marginTop: '12px' }}>
                                <Grid item xs>
                                    <CustomTooltip title={`See Notes: ${tunnelSettings.infoAboutVpn || '(blank)'}`}>
                                        <TextField
                                            id={`ipsecLocalId.${index}`}
                                            label="Local ID"
                                            variant="outlined"
                                            fullWidth={true}
                                            defaultValue={''}
                                            onChange={updateFormValues}
                                        />
                                    </CustomTooltip>
                                </Grid>
                                <Grid item xs>
                                    <CustomTooltip title={`Remote Peer IP: ${tunnelSettings.remotePeerIp}`}>
                                        <TextField
                                            id={`ipsecRemoteId.${index}`}
                                            label="Remote ID"
                                            variant="outlined"
                                            fullWidth={true}
                                            defaultValue={tunnelSettings.remotePeerIp}
                                            onChange={updateFormValues}
                                        />
                                    </CustomTooltip>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} style={{ marginTop: '12px' }}>
                                <Grid item xs>
                                    <CustomTooltip title={`PSK: ${tunnelSettings.preSharedKey}`}>
                                        <TextField
                                            id={`ipsecPsk.${index}`}
                                            label="PSK"
                                            variant="outlined"
                                            fullWidth={true}
                                            defaultValue={tunnelSettings.preSharedKey}
                                            onChange={updateFormValues}
                                        />
                                    </CustomTooltip>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} style={{ marginTop: '12px' }}>
                                <Grid item xs>
                                    <CustomTooltip title={`Destination Network: ${tunnelSettings.destNetwork}`}>
                                        <TextField
                                            id={`ipsecRemoteNetworks.${index}`}
                                            label="Remote Networks"
                                            variant="outlined"
                                            fullWidth={true}
                                            defaultValue={tunnelSettings.destNetwork}
                                            onChange={updateFormValues}
                                        />
                                    </CustomTooltip>
                                </Grid>
                                <Grid item xs>
                                    <TextField
                                        id={`ipsecRemoteGateway.${index}`}
                                        label="Remote Gateway"
                                        variant="outlined"
                                        fullWidth={true}
                                        onChange={updateFormValues}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} style={{ marginTop: '12px' }}>
                                <Grid item xs>
                                    <CustomTooltip title={`Phase 1 Encryption: ${tunnelSettings.p1Encryption} (default AES256)`}>
                                        <Autocomplete
                                            id={`ipsecP1Encryption.${index}`}
                                            fullWidth={true}
                                            options={['AES256', 'AES192', 'AES128', '3DES']}
                                            defaultValue={tunnelSettings.p1Encryption || 'AES256'}
                                            renderInput={params => <TextField {...params} label='Phase 1 Encryption' />}
                                            onChange={(e, value) => updateFormValues(`ipsecP1Encryption.${index}`, value)}
                                        />
                                    </CustomTooltip>
                                </Grid>
                                <Grid item xs>
                                    <CustomTooltip title={`Phase 1 Authentication: ${tunnelSettings.p1Auth} (default SHA256)`}>
                                        <Autocomplete
                                            id={`ipsecP1Auth.${index}`}
                                            fullWidth={true}
                                            options={['SHA256', 'SHA1', 'MD5']}
                                            defaultValue={tunnelSettings.p1Auth || 'SHA256'}
                                            renderInput={params => <TextField {...params} label='Phase 1 Authentication' />}
                                            onChange={(e, value) => updateFormValues(`ipsecP1Auth.${index}`, value)}
                                        />
                                    </CustomTooltip>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} style={{ marginTop: '12px' }}>
                                <Grid item xs>
                                    <CustomTooltip title={`Phase 1 DH Group: ${tunnelSettings.p1DiffieGroup} (default 14)`}>
                                        <Autocomplete
                                            id={`ipsecP1DhGroup.${index}`}
                                            fullWidth={true}
                                            options={['14', '5', '2', '1']}
                                            defaultValue={tunnelSettings.p1DiffieGroup || '14'}
                                            renderInput={params => <TextField {...params} label='Phase 1 DH Group' />}
                                            onChange={(e, value) => updateFormValues(`ipsecP1DhGroup.${index}`, value)}
                                        />
                                    </CustomTooltip>
                                </Grid>
                                <Grid item xs>
                                    <CustomTooltip title={`Phase 1 Lifetime: ${tunnelSettings.p1LifeTime} (default 28800)`}>
                                        <TextField
                                            id={`ipsecP1Lifetime.${index}`}
                                            label="Phase 1 Lifetime"
                                            variant="outlined"
                                            type="number"
                                            fullWidth={true}
                                            InputLabelProps={{ shrink: true }}
                                            defaultValue={tunnelSettings.p1Lifetime || '28800'}
                                            onChange={updateFormValues}
                                        />
                                    </CustomTooltip>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} style={{ marginTop: '12px' }}>
                                <Grid item xs>
                                    <CustomTooltip title={`Phase 2 Encryption: ${tunnelSettings.p2EncTransform} (default AES256, AES192, AES128, 3DES)`}>
                                        <Autocomplete
                                            id={`ipsecP2Encryption.${index}`}
                                            fullWidth={true}
                                            multiple={true}
                                            options={['AES256', 'AES192', 'AES128', '3DES']}
                                            defaultValue={tunnelSettings.p2EncTransform ? [tunnelSettings.p2EncTransform] : ['AES256', 'AES192', 'AES128', '3DES']}
                                            renderInput={params => <TextField {...params} label='Phase 2 Encryption' />}
                                            onChange={(e, value) => updateFormValues(`ipsecP2Encryption.${index}`, value)}
                                        />
                                    </CustomTooltip>
                                </Grid>
                                <Grid item xs>
                                    <CustomTooltip title={`Phase 2 Authentication: ${tunnelSettings.p2Auth} (default SHA1, MD5)`}>
                                        <Autocomplete
                                            id={`ipsecP2Auth.${index}`}
                                            fullWidth={true}
                                            multiple={true}
                                            options={['SHA256', 'SHA1', 'MD5']}
                                            defaultValue={tunnelSettings.p2Auth ? [tunnelSettings.p2Auth] : ['SHA1', 'MD5']}
                                            renderInput={params => <TextField {...params} label='Phase 2 Authentication' />}
                                            onChange={(e, value) => updateFormValues(`ipsecP2Auth.${index}`, value)}
                                        />
                                    </CustomTooltip>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} style={{ marginTop: '12px' }}>
                                <Grid item xs>
                                    <CustomTooltip title={`Phase 2 PFS: ${tunnelSettings.perfForwardSec} (default Off)`}>
                                        <Autocomplete
                                            id={`ipsecP2Pfs.${index}`}
                                            fullWidth={true}
                                            options={['Off', '14', '5', '2', '1']}
                                            defaultValue={tunnelSettings.perfForwardSec || 'Off'}
                                            renderInput={params => <TextField {...params} label='Phase 2 PFS' />}
                                            onChange={(e, value) => updateFormValues(`ipsecP2Pfs.${index}`, value)}
                                        />
                                    </CustomTooltip>
                                </Grid>
                                <Grid item xs>
                                    <CustomTooltip title={`Phase 2 Lifetime: ${tunnelSettings.p2LifeTime} (default 28800)`}>
                                        <TextField
                                            id={`ipsecP2Lifetime.${index}`}
                                            label="Phase 2 Lifetime"
                                            variant="outlined"
                                            type="number"
                                            fullWidth={true}
                                            InputLabelProps={{ shrink: true }}
                                            defaultValue={tunnelSettings.p2LifeTime || '28800'}
                                            onChange={updateFormValues}
                                        />
                                    </CustomTooltip>
                                </Grid>
                            </Grid>
                        </>
                    ))
            }
            {
                cedtData.current?.vpnClients?.vpnClientsConfig?.preconfigVpnClients?.vpnClientList.map((vpnClient, index) => (
                    <>
                        {/* <Divider style={{ marginTop: '12px' }}>Meraki Cloud Authentication {index + 1}</Divider> */}
                        <Divider style={{ marginTop: '12px' }}><Chip color="primary" label={`Meraki Cloud Authentication ${index + 1}`} /></Divider>
                        <Grid container spacing={1} style={{ marginTop: '12px' }}>
                            <Grid item xs>
                                <CustomTooltip title={`Email: ${vpnClient.email}`}>
                                    <TextField
                                        id={`merakiCloudAuthEmail.${index}`}
                                        label="Email"
                                        variant="outlined"
                                        fullWidth={true}
                                        defaultValue={vpnClient.email}
                                    />
                                </CustomTooltip>
                            </Grid>
                            <Grid item xs>
                                <CustomTooltip title={`Password: ${vpnClient.password}`}>
                                    <TextField
                                        id={`merakiCloudAuthPassword.${index}`}
                                        label="Password"
                                        variant="outlined"
                                        fullWidth={true}
                                        defaultValue={vpnClient.password}
                                    />
                                </CustomTooltip>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} style={{ marginTop: '12px' }}>
                            <Grid item xs>
                                <CustomTooltip title={`Description: ${vpnClient.description}`}>
                                    <TextField
                                        id={`merakiCloudAuthDescription.${index}`}
                                        label="Description"
                                        variant="outlined"
                                        fullWidth={true}
                                        defaultValue={vpnClient.description}
                                    />
                                </CustomTooltip>
                            </Grid>
                        </Grid>
                    </>
                ))
            }
            {
                cedtData.current?.vpnClients?.vpnClientsConfig?.activeDirectory?.adCredentials
                && (
                    <>
                        {/* <Divider style={{ marginTop: '12px' }}>LDAP (Active Directory)</Divider> */}
                        <Divider style={{ marginTop: '12px' }}><Chip color="primary" label="LDAP (Active Directory)" /></Divider>
                        <Grid container spacing={1} style={{ marginTop: '12px' }}>
                            <Grid item xs>
                                <CustomTooltip title={`Active Directory IP: ${cedtData.current?.vpnClients?.vpnClientsConfig?.activeDirectory?.adCredentials?.adServerIP || ''}`}>
                                    <TextField
                                        id="adIp"
                                        label="IP"
                                        variant="outlined"
                                        fullWidth={true}
                                        defaultValue={cedtData.current?.vpnClients?.vpnClientsConfig?.activeDirectory?.adCredentials?.adServerIP}
                                    />
                                </CustomTooltip>
                            </Grid>
                            <Grid item xs>
                                <CustomTooltip title={`Active Directory Domain: ${cedtData.current?.vpnClients?.vpnClientsConfig?.activeDirectory?.adCredentials?.adShortDomainName || ''}`}>
                                    <TextField
                                        id="adDomain"
                                        label="Domain"
                                        variant="outlined"
                                        fullWidth={true}
                                        defaultValue={cedtData.current?.vpnClients?.vpnClientsConfig?.activeDirectory?.adCredentials?.adShortDomainName}
                                    />
                                </CustomTooltip>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} style={{ marginTop: '12px' }}>
                            <Grid item xs>
                                <CustomTooltip title={`Active Directory Username: ${cedtData.current?.vpnClients?.vpnClientsConfig?.activeDirectory?.adCredentials?.adUsername || ''}`}>
                                    <TextField
                                        id="adUsername"
                                        label="Username"
                                        variant="outlined"
                                        fullWidth={true}
                                        defaultValue={cedtData.current?.vpnClients?.vpnClientsConfig?.activeDirectory?.adCredentials?.adUsername}
                                    />
                                </CustomTooltip>
                            </Grid>
                            <Grid item xs>
                                <CustomTooltip title={`Active Directory Password: ${cedtData.current?.vpnClients?.vpnClientsConfig?.activeDirectory?.adCredentials?.adPassword || ''}`}>
                                    <TextField
                                        id="adPassword"
                                        label="Password"
                                        variant="outlined"
                                        fullWidth={true}
                                        defaultValue={cedtData.current?.vpnClients?.vpnClientsConfig?.activeDirectory?.adCredentials?.adPassword}
                                    />
                                </CustomTooltip>
                            </Grid>
                        </Grid>
                    </>
                )
            }
        </>
    )
}

export default React.memo(FormMne)