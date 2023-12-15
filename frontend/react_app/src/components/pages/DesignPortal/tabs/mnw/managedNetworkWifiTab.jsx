import { CustomTable } from '../../../../common'

import { generateSections } from '../../generateForm'

import { nextHostnameSuffix } from '../../helpers'

import {
    TextField
} from '@mui/material'

import { validations } from '../../validation'

export default function managedNetworkWifiTab(data, formData, setFormData, userHasWriteAccess) {
    return {
        label: 'WiFi',
        secondaryTabs: [
            {
                label: 'WiFi Overview',
                content: generateSections([
                    {
                        label: 'WiFi Overview',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_device'
                                    url={'/api/design_portal/table/dp_device?filter=type=wifi,site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    pageSize={100}
                                    columns={[
                                        {
                                            field: 'hostname',
                                            headerName: 'Hostname',
                                            defaultValue: tableState => (data.eset.dp_site.clli || 'xxxxxxxx') + '-MR' + nextHostnameSuffix(tableState.data),
                                        },
                                        {
                                            field: 'model',
                                            headerName: 'Model',
                                            type: 'SELECT',
                                            // options: [
                                            //     "MR20",
                                            //     "MR30H",
                                            //     "MR33",
                                            //     "MR36",
                                            //     "MR36H",
                                            //     "MR42-E",
                                            //     "MR45-HW",
                                            //     "MR46",
                                            //     "MR46-E",
                                            //     "MR52/53-E",
                                            //     "MR56",
                                            //     "MR70",
                                            //     "MR74",
                                            //     "MR76",
                                            //     "MR84",
                                            //     "MR86",
                                            // ],
                                            options: [
                                                "MR30H",
                                                "MR36",
                                                "MR45",
                                                "MR74",
                                                "MR84",
                                                "MR33",
                                                "MR46",
                                                "MR76",
                                                "MR86"
                                            ]
                                        },
                                        {
                                            field: 'ip',
                                            headerName: 'IP',
                                            defaultValue: 'DHCP',
                                            validation: (value, formValues) => value.toLowerCase() == 'dhcp' || validations.ipv4_cidr(value),
                                        },
                                        // {
                                        //     field: 'subnet_mask',
                                        //     headerName: 'Subnet Mask',
                                        //     type: 'ENUM',
                                        //     options: subnetMasks,
                                        //     defaultValue: "255.255.255.0",
                                        //     validation: (value, formValues) => validations.subnet(value),
                                        // },
                                        {
                                            field: 'gateway',
                                            headerName: 'Gateway',
                                            allowNull: false,
                                            formControl: (values) => values?.ip?.toLowerCase() != 'dhcp' ? 'display' : 'hidden',
                                            validation: (value, formValues) => validations.ipv4(value),
                                        },
                                        {
                                            field: 'vlan',
                                            headerName: 'VLAN',
                                            defaultValue: '88',
                                            validation: (value, formValues) => validations.vlan_id(value),
                                        },
                                        {
                                            field: 'dns_1',
                                            headerName: 'DNS 1',
                                            defaultValue: '8.8.8.8',
                                            formControl: (values) => values?.ip !== 'DHCP' ? 'display' : 'hidden',
                                            validation: (value, formValues) => validations.ipv4(value),
                                        },
                                        {
                                            field: 'dns_2',
                                            headerName: 'DNS 2',
                                            defaultValue: '8.8.4.4',
                                            formControl: (values) => values?.ip !== 'DHCP' ? 'display' : 'hidden',
                                            validation: (value, formValues) => value == '' || validations.ipv4(value),
                                        }
                                    ]}
                                    onCreate={values => {
                                        return {
                                            ...values,
                                            site_id: data.eset.dp_site.id,
                                            type: 'wifi'
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
                                    key="mnw_overview_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, mnw_overview_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.mnw_overview_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            },
            {
                label: 'WiFi Settings',
                content: generateSections([
                    {
                        label: 'WiFi Settings',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_switch_settings'
                                    url={`/api/design_portal/table/dp_wifi_settings?filter=site_id=${data.eset.dp_site.id}`}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    columns={[
                                        {
                                            field: 'ssid',
                                            headerName: 'SSID',
                                            allowNull: false,
                                            validation: value => validations.length_range_requirement(value, 2, 32),
                                        },
                                        {
                                            field: 'status',
                                            headerName: 'Status',
                                            defaultValue: 'Enabled'
                                        },
                                        {
                                            field: 'hide_ssid',
                                            headerName: 'Hide SSID',
                                            defaultValue: 'Disabled'
                                        },
                                        {
                                            field: 'network_access',
                                            headerName: 'Network Access'
                                        },
                                        {
                                            field: 'wpa_encryption_mode',
                                            headerName: 'WPA Encryption Mode',
                                            defaultValue: 'WPA2',
                                            formControl: values =>  values.network_access != 'Open' ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'psk',
                                            headerName: 'PSK',
                                            allowNull: false,
                                            validation: value => validations.length_requirement(value, 8),
                                            formControl: values =>  values.network_access != 'Open' ? 'display' : 'hidden',
                                            // formControl: values => ['WPA2', 'WPA3'].includes(values.secuirty_mode) ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'addressing_mode',
                                            headerName: 'Addressing Mode',
                                            defaultValue: 'NAT Mode',
                                            onChange: (newValues, currentValues, handleChange, setValues) => {
                                                handleChange(newValues)
                                                setValues(old => ({...old, wireless_clients_blocked_from_lan: newValues == 'NAT Mode' }))
                                            }
                                        },
                                        {
                                            field: 'vlan_tagging',
                                            headerName: 'VLAN Tagging',
                                            defaultValue: 'Disabled',
                                            allowNull: false,
                                            formControl: values =>  values.addressing_mode == 'Bridged' ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'vlan',
                                            headerName: 'VLAN',
                                            defaultValue: '0',
                                            allowNull: false,
                                            formControl: values =>  values.addressing_mode == 'Bridged' && values.vlan_tagging == 'Enabled' ? 'display' : 'hidden'
                                        },
                                        // {
                                        //     field: 'wireless_clients_accessing_lan',
                                        //     headerName: 'Wireless Clients Accessing LAN',
                                        //     defaultValue: 'Allow'
                                        // },
                                        {
                                            field: 'wireless_clients_blocked_from_lan',
                                            headerName: 'Clients blocked from LAN',
                                            defaultValue: true,
                                            type: 'boolean'
                                        },
                                        {
                                            field: 'layer_2_isolation',
                                            headerName: 'Layer 2 Isolation',
                                            defaultValue: 'Disabled',
                                            allowNull: false,
                                            formControl: values =>  values.addressing_mode == 'Bridged' ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'tunneled_configuration_notes',
                                            headerName: 'Tunneled Configuration Notes',
                                            formControl: values =>  values.addressing_mode == 'Tunneled' ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'per_client_bw_limit_up',
                                            headerName: 'Per Client BW Limit Up (Kbps)'
                                        },
                                        {
                                            field: 'per_client_bw_limit_down',
                                            headerName: 'Per Client BW Limit Down (Kbps)'
                                        },
                                        {
                                            field: 'per_ssid_bw_limit_up',
                                            headerName: 'Per SSID BW Limit Up (Kbps)'
                                        },
                                        {
                                            field: 'per_ssid_bw_limit_down',
                                            headerName: 'Per SSID BW Limit Down (Kbps)'
                                        },
                                        {
                                            field: 'schedule',
                                            headerName: 'Schedule',
                                            defaultValue: 'Always available',
                                            allowNull: false
                                        },
                                        {
                                            field: 'comments',
                                            headerName: 'Comments'
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
                                    key="mnw_wifi_settings_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, mnw_wifi_settings_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.mnw_wifi_settings_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            }
        ]
    }
}
