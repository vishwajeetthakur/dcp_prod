import { CustomTable } from '../../../../common'

import { generateSections } from '../../generateForm'

import { TextField } from '@mui/material'

import managedNetworkCameraVideoResolution from '../../customFields/managedNetworkCameraVideoResolution'
import managedNetworkCameraVideoQuality from '../../customFields/managedNetworkCameraVideoQuality'

import { validations } from '../../validation'

import { nextHostnameSuffix } from '../../helpers'

export default function managedNetworkCameraTab(data, formData, setFormData, userHasWriteAccess) {
    return {
        label: 'Camera',
        secondaryTabs: [
            {
                label: 'Camera Overview',
                content: generateSections([
                    {
                        label: 'Camera Overview',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_device'
                                    url={'/api/design_portal/table/dp_device?filter=type=camera,site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    pageSize={100}
                                    columns={[
                                        {
                                            field: 'hostname',
                                            headerName: 'Hostname',
                                            defaultValue: tableState => (data.eset.dp_site.clli || 'xxxxxxxx') + '-MV' + nextHostnameSuffix(tableState.data),
                                        },
                                        {
                                            field: 'model',
                                            headerName: 'Model',
                                            type: 'ENUM',
                                            // options: [
                                            //     "MV12N",
                                            //     "MV12W",
                                            //     "MV2",
                                            //     "MV32",
                                            //     "MV52",
                                            //     "MV72",
                                            //     'MV2-HW',
                                            //     'MV12W-HW',
                                            //     'MV12N-HW',
                                            //     'MV22-HW',
                                            //     'MV32-HW',
                                            //     'MV52-HW',
                                            //     'MV72-HW',
                                            // ],
                                            options: [
                                             'MV2-HW',
                                                'MV12W-HW',
                                                'MV12N-HW',
                                                'MV22-HW',
                                                'MV32-HW',
                                                'MV52-HW',
                                                'MV72-HW',
                                            ],
                                            // Reset video_resolution column on change
                                            onChange: (newValues, currentValues, handleChange, setValues) => {
                                                handleChange(newValues)
                                                setValues(old => ({ 
                                                    ...old, 
                                                    mnc_video_resolution: null,
                                                    mnc_video_quality: null
                                                }))
                                            }
                                        },
                                        {
                                            field: 'ip',
                                            headerName: 'IP',
                                            defaultValue: 'DHCP',
                                            validation: (value, formValues) => value.toLowerCase() == 'dhcp' || validations.ipv4_cidr(value)
                                        },
                                        {
                                            field: 'vlan',
                                            headerName: 'VLAN',
                                            validation: (value, formValues) => validations.vlan_id(value)
                                        },
                                        {
                                            field: 'gateway',
                                            headerName: 'Gateway',
                                            allowNull: false,
                                            validation: (value, formValues) => validations.ipv4(value),
                                            formControl: (values) => values.ip.toLowerCase() != 'dhcp' ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'dns_1',
                                            headerName: 'DNS 1',
                                            defaultValue: '8.8.8.8',
                                            allowNull: false,
                                            validation: (value, formValues) => validations.ipv4(value),
                                            formControl: (values) => values.ip.toLowerCase() != 'dhcp' ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'dns_2',
                                            headerName: 'DNS 2',
                                            defaultValue: '8.8.4.4',
                                            validation: (value, formValues) => value == '' || validations.ipv4(value),
                                            formControl: (values) => values.ip.toLowerCase() != 'dhcp' ? 'display' : 'hidden',
                                        },
                                        {
                                            field: 'mnc_video_resolution',
                                            headerName: 'Video Resolution',
                                            renderField: (render, values) => managedNetworkCameraVideoResolution(render, values),
                                        },
                                        {
                                            field: 'mnc_video_quality',
                                            headerName: 'Video Quality',
                                            renderField: (render, values) => managedNetworkCameraVideoQuality(render, values)
                                        }
                                    ]}
                                    onCreate={values => {
                                        return {
                                            ...values,
                                            site_id: data.eset.dp_site.id,
                                            type: 'camera'
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
                                    key="mnc_overview_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, mnc_overview_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.mnc_overview_comments}
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
