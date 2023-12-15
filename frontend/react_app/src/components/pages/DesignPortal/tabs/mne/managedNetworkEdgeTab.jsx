 import { CustomTable } from '../../../../common'

import { TextField } from '@mui/material'

import { generateSections } from '../../generateForm'
import ManualConfigReqBanner from '../../customComponents/ManualConfigReqBanner'

import { subnetMasks, nextAlphanumericHostnameSuffix, wanInterfaces } from '../../helpers'
import { validations } from '../../validation'

const allVlansInstance = {id: 22, vlan_name: 'All VLANs', vlan: 0}

export default function managedNetworkEdgeTab(data, formData, setFormData, userHasWriteAccess) {

    return {
        label: 'Network',
        secondaryTabs: [
            {
                label: 'Network Overview',
                content: generateSections([
                    {
                        label: 'Network Overview',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='Network Devices'
                                    url={'/api/design_portal/table/dp_device?filter=type=network,site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    pageSize={100}
                                    columns={[
                                        {
                                            field: 'hostname',
                                            headerName: 'Hostname',
                                            // defaultValue: tableState => (data.eset.dp_site.clli || 'xxxxxxxx') + '-Mx' + nextHostnameSuffix(tableState.data),
                                            defaultValue: tableState => (data.eset.dp_site.clli || 'xxxxxxxx') + 'MN' + nextAlphanumericHostnameSuffix(tableState.data),
                                            width: 150
                                        },
                                        {
                                            field: 'model',
                                            headerName: 'Model',
                                            type: 'SELECT',
                                            // options: [
                                            //     'MX68',
                                            //     'MX85',
                                            //     'MX95',
                                            //     'MX105',
                                            //     'MX250',
                                            //     'MX450 - ICB',
                                            //     'vMX-S',
                                            //     'vMX-M',
                                            //     'vMX-L',
                                            //     'Z3',
                                            //     'Z3C'
                                            // ],
                                            options: [
                                                "MX68",
                                                "MX85",
                                                "MX95",
                                                "MX105",
                                                "MX250",
                                                "MX450"
                                            ],
                                            width: 100
                                        },
                                        {
                                            field: 'mne_high_availability',
                                            headerName: 'High Availability',
                                            width: 150
                                        },
                                        // {
                                        //     field: 'ip',
                                        //     headerName: 'IP'
                                        // },
                                        {
                                            field: 'mne_cid',
                                            headerName: 'Circuit',
                                            defaultValue: data.eset.dp_order.cid,
                                            // validation: (value, formValues) => validations.cidr(value),
                                            width: 200
                                        },
                                        {
                                            field: 'mne_features',
                                            headerName: 'Features',
                                            options: [
                                                'Site to Site VPN',
                                                'Remote VPN',
                                                'Auto VPN'
                                            ],
                                            commaDelineatedValues: true,
                                            flex: 1
                                        }
                                    ]}
                                    onCreate={values => {
                                        return {
                                            ...values,
                                            site_id: data.eset.dp_site.id,
                                            type: 'network'
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
                                    key="mne_network_overview_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, mne_network_overview_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.mne_network_overview_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            },
            {
                label: 'Interfaces',
                content: generateSections([
                    {
                        label: 'WAN',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='WAN'
                                    url={`/api/design_portal/table/dp_network_wan?filter=site_id=${data.eset.dp_site.id},dp_device.site_id=${data.eset.dp_site.id},dp_device_interface.site_id=${data.eset.dp_site.id},dp_device.type=network`}
                                    loadOptions={true}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    columns={[
                                        {
                                            field: 'dp_device.hostname',
                                            headerName: 'Device',
                                            association: {
                                                table: 'dp_device',
                                                display: 'hostname'
                                            },
                                            formControl: 'hidden',
                                            width: 150
                                        },
                                        {
                                            field: 'device_interface_id',
                                            headerName: 'Interface',
                                            association: {
                                                table: 'dp_device_interface',
                                                display: 'interface'
                                            },
                                            url: `/api/eset_db/dp_device_interface?include=dp_device&filter=site_id=${data.eset.dp_site.id},dp_device.type=network`,
                                            getOptionLabel: (option, metadata) => {
                                                const dp_device = 
                                                    option.dp_device
                                                        ? option.dp_device
                                                        : metadata.options.dp_device.find(deviceOption => deviceOption.id == option.device_id)

                                                return `${dp_device?.hostname}-${option.interface}`
                                            },
                                            renderOptions: options => options.filter(option => wanInterfaces[option.dp_device.model].includes(option.interface)),                                          
                                            width: 100
                                        },
                                        {
                                            field: 'type',
                                            headerName: 'Type',
                                            width: 100,
                                            defaultValue: 'Static',
                                            allowNull: false,
                                        },
                                        {
                                            field: 'description',
                                            headerName: 'Description',
                                            width: 150
                                        },
                                        {
                                            field: 'cid',
                                            headerName: 'Circuit',
                                            validation: (value) => value == '' || validations.circuit(value),
                                            width: 200
                                        },

                                        {
                                            field: 'ip',
                                            headerName: 'IP',
                                            allowNull: false,
                                            validation: (value, formValues, {data}) => {
                                                const uniqueCheck = validations.unique('ip', value, formValues, data)

                                                return uniqueCheck.error 
                                                    ? uniqueCheck
                                                    : validations.ipv4(value)
                                            },
                                            formControl: (values) => values.type == 'Static' ? 'display' : 'hidden',
                                            width: 150
                                        },
                                        {
                                            field: 'subnet',
                                            headerName: 'Subnet Mask',
                                            type: 'ENUM',
                                            options: subnetMasks,
                                            defaultValue: "255.255.255.248",
                                            formControl: (values) => values.type == 'Static' ? 'display' : 'hidden',
                                            width: 150
                                        },
                                        {
                                            field: 'gateway',
                                            headerName: 'Gateway',
                                            allowNull: false,
                                            validation: (value) => validations.ipv4(value),
                                            formControl: (values) => values.type == 'Static' ? 'display' : 'hidden',
                                            width: 150
                                        },
                                        {
                                            field: 'dns1',
                                            headerName: 'DNS1',
                                            defaultValue: '8.8.8.8',
                                            validation: (value) => validations.ipv4(value),
                                            formControl: (values) => values.type == 'Static' ? 'display' : 'hidden',
                                            width: 100
                                        },
                                        {
                                            field: 'dns2',
                                            headerName: 'DNS2',
                                            defaultValue: '8.8.4.4',
                                            validation: (value) => validations.ipv4(value),
                                            formControl: (values) => values.type == 'Static' ? 'display' : 'hidden',
                                            width: 100
                                        },
                                        {
                                            field: 'bw_up',
                                            headerName: 'Bandwidth Up (Mbps)',
                                            allowNull: false,
                                            width: 200
                                        },
                                        {
                                            field: 'bw_down',
                                            headerName: 'Bandwidth Down (Mbps)',
                                            allowNull: false,
                                            width: 200
                                        },
                                        {
                                            field: 'load_balancing',
                                            headerName: 'Load Balancing',
                                            width: 150
                                        }
                                    ]}
                                    onCreate={values => {
                                        return {
                                            ...values,
                                            site_id: data.eset.dp_site.id,
                                            device_id: values.dp_device_interface.device_id
                                        }
                                    }}
                                />
                            }
                        ]
                    },
                    {
                        label: 'LAN - VLAN',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_network_lan'
                                    url={`/api/design_portal/table/dp_network_lan_vlan?filter=site_id=${data.eset.dp_site.id}`}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    pageSize={100}
                                    columns={[
                                        {
                                            field: 'vlan_name',
                                            headerName: 'VLAN Name',
                                            validation: (value, formValues, {data}) => {
                                                const uniqueCheck = validations.unique('vlan_name', value, formValues, data)

                                                return uniqueCheck.error 
                                                    ? uniqueCheck
                                                    : validations.vlan_name(value)
                                            },
                                            width: 150
                                        },
                                        {
                                            field: 'vlan',
                                            headerName: 'VLAN',
                                            validation: (value, formValues, {data}) => {
                                                const uniqueCheck = validations.unique('vlan', value, formValues, data)

                                                return uniqueCheck.error 
                                                    ? uniqueCheck
                                                    : validations.vlan_id(value)
                                            },
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
                                            validation: (value, formValues, {data}) => {
                                                const uniqueCheck = validations.unique('ip', value, formValues, data)

                                                return uniqueCheck.error 
                                                    ? uniqueCheck
                                                    : validations.ipv4(value)
                                            },
                                            allowNull: false,
                                            width: 100
                                        },
                                        {
                                            field: 'subnet',
                                            headerName: 'Subnet',
                                            validation: (value, formValues, {data}) => {
                                                const uniqueCheck = validations.unique('subnet', value, formValues, data)

                                                return uniqueCheck.error 
                                                    ? uniqueCheck
                                                    : validations.ipv4_cidr(value)
                                            },
                                            allowNull: false,
                                            width: 150
                                        },
                                        {
                                            field: 'dhcp',
                                            headerName: 'DHCP',
                                            defaultValue: 'Enabled',
                                            width: 100
                                        },
                                        {
                                            field: 'dhcp_server',
                                            headerName: 'DHCP Server',
                                            validation: (value, formValues) => validations.ipv4_multiple(value),
                                            formControl: (values) => values.dhcp == 'Relay' ? 'display' : 'hidden',
                                            allowNull: false,
                                            type: 'TEXT',
                                            width: 100
                                        },
                                        // {
                                        //     field: 'domain_name',
                                        //     headerName: 'Domain Name',
                                        //     formControl: (values) => values.dhcp == 'Enabled' ? 'display' : 'hidden',
                                        //     type: 'TEXT',
                                        //     width: 150
                                        // },
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
                        label: 'LAN - DHCP Server Settings',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_network_lan_reservations'
                                    url={`/api/design_portal/table/dp_network_lan_reservations?filter=site_id=${data.eset.dp_site.id},dp_network_lan_vlan.site_id=${data.eset.dp_site.id}`}
                                    tableButtons={userHasWriteAccess ? 'cedfr' : 'f'}
                                    columns={[
                                        {
                                            field: 'vlan_id',
                                            headerName: 'VLAN Name',
                                            url: `/api/eset_db/dp_network_lan_vlan?filter=site_id=${data.eset.dp_site.id},dhcp!=Disabled`,
                                            association: {
                                                table: 'dp_network_lan_vlan',
                                                display: 'vlan_name'
                                            },
                                            // validation: (value, formValues) => validations.vlan_id(value),
                                            width: 150
                                        },
                                        {
                                            field: 'ip',
                                            headerName: 'IP Reservation Range',
                                            validation: (value, formValues, {data}) => {
                                                const uniqueCheck = validations.unique('ip', value, formValues, data)

                                                return uniqueCheck.error 
                                                    ? uniqueCheck
                                                    : validations.ipv4_range(value)
                                            },
                                            allowNull: false,
                                            width: 250
                                        },
                                        {
                                            field: 'description',
                                            headerName: 'Description',
                                            width: 200
                                        },
                                        {
                                            field: 'dns',
                                            headerName: 'DNS',
                                            defaultValue: 'Upstream Device',
                                            width: 200
                                        },
                                        {
                                            field: 'dns_servers',
                                            headerName: 'DNS Servers',
                                            validation: (value, formValues) => validations.ipv4_multiple(value),
                                            formControl: (values) => values.dns == 'Specify' ? 'display' : 'hidden',
                                            width: 200
                                        },
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
                        label: 'LAN - DHCP Settings',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_network_lan_dhcp_options'
                                    url={`/api/design_portal/table/dp_network_lan_dhcp_options?filter=site_id=${data.eset.dp_site.id},dp_network_lan_vlan.site_id=${data.eset.dp_site.id}`}
                                    tableButtons={userHasWriteAccess ? 'cedfr' : 'f'}
                                    columns={[
                                        {
                                            field: 'vlan_id',
                                            headerName: 'VLAN Name',
                                            url: `/api/eset_db/dp_network_lan_vlan?filter=site_id=${data.eset.dp_site.id},dhcp!=Disabled`,
                                            association: {
                                                table: 'dp_network_lan_vlan',
                                                display: 'vlan_name'
                                            },
                                            width: 150
                                        },
                                        {
                                            field: 'option',
                                            headerName: 'Option',
                                            defaultValue: 'Time offset',
                                        },
                                        {
                                            field: 'code',
                                            headerName: 'Code',
                                            defaultValue: '',
                                            formControl: (values) => values.option == 'Custom' ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'type',
                                            headerName: 'Type',
                                            options: [
                                                'Text',
                                                'IP',
                                                'Hex'
                                            ],
                                            defaultValue: 'Text',
                                            formControl: (values) => values.option == 'Custom' ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'value',
                                            headerName: 'Value',
                                            validation: (value, formValues) => formValues.type == 'IP' ? validations.ipv4(value) : {}
                                        }
                                    ]}
                                    onCreate={values => {
                                        return {
                                            ...values,
                                            site_id: data.eset.dp_site.id,
                                            code: {
                                                'Time offset': 2,
                                                'Interface MTU': 26,
                                                'NTP server': 42,
                                                'TFTP server name': 66,
                                                'Custom': values.code
                                            }[values.option],
                                            type: {
                                                'Time offset': 'Integer',
                                                'Interface MTU': 'Integer',
                                                'NTP server': 'IP',
                                                'TFTP server name': 'Text',
                                                'Custom': values.type
                                            }[values.option],
                                        }
                                    }}
                                    onEdit={values => {
                                        return {
                                            ...values,
                                            code: {
                                                'Time offset': 2,
                                                'Interface MTU': 26,
                                                'NTP server': 42,
                                                'TFTP server name': 66,
                                                'Custom': values.code
                                            }[values.option],
                                            type: {
                                                'Time offset': 'Integer',
                                                'Interface MTU': 'Integer',
                                                'NTP server': 'IP',
                                                'TFTP server name': 'Text',
                                                'Custom': values.type
                                            }[values.option],
                                        }
                                    }}
                                />
                            }
                        ]
                    },
                    {
                        label: 'LAN - DHCP MAC Reservations',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_network_mac_reservations'
                                    url={`/api/design_portal/table/dp_network_mac_reservations?filter=site_id=${data.eset.dp_site.id},dp_network_lan_vlan.site_id=${data.eset.dp_site.id}`}
                                    tableButtons={userHasWriteAccess ? 'cedfr' : 'f'}
                                    columns={[
                                        {
                                            field: 'vlan_id',
                                            headerName: 'VLAN Name',
                                            url: `/api/eset_db/dp_network_lan_vlan?filter=site_id=${data.eset.dp_site.id},dhcp!=Disabled`,
                                            association: {
                                                table: 'dp_network_lan_vlan',
                                                display: 'vlan_name'
                                            },
                                            // validation: (value, formValues) => validations.vlan_id(value),
                                            width: 150
                                        },
                                        {
                                            field: 'ip',
                                            headerName: 'IP',
                                            validation: (value, formValues, {data}) => {
                                                const uniqueCheck = validations.unique('ip', value, formValues, data)

                                                return uniqueCheck.error 
                                                    ? uniqueCheck
                                                    : validations.ipv4(value)
                                            },
                                            allowNull: false,
                                            width: 250
                                        },
                                        {
                                            field: 'mac',
                                            headerName: 'MAC',
                                            validation: (value, formValues, {data}) => {
                                                const uniqueCheck = validations.unique('mac', value, formValues, data)

                                                return uniqueCheck.error 
                                                    ? uniqueCheck
                                                    : validations.mac(value)
                                            },
                                        },
                                        {
                                            field: 'description',
                                            headerName: 'Description'
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
                        label: 'LAN - PORTS',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_network_lan_ports'
                                    include='dp_device,dp_device_interface,dp_network_lan_vlan'
                                    loadOptions={true}
                                    url={`/api/design_portal/table/dp_network_lan_ports?filter=site_id=${data.eset.dp_site.id},dp_device.site_id=${data.eset.dp_site.id},dp_device_interface.site_id=${data.eset.dp_site.id},dp_network_lan_vlan.site_id=${data.eset.dp_site.id},dp_device.type=network`}
                                    tableButtons={userHasWriteAccess ? 'cedfr' : 'f'}
                                    columns={[
                                        {
                                            headerName: 'Device',
                                            association: {
                                                table: 'dp_device',
                                                display: 'hostname'
                                            },
                                            formControl: 'hidden',
                                            readOnly: true,
                                            width: 150
                                        },
                                        {
                                            field: 'device_interface_id',
                                            headerName: 'Interface',
                                            association: {
                                                table: 'dp_device_interface',
                                                display: 'interface'
                                            },
                                            url: `/api/eset_db/dp_device_interface?include=dp_device&filter=site_id=${data.eset.dp_site.id},dp_device.type=network`,
                                            getOptionLabel: (option, metadata) => {
                                                const dp_device = 
                                                    option.dp_device
                                                        ? option.dp_device
                                                        : metadata.options.dp_device.find(deviceOption => deviceOption.id == option.device_id)

                                                return `${dp_device?.hostname}-${option.interface}`
                                            },
                                            renderOptions: options => options.filter(option => !wanInterfaces[option.dp_device.model].includes(option.interface)),
                                            width: 100,
                                        },
                                        {
                                            field: 'enabled',
                                            headerName: 'Enabled',
                                            defaultValue: 'Enabled',
                                            width: 100
                                        },
                                        {
                                            field: 'type',
                                            headerName: 'Type',
                                            defaultValue: 'Trunk',
                                            width: 75,
                                        },
                                        {
                                            field: 'native_vlan_id',
                                            headerName: 'VLAN',
                                            association: {
                                                table: 'dp_network_lan_vlan as native_vlan',
                                                display: 'vlan_name'
                                            },
                                            url: `/api/eset_db/dp_network_lan_vlan?filter=site_id=${data.eset.dp_site.id}`,
                                            getOptionLabel: option => 
                                                option.vlan_name
                                                    ? option.vlan_name + (option.vlan ? ` (${option.vlan})` : '')
                                                    : '',
                                            renderCell: ({ row }) => 
                                                row.native_vlan 
                                                    ? row.type == 'Trunk'
                                                        ? 'Native: ' + row.native_vlan.vlan_name + (row.native_vlan.vlan ? ` (${row.native_vlan.vlan})` : '') 
                                                        : row.native_vlan.vlan_name + (row.native_vlan.vlan ? ` (${row.native_vlan.vlan})` : '') 
                                                    : '',
                                            // formControl: (values) => values.type == 'Trunk' ? 'display' : 'hidden',
                                            width: 150
                                        },
                                        {
                                            headerName: 'Allowed VLANs',
                                            association: {
                                                table: 'dp_network_lan_vlan as allowed_vlans',
                                                display: 'vlan_name',
                                                through: {
                                                    table: 'dp_network_lan_vlan_ports_associations',
                                                    localKey: 'port_id',
                                                    remoteKey: 'vlan_id'
                                                }
                                            },
                                            url: `/api/eset_db/dp_network_lan_vlan?filter=site_id=${data.eset.dp_site.id}`,
                                            initialOptions: [allVlansInstance],
                                            // defaultValue: [{id: 22, vlan_name: 'All VLANs', vlan: 0}],
                                            getOptionLabel: option => 
                                                !option.vlan_name
                                                    ? ''
                                                    : option.id == allVlansInstance.id
                                                        ? option.vlan_name
                                                        : option.vlan_name + (option.vlan ? ` (${option.vlan})` : ''),
                                            renderCell: ({ row }) => 
                                                row.allowed_vlans 
                                                    ? row.allowed_vlans.map(item => item.vlan_name + (item.vlan ? ` (${item.vlan})` : '') ).join(', ')
                                                    : '',
                                            formControl: (values) => values.type == 'Trunk' ? 'display' : 'hidden',
                                            onChange: (value, values, handleChange, setValues, updateDropdownValue) => {
                                                const allVlansSelected = value.filter(v => v.id == allVlansInstance.id).length > 0
                                                updateDropdownValue(allVlansSelected ? [allVlansInstance] : value)
                                                
                                                handleChange(allVlansSelected ? [allVlansInstance] : value)
                                            },
                                            flex: 1
                                        },
                                    ]}
                                    onCreate={values => {
                                        return {
                                            ...values,
                                            site_id: data.eset.dp_site.id,
                                            device_id: values.dp_device_interface.device_id
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
                                    key="mne_interfaces_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, mne_interfaces_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.mne_interfaces_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            },
            {
                label: 'Routing',
                content: generateSections([
                    {
                        label: 'Static Routes',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='static_routes'
                                    url={'/api/design_portal/table/dp_network_static_route?filter=site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    columns={[
                                        {
                                            field: 'name',
                                            headerName: 'Name'
                                        },
                                        {
                                            field: 'subnet',
                                            headerName: 'Subnet',
                                            validation: (value, formValues) => validations.ipv4_cidr(value)
                                        },
                                        {
                                            field: 'next_hop_ip',
                                            headerName: 'Next Hop IP',
                                            validation: (value, formValues) => validations.ipv4(value)
                                        },
                                        {
                                            field: 'host_ip_to_ping',
                                            headerName: 'Host IP to Ping',
                                            allowNull: false,
                                            validation: (value, formValues) => validations.ipv4(value),
                                            formControl: (values) => values.state == 'While host responds to ping' ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'vpn',
                                            headerName: 'VPN',
                                            //defaultValue: true
                                        },
                                        {
                                            field: 'state',
                                            headerName: 'State',
                                            defaultValue: 'Always'
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
                        label: 'Source Based Routes',
                        fields: [
                            {
                                sm: 12,
                                content: <ManualConfigReqBanner />
                            },
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='source_based_routes'
                                    url={'/api/design_portal/table/dp_network_source_route?filter=site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    columns={[
                                        {
                                            field: 'name',
                                            headerName: 'Name'
                                        },
                                        // {
                                        //     field: 'sources',
                                        //     headerName: 'Source VLANs',
                                        //     validation: (value, formValues) => validations.ipv4_range(value)
                                        // },
                                        {
                                            headerName: 'Source VLANs',
                                            association: {
                                                table: 'dp_network_lan_vlan as source_vlans',
                                                display: 'vlan_name',
                                                through: {
                                                    table: 'dp_network_lan_vlan_source_route_associations',
                                                    localKey: 'source_route_id',
                                                    remoteKey: 'vlan_id'
                                                }
                                            },
                                            url: `/api/eset_db/dp_network_lan_vlan?filter=site_id=${data.eset.dp_site.id}`,
                                            initialOptions: [{id: 22, vlan_name: 'All VLANs', vlan: 0}],
                                            getOptionLabel: option => 
                                                !option.vlan_name
                                                    ? ''
                                                    : option.id == 22
                                                        ? option.vlan_name
                                                        : option.vlan_name + (option.vlan ? ` (${option.vlan})` : ''),
                                            renderCell: ({ row }) => 
                                                row.source_vlans 
                                                    ? row.source_vlans.map(item => item.vlan_name + (item.vlan ? ` (${item.vlan})` : '') ).join(', ')
                                                    : '',
                                            flex: 1
                                        },
                                        {
                                            field: 'next_hop_ip',
                                            headerName: 'Next Hop IP',
                                            validation: (value, formValues) => validations.ipv4(value)
                                        },
                                        {
                                            field: 'state',
                                            headerName: 'State',
                                            defaultValue: 'Always'
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
                                    key="mne_routing_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, mne_routing_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.mne_routing_comments}
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
