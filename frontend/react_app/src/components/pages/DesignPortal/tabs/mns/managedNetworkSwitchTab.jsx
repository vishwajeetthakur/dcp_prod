import { CustomTable } from '../../../../common'

import { TextField } from '@mui/material'

import { generateSections } from '../../generateForm'

import { SearchDropdown } from '../../../../common'

import { validations } from '../../validation'

import { nextHostnameSuffix } from '../../helpers'

export default function managedNetworkSwitchTab(data, formData, setFormData, userHasWriteAccess) {
    return {
        label: 'Switch',
        secondaryTabs: [
            {
                label: 'Switch Overview',
                content: generateSections([
                    {
                        label: 'Switch Overview',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_device'
                                    url={'/api/design_portal/table/dp_device?filter=type=switch,site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    pageSize={100}
                                    columns={[
                                        {
                                            field: 'hostname',
                                            headerName: 'Hostname',
                                            defaultValue: tableState => (data.eset.dp_site.clli || 'xxxxxxxx') + '-MS' + nextHostnameSuffix(tableState.data),
                                        },
                                        {
                                            field: 'model',
                                            headerName: 'Model',
                                            type: 'SELECT',
                                            // options: [
                                            //     "MS120-8",
                                            //     "MS120-8FP",
                                            //     "MS120-24P",
                                            //     "MS125-48LP",
                                            //     "MS210-24P",
                                            //     "MS210-48P",
                                            //     "MS225-24P",
                                            //     "MS225-48P",
                                            //     "MS250-24P",
                                            //     "MS250-48P",
                                            //     "MS350-48",
                                            //     "MS350-24X",
                                            //     "MS410-16",
                                            //     "MS425-16",
                                            //     "MS425-32",
                                            //     "MS120-8LP-HW",
                                            //     "MS120-8FP-HW",
                                            //     "MS120-24-HW",
                                            //     "MS120-24P-HW",
                                            //     "MS120-48-HW",
                                            //     "MS120-48LP-HW",
                                            //     "MS125 24 HW",
                                            //     "MS125-48-HW",
                                            //     "MS125-48LP-HW",
                                            //     "MS125-48FP-HW",
                                            //     "MS210-24-HW",
                                            //     "MS210-24P-HW",
                                            //     "MS210-48FP-HW",
                                            //     "MS210-48-HW",
                                            //     "MS210-48LP-HW",
                                            //     "MS225-24-HW",
                                            //     "MS225-24P-HW",
                                            //     "MS225-48FP-HW",
                                            //     "MS225-48-HW",
                                            //     "MS225-48LP-HW",
                                            //     "MS250-24-HW",
                                            //     "MS250-24P-HW",
                                            //     "MS250-48FP-HW",
                                            //     "MS250-48-HW",
                                            //     "MS250-48LP-HW",
                                            //     "MS350-24-HW",
                                            //     "MS350-24P-HW",
                                            //     "MS350-24X-HW",
                                            //     "MS350-48FP-HW",
                                            //     "MS350-48-HW",
                                            //     "MS355-24X2-HW",
                                            //     "MS355-24X-HW",
                                            //     "MS355-48X2-HW",
                                            //     "MS355-48X-HW",
                                            //     "MS390-24-HW",
                                            //     "MS390-24P-HW",
                                            //     "MS390-24U-HW",
                                            //     "MS390-24UX-HW",
                                            //     "MS390-48-HW",
                                            //     "MS390-48P-HW",
                                            //     "MS390-48U-HW",
                                            //     "MS390-48UX-HW",
                                            //     "MS390-48UX2-HW",
                                            //     "MS410-16-HW", 
                                            //     "MS425-16-HW", 
                                            //     "MS425-32-HW", 
                                            //     "MS450-12-HW",
                                            // ],
                                            options: [
                                                "MS210-24P-HW",
                                                "MS210-48FP-HW",
                                                "MS225-24P-HW",
                                                "MS225-48FP-HW",
                                                "MS250-24P-HW",
                                                "MS250-48FP-HW",
                                                "MS350-24X-HW",
                                                "MS350-48X-HW",
                                                "MS425-16-HW",
                                                "MS425-32-HW",
                                                "MS120-8",
                                                "MS120-8FP",
                                                "MS120-24P",
                                                "MS125-48LP",
                                                "MS410-16"
                                            ]
                                        },
                                        {
                                            field: 'mns_description',
                                            headerName: 'Description'
                                        }
                                    ]}
                                    onCreate={values => {
                                        return {
                                            ...values,
                                            site_id: data.eset.dp_site.id,
                                            type: 'switch'
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
                                    key="mns_switch_overview_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, mns_switch_overview_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.mns_switch_overview_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            },
            {
                label: 'Settings',
                content: generateSections([
                    {
                        label: 'Switch Settings',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_switch_settings'
                                    url={`/api/design_portal/table/dp_switch_settings?filter=site_id=${data.eset.dp_site.id},dp_device.site_id=${data.eset.dp_site.id},dp_device.type=switch`}
                                    tableButtons={userHasWriteAccess ? 'ef' : 'f'}
                                    columns={[
                                        {
                                            field: 'dp_device.hostname',
                                            headerName: 'Device',
                                            url: `/api/eset_db/dp_device?filter=site_id=${data.eset.dp_site.id},dp_device.type=switch`,
                                            association: {
                                                table: 'dp_device',
                                                display: 'hostname'
                                            },
                                            formControl: 'disabled'
                                        },
                                        {
                                            field: 'mgmt_ip_type',
                                            headerName: 'Management IP Type',
                                            defaultValue: 'DHCP'
                                        },
                                        {
                                            field: 'mgmt_vlan',
                                            headerName: 'Management VLAN',
                                            defaultValue: 88,
                                            validation: (value) => validations.vlan_id(value),
                                            allowNull: false
                                        },
                                        {
                                            field: 'ip',
                                            headerName: 'IP',
                                            validation: (value, formValues) => validations.ipv4(value),
                                            formControl: (values) => values.mgmt_ip_type == 'Static' ? 'display' : 'hidden',
                                            allowNull: false
                                        },
                                        {
                                            field: 'gateway',
                                            headerName: 'Gateway',
                                            validation: (value, formValues) => validations.ipv4(value),
                                            allowNull: false
                                        },
                                        {
                                            field: 'primary_dns',
                                            headerName: 'Primary DNS',
                                            defaultValue: '8.8.8.8',
                                            validation: (value, formValues) => validations.ipv4(value),
                                            allowNull: false
                                        },
                                        {
                                            field: 'secondary_dns',
                                            headerName: 'Secondary DNS',
                                            defaultValue: '8.8.4.4',
                                            validation: (value, formValues) => value == '' || validations.ipv4(value)
                                        }
                                    ]}
                                    onCreate={values => {
                                        return {
                                            ...values,
                                            site_id: data.eset.dp_site.id,
                                            device_id: values.dp_device.id
                                        }
                                    }}
                                />
                            }
                        ]
                    },
                    {
                        label: 'Routing & DHCP',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_switch_routing'
                                    url={`/api/design_portal/table/dp_switch_routing?filter=site_id=${data.eset.dp_site.id},dp_device.site_id=${data.eset.dp_site.id},dp_device.type=switch`}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    columns={[
                                        {
                                            field: 'dp_device.hostname',
                                            headerName: 'Device',
                                            url: `/api/eset_db/dp_device?filter=site_id=${data.eset.dp_site.id},dp_device.type=switch`,
                                            association: {
                                                table: 'dp_device',
                                                display: 'hostname'
                                            },
                                        },
                                        {
                                            field: 'name',
                                            headerName: 'Name',
                                            allowNull: false
                                        },
                                        {
                                            field: 'vlan',
                                            headerName: 'VLAN',
                                            defaultValue: 1,
                                            validation: (value, formValues) => validations.vlan_id(value),
                                            allowNull: false
                                        },
                                        {
                                            field: 'ip',
                                            headerName: 'IP',
                                            defaultValue: '0.0.0.0/0',
                                            validation: (value, formValues) => validations.ipv4_cidr(value),
                                            allowNull: false
                                        },
                                        {
                                            field: 'default_gateway',
                                            headerName: 'Default Gateway',
                                            validation: (value, formValues) => validations.ipv4(value),
                                            allowNull: false
                                        },
                                        {
                                            field: 'multicast_routing',
                                            headerName: 'Multicast Routing'
                                        }
                                    ]}
                                    onCreate={values => {
                                        return {
                                            ...values,
                                            site_id: data.eset.dp_site.id,
                                            device_id: values.dp_device.id
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
                                    key="mns_switch_settings_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, mns_switch_settings_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.mns_switch_settings_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            },
            {
                label: 'Ports',
                content: generateSections([
                    {
                        label: 'Switch Ports',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_switch_ports'
                                    url={`/api/design_portal/table/dp_switch_ports?filter=site_id=${data.eset.dp_site.id},dp_device.type=switch`}
                                    tableButtons={userHasWriteAccess ? 'ef' : 'f'}
                                    pageSize={100}
                                    multiSelect={userHasWriteAccess}
                                    columns={[
                                        {
                                            field: 'dp_device.hostname',
                                            headerName: 'Device',
                                            association: {
                                                table: 'dp_device',
                                                display: 'hostname'
                                            },
                                            formControl: 'disabled'
                                        },
                                        {
                                            field: 'device_interface_id',
                                            headerName: 'Interface',
                                            association: {
                                                table: 'dp_device_interface',
                                                display: 'interface'
                                            },
                                            formControl: 'disabled'
                                        },
                                        {
                                            field: 'type',
                                            headerName: 'Type',
                                            defaultValue: 'Trunk',
                                        },
                                        {
                                            field: 'native_vlan',
                                            headerName: 'Native VLAN',
                                            defaultValue: 1,
                                            validation: (value, formValues) => validations.vlan_id(value),
                                            formControl: (values) => values.type == 'Trunk' ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'allowed_vlan',
                                            headerName: 'Allowed VLAN',
                                            defaultValue:'All',
                                            validation: (value, formValues) => validations.allowed_vlan(value),
                                            formControl: (values) => values.type == 'Trunk' ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'vlan',
                                            headerName: 'VLAN',
                                            defaultValue: 1,
                                            validation: (value, formValues) => validations.voice_vlan(value, formValues),
                                            formControl: (values) => values.type == 'Access' ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'voice_vlan',
                                            headerName: 'Voice VLAN',
                                            defaultValue: 1012,
                                            validation: (value, formValues) => validations.voice_vlan(value, formValues),
                                            formControl: (values) => values.type == 'Access' ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'description',
                                            headerName: 'Description'
                                        },
                                        {
                                            field: 'spanning_tree',
                                            headerName: 'Spanning Tree',
                                            defaultValue: true
                                        },
                                        // {
                                        //     field: 'poe',
                                        //     headerName: 'POE',
                                        //     defaultValue: true
                                        // },
                                        {
                                            field: 'comments',
                                            headerName: 'Comments'
                                        }
                                    ]}
                                    toolbarRight={apiRef => {
                                        return <SearchDropdown
                                            label='Device Filter'
                                            url={'/api/design_portal/table/dp_device?filter=type=switch,site_id=' + data.eset.dp_site.id}
                                            getOptionLabel={option => option.hostname || ''}
                                            size='small'
                                            onChange={value => {
                                                apiRef.current
                                                    .setFilterModel({
                                                        items: 
                                                            value?.hostname
                                                                ?  [
                                                                    { 
                                                                        columnField: 'dp_device.hostname',
                                                                        operatorValue: "equals",
                                                                        value: value.hostname
                                                                    }
                                                                ] 
                                                                : []
                                                    })
                                            }}
                                        />
                                    }}
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
                                    key="mns_ports_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, mns_ports_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.mns_ports_comments}
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
