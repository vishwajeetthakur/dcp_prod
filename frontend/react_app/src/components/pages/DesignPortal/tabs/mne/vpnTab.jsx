import { CustomTable, SearchDropdown } from '../../../../common'

import { 
    TextField,
    Autocomplete,
    FormControlLabel,
    Checkbox
} from '@mui/material'

import { generateSections } from '../../generateForm'
import ManualConfigReqBanner from '../../customComponents/ManualConfigReqBanner'

import { validations } from '../../validation'

export default function vpnTab(data, formData, setFormData, userHasWriteAccess) {

    return {
        label: 'VPN',
        secondaryTabs: [
            {
                label: 'IPSEC',
                content: generateSections([
                    {
                        label: 'Site-to-Site IPSEC',
                        fields: [
                            {
                                sm: 12,
                                content: <ManualConfigReqBanner />
                            },
                            {
                                sm: 12,
                                content: <CustomTable
                                key='dp_vpn_site_to_site_ipsec'
                                url={'/api/design_portal/table/dp_vpn_site_to_site_ipsec?filter=site_id=' + data.eset.dp_site.id}
                                tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                columns={[
                                    {
                                        field: 'name',
                                        headerName: 'Name'
                                    },
                                    {
                                        field: 'ike_version',
                                        headerName: 'IKE Version',
                                        defaultValue: '1'
                                    },
                                    {
                                        field: 'remote_gateway',
                                        headerName: 'Remote Gateway',
                                        validation: (value, formValues) => validations.ipv4(value)
                                    },
                                    {
                                        field: 'local_id',
                                        headerName: 'Local ID',
                                        formControl: (values) => values?.ike_version == 2 ? 'display' : 'hidden',
                                    },
                                    {
                                        field: 'remote_id',
                                        headerName: 'Remote ID'
                                    },
                                    {
                                        field: 'psk',
                                        headerName: 'PSK'
                                    },
                                    {
                                        field: 'remote_networks',
                                        headerName: 'Remote Networks',
                                        validation: (value, formValues) => validations.ipv4_cidr_multiple(value)
                                    },
                                    {
                                        field: 'phase_one_encryption',
                                        headerName: 'Phase One Encryption',
                                        defaultValue: 'AES256'
                                    },
                                    {
                                        field: 'phase_one_authentication',
                                        headerName: 'Phase One Authentication',
                                        defaultValue: 'SHA256'
                                    },
                                    {
                                        field: 'phase_one_dh_group',
                                        headerName: 'Phase One DH Group',
                                        defaultValue: '14'
                                    },
                                    {
                                        field: 'phase_one_lifetime',
                                        headerName: 'Phase One Lifetime',
                                        defaultValue: '28800'
                                    },
                                    {
                                        field: 'phase_two_encryption',
                                        headerName: 'Phase Two Encryption',
                                        options: [
                                            "3DES",
                                            "AES128",
                                            "AES192",
                                            "AES256"
                                        ],
                                        commaDelineatedValues: true,
                                        defaultValue: '3DES, AES128, AES192, AES256'
                                    },
                                    {
                                        field: 'phase_two_authentication',
                                        headerName: 'Phase Two Authentication',
                                        options: [
                                            "MD5",
                                            "SHA1",
                                            "SHA256"
                                        ],
                                        commaDelineatedValues: true,
                                        defaultValue: 'MD5, SHA1'
                                    },
                                    {
                                        field: 'phase_two_pfs',
                                        headerName: 'Phase Two PFS',
                                        defaultValue: 'Off'
                                    },
                                    {
                                        field: 'phase_two_lifetime',
                                        headerName: 'Phase Two Lifetime',
                                        defaultValue: '28800'
                                    }
                                ]}
                                onCreate={values => {
                                    return {
                                        ...values,
                                        site_id: data.eset.dp_site.id
                                    }
                                }}
                            />
                            }
                        ]
                    },
                    {
                        label: 'Comments',
                        fields: [
                            {
                                sm: 12,
                                content: <TextField
                                    key="vpn_ipsec_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, vpn_ipsec_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.vpn_ipsec_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            },
            {
                label: 'Auto VPN',
                content: generateSections([
                    {
                        label: 'Auto VPN',
                        fields: [
                            {
                                sm: 12,
                                content: <ManualConfigReqBanner />
                            },
                            {
                                sm: 4,
                                content: <Autocomplete
                                    key="vpn_auto_vpn_type"
                                    options={[
                                        'Off',
                                        'Hub',
                                        'Spoke'
                                    ]}
                                    getOptionLabel={option => option}
                                    value={formData.vpn_auto_vpn_type}
                                    onChange={(event, value) => {
                                        setFormData(old => ({ 
                                            ...old,
                                            vpn_auto_vpn_type: value,
                                            vpn_auto_vpn_default_route: value == 'Off' ? false : old.vpn_auto_vpn_default_route,
                                            vpn_auto_vpn_hub_sites: value != 'Spoke' ? null : old.vpn_auto_vpn_hub_sites
                                        }))
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='VPN Type'
                                            error={!formData.vpn_auto_vpn_type}
                                        />
                                    )}
                                    fullWidth
                                    disabled={!userHasWriteAccess}
                                />
                            },
                            {
                                sm: 4,
                                content: <FormControlLabel
                                    key="vpn_auto_vpn_active_to_active_auto_vpn"
                                    label='Active-Active Auto VPN'
                                    control={
                                        <Checkbox 
                                            checked={formData.vpn_auto_vpn_active_to_active_auto_vpn} 
                                            onChange={event => setFormData((old) => ({ ...old, vpn_auto_vpn_active_to_active_auto_vpn: event.target.checked }))}
                                        />
                                    }
                                    aria-label="checkbox"
                                    disabled={!userHasWriteAccess}
                                />
                            },
                            formData.vpn_auto_vpn_type == 'Off'
                                ? {}
                                : {
                                    sm: 4,
                                    content: <FormControlLabel
                                        key="vpn_auto_vpn_default_route"
                                        label='Default Route'
                                        control={
                                            <Checkbox 
                                                checked={formData.vpn_auto_vpn_default_route} 
                                                onChange={event => setFormData(old => ({ ...old, vpn_auto_vpn_default_route: event.target.checked }))}
                                            />
                                        }
                                        aria-label="checkbox"
                                        disabled={!userHasWriteAccess}
                                    />
                                },
                            formData.vpn_auto_vpn_type != 'Spoke'
                                ? {}
                                : {
                                    sm: 12,
                                    content: <SearchDropdown
                                        disabled={!userHasWriteAccess}
                                        label={'HUB Sites (Priority Order)'}
                                        url={`/api/eset_db/dp_site?include=dp_site_detail&columns=dp_site.id,dp_site.display_address&filter=dp_site_detail.vpn_auto_vpn_type=HUB,dp_site.account_id=${data.eset.dp_site.account_id},dp_site.display_address~{query}`}
                                        getOptionLabel={option => option.display_address}
                                        multiple={true}
                                        onChange={(value, updateDropdownValue) => {
                                            value = value.slice(0, 4) // Limit to 4 selections

                                            updateDropdownValue(value)
                                            setFormData(old => ({ ...old, vpn_auto_vpn_hub_sites: value }))
                                        } }
                                        value={formData.vpn_auto_vpn_hub_sites}
                                        error={false}
                                    /> 
                                }
                            
                        ]
                    }, 
                    {
                        label: 'VLANs (VPN Enabled)',
                        fields: [
                            {
                                sm: 12,
                                content: <ManualConfigReqBanner />
                            },
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_network_lan'
                                    url={`/api/design_portal/table/dp_network_lan_vlan?filter=vpn_mode=Enabled,site_id=${data.eset.dp_site.id}`}
                                    tableButtons='f'
                                    columns={[
                                        {
                                            field: 'vlan_name',
                                            headerName: 'VLAN Name',
                                            width: 150
                                        },
                                        {
                                            field: 'vlan',
                                            headerName: 'VLAN',
                                            width: 75
                                        },
                                        {
                                            field: 'vpn_mode',
                                            headerName: 'VPN Mode',
                                            defaultValue: 'Enabled',
                                            width: 100
                                        },
                                        {
                                            field: 'ip',
                                            headerName: 'MX IP',
                                            width: 100
                                        },
                                        {
                                            field: 'subnet',
                                            headerName: 'Subnet',
                                            width: 150
                                        },
                                        {
                                            field: 'dhcp',
                                            headerName: 'DHCP',
                                            width: 100
                                        },
                                        {
                                            field: 'dhcp_server',
                                            headerName: 'DHCP Server',
                                            width: 100
                                        },
                                        {
                                            field: 'domain_name',
                                            headerName: 'Domain Name',
                                            width: 150
                                        },
                                    ]}
                                />
                            }
                        ]
                    },
                    {
                        label: 'Comments',
                        fields: [
                            {
                                sm: 12,
                                content: <TextField
                                    key="vpn_auto_vpn_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, vpn_auto_vpn_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.vpn_auto_vpn_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            },
            {
                label: 'Client VPN',
                content: generateSections([
                    {
                        label: 'Client VPN',
                        fields: [
                            {
                                sm: 12,
                                content: <ManualConfigReqBanner />
                            },
                            {
                                sm: 6,
                                content: <TextField
                                    key="vpn_client_vpn_subnet"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, vpn_client_vpn_subnet: event.target.value }))}
                                    label='Subnet'
                                    defaultValue={formData.vpn_client_vpn_subnet}
                                    disabled={!userHasWriteAccess}
                                    error={
                                        formData?.vpn_client_vpn_subnet
                                            && formData?.vpn_client_vpn_subnet !== '' 
                                            && validations.ipv4_cidr(formData?.vpn_client_vpn_subnet).error
                                    }
                                    helperText={
                                        !formData.vpn_client_vpn_subnet
                                            ? false 
                                            : validations.ipv4_cidr(formData.vpn_client_vpn_subnet).error 
                                                ? validations.ipv4_cidr(formData.vpn_client_vpn_subnet).helperText 
                                                : false
                                    }
                                />,
                                validation: (value) => validations.ipv4_cidr(value)
                            },
                            {
                                sm: 6,
                                content: <Autocomplete
                                    key="vpn_client_vpn_dns_server"
                                    options={[
                                        'Google',
                                        'Umbrella',
                                        'Specify'
                                    ]}
                                    getOptionLabel={option => option}
                                    value={formData.vpn_client_vpn_dns_server}
                                    onChange={(event, values) => setFormData((old) => ({ 
                                        ...old, 
                                        vpn_client_vpn_dns_server: values,
                                        vpn_client_vpn_custom_dns_servers: ''
                                    }))}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='DNS Server'
                                            error={!formData.vpn_client_vpn_dns_server}
                                        />
                                    )}
                                    fullWidth
                                    disabled={!userHasWriteAccess}
                                />
                            },
                            {
                                sm: 12,
                                content: <TextField
                                    key="vpn_client_vpn_custom_dns_servers"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, vpn_client_vpn_custom_dns_servers: event.target.value }))}
                                    label='Custom DNS Servers'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.vpn_client_vpn_custom_dns_servers}
                                    value={formData.vpn_client_vpn_custom_dns_servers}
                                    disabled={!userHasWriteAccess || formData.vpn_client_vpn_dns_server != 'Specify'}
                                    error={formData.vpn_client_vpn_dns_server == 'Specify' && !formData.vpn_client_vpn_custom_dns_servers}
                                />,
                                validation: (value, formValues) => validations.ipv4_multiple(value),
                                formControl: (values) => values.vpn_client_vpn_dns_server === 'Specify' ? 'display' : 'hidden',
                            },
                            {
                                sm: 6,
                                content: <TextField
                                        key="vpn_client_vpn_psk"
                                        autoComplete="off"
                                        onChange={(event) => setFormData((old) => ({ ...old, vpn_client_vpn_psk: event.target.value }))}
                                        label='PSK'
                                        defaultValue={formData.vpn_client_vpn_psk}
                                        disabled={!userHasWriteAccess}
                                        error={!formData.vpn_client_vpn_psk}
                                        helperText={!formData.vpn_client_vpn_psk ? "This field is required." : false}
                                    />
                            },
                            {
                                sm: 6,
                                content: <Autocomplete
                                    key="vpn_client_vpn_authentication"
                                    options={[
                                        'Meraki Cloud Authentication',
                                        'Radius',
                                        'Active Directory'
                                    ]}
                                    getOptionLabel={option => option}
                                    value={formData.vpn_client_vpn_authentication}
                                    onChange={(event, values) => setFormData((old) => ({ ...old, vpn_client_vpn_authentication: values }))}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='VPN Authentication'
                                            error={!formData.vpn_client_vpn_authentication}
                                        />
                                    )}
                                    fullWidth
                                    disabled={!userHasWriteAccess}
                                />
                            },
                        ]
                    },
                    {
                        label: 'Comments',
                        fields: [
                            {
                                sm: 12,
                                content: <TextField
                                    key="mne_client_vpn_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, mne_client_vpn_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.mne_client_vpn_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            },
        ]
    }
}