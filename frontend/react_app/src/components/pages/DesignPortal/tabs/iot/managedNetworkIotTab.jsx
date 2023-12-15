import { CustomTable } from '../../../../common'

import { generateSections } from '../../generateForm'

import { TextField } from '@mui/material'

export default function managedNetworkIotTab(data, formData, setFormData, userHasWriteAccess) {
    return {
        label: 'IOT',
        secondaryTabs: [
            {
                label: 'IOT Overview',
                content: generateSections([
                    {
                        label: 'IOT Overview',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_device'
                                    url={'/api/design_portal/table/dp_device?filter=type=iot,site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    pageSize={100}
                                    columns={[
                                        {
                                            field: 'model',
                                            headerName: 'Model',
                                            type: 'SELECT',
                                            // options: [
                                            //     'MT10 (Temperature & Humidity)',
                                            //     'MT11 (Probe Sensor)',
                                            //     'MT12 (Water Detection)',
                                            //     'MT14 (Indoor Air Quality)',
                                            //     'MT20 (Open/Close Detection)',
                                            //     'MT30 (Smart Automation Button)'
                                            // ],
                                            options: [
                                                'MT10-HW',
                                                'MT11-HW',
                                                'MT12-HW',
                                                'MT14-HW',
                                                'MT20-HW',
                                            ],
                                            getOptionLabel: option => (
                                                {
                                                    'MT10-HW': 'MT10 (Temperature & Humidity)',
                                                    'MT11-HW': 'MT11 (Probe Sensor)',
                                                    'MT12-HW': 'MT12 (Water Detection)',
                                                    'MT14-HW': 'MT14 (Indoor Air Quality)',
                                                    'MT20-HW': 'MT20 (Open/Close Detection)',
                                                    'MT30-HW': 'MT30 (Smart Automation Button)'
                                                }[option]
                                            )
                                                
                                        },
                                        {
                                            field: 'comments',
                                            headerName: 'Comments'
                                        },
                                    ]}
                                    onCreate={values => {
                                        return {
                                            ...values,
                                            site_id: data.eset.dp_site.id,
                                            type: 'iot'
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
                                    key="iot_overview_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, iot_overview_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.iot_overview_comments}
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
