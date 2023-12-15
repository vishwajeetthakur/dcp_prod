import { CustomTable } from '../../../../common'

import { 
    TextField,
    Autocomplete,
    Button
} from '@mui/material'

import { generateSections } from '../../generateForm'

import { categoryBlocking, threatCategories, resetWebFilter } from '../../helpers'
import layerSevenFirewallValue from '../../customFields/layerSevenFirewallValue'
import ManualConfigReqBanner from '../../customComponents/ManualConfigReqBanner'

import { validations } from '../../validation'

const policyAndObjectsTab = (data, formData, setFormData, userHasWriteAccess) => {
    return {
        label: 'Policy & Objects',
        secondaryTabs: [
            {
                label: 'NAT',
                content: generateSections([
                    {
                        label: 'Mode',
                        fields: [
                            {
                                sm: 6,
                                content: <Autocomplete
                                    options={[
                                        'Routed',
                                        'Pass-Through / VPN Concentrator',
                                        'No NAT (Beta)'
                                    ]}
                                    getOptionLabel={option => option}
                                    value={formData.policy_nat_mode}
                                    onChange={(event, values) => setFormData((old) => ({ ...old, policy_nat_mode: values }))}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='Mode'
                                            error={!formData.policy_nat_mode}
                                        />
                                    )}
                                    fullWidth
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    },
                    {
                        label: 'Port Forwarding',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='port_forwarding'
                                    url={'/api/design_portal/table/dp_policy_nat_port_forwarding?filter=site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    columns={[
                                        {
                                            field: 'external_port',
                                            headerName: 'External Ports',
                                            validation: (value, formValues) => validations.port_multiple(value),
                                            width: 100
                                        },
                                        {
                                            field: 'internal_ip',
                                            headerName: 'Internal IP',
                                            validation: (value, formValues) => validations.ipv4(value),
                                            width: 100
                                        },
                                        {
                                            field: 'internal_port',
                                            headerName: 'Internal Ports',
                                            validation: (value, formValues) => validations.port_multiple(value),
                                            allowNull: false,
                                            width: 100,
                                            // formControl: (values) => !values.external_port  ? 'hidden' : 'display',
                                        },
                                        {
                                            field: 'protocol',
                                            headerName: 'Protocol',
                                            defaultValue: 'TCP',
                                            width: 100,
                                            // formControl: (values) => !values.external_port ? 'hidden' : 'display',
                                        },
                                        {
                                            field: 'allowed_ips',
                                            headerName: 'Allowed IPs',
                                            // validation: (value, formValues) => validations.ipv4(value),
                                            width: 300
                                        },
                                        {
                                            field: 'uplink',
                                            headerName: 'Uplink',
                                            defaultValue: 'Internet 1',
                                            width: 100
                                        },
                                        {
                                            field: 'description',
                                            headerName: 'Description',
                                            flex: 1
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
                        label: '1:1 NAT',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='one_to_one_nat'
                                    url={'/api/design_portal/table/dp_policy_nat_one_to_one_nat?filter=site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    columns={[
                                        {
                                            field: 'name',
                                            headerName: 'Name',
                                            flex: 1
                                        },
                                        {
                                            field: 'external_ip',
                                            headerName: 'External IP',
                                            validation: (value, formValues) => validations.ipv4(value),
                                            width: 150
                                        },
                                        {
                                            field: 'internal_ip',
                                            headerName: 'Internal IP',
                                            validation: (value, formValues) => validations.ipv4(value),
                                            width: 150
                                        },
                                        {
                                            field: 'uplink',
                                            headerName: 'Uplink',
                                            defaultValue: 'Internet 1',
                                            width: 100
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
                        label: '1:1 NAT - Allowed Inbound Connections',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='allowed_inbound_connections'
                                    url={`/api/design_portal/table/dp_policy_nat_allowed_inbound_connections?filter=site_id=${data.eset.dp_site.id},dp_policy_nat_one_to_one_nat.site_id=${data.eset.dp_site.id}`}
                                    tableButtons={userHasWriteAccess ? 'cedfr' : 'f'}
                                    columns={[
                                        {
                                            field: 'one_to_one_nat_id',
                                            headerName: '1:1 NAT name',
                                            url: `/api/design_portal/table/dp_policy_nat_one_to_one_nat?filter=site_id=${data.eset.dp_site.id}`,
                                            association: {
                                                table: 'dp_policy_nat_one_to_one_nat',
                                                display: 'name'
                                            },
                                        },
                                        {
                                            field: 'protocol',
                                            headerName: 'Protocol',
                                            defaultValue: 'TCP',
                                            // validation: (value, formValues) => validations.protocol(value)
                                        },
                                        {
                                            field: 'ports',
                                            headerName: 'Ports'
                                        },
                                        {
                                            field: 'remote_ips',
                                            headerName: 'Remote Allowed IPs',
                                            validation: (value, formValues) => validations.ipv4_cidr_multiple(value)
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
                        label: '1:Many NAT',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='one_to_many_nat'
                                    url={'/api/design_portal/table/dp_policy_nat_one_to_many_nat?filter=site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    columns={[
                                        {
                                            field: 'external_ip',
                                            headerName: 'External IP',
                                            validation: (value, formValues) => validations.ipv4(value)
                                        },
                                        {
                                            field: 'external_port',
                                            headerName: 'External Port',
                                            validation: (value, formValues) => validations.port(value)
                                        },
                                        {
                                            field: 'internal_ip',
                                            headerName: 'Internal IP',
                                            validation: (value, formValues) => validations.ipv4(value)
                                        },
                                        {
                                            field: 'internal_port',
                                            headerName: 'Internal Port',
                                            validation: (value, formValues) => validations.port(value),
                                            formControl: (values) => !values.external_port ? 'hidden' : 'display',
                                        },
                                        {
                                            field: 'protocol',
                                            headerName: 'Protocol',
                                            defaultValue: 'TCP',
                                            // validation: (value, formValues) => validations.protocol(value),
                                            formControl: (values) => !values.external_port ? 'hidden' : 'display',
                                        },
                                        {
                                            field: 'source_ips',
                                            headerName: 'Source IPs',
                                            validation: (value, formValues) => validations.ipv4_cidr_multiple(value)
                                        },
                                        {
                                            field: 'description',
                                            headerName: 'Description',
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
                                    key="policy_nat_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, policy_nat_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.policy_nat_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            },
            {
                label: 'Firewall Policies',
                content: generateSections([
                    {
                        label: 'Layer 3 Firewall Policies',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='layer_three_firewall_policies'
                                    url={'/api/design_portal/table/dp_policy_firewall_layer_three_firewall_policies?filter=site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    columns={[
                                        {
                                            field: 'description',
                                            headerName: 'Description'
                                        },
                                        {
                                            field: 'action',
                                            headerName: 'Action',
                                            defaultValue: 'Deny'
                                        },
                                        {
                                            field: 'protocol',
                                            headerName: 'Protocol',
                                            defaultValue: 'Any',
                                            // validation: (value, formValues) => validations.protocol(value)
                                        },
                                        {
                                            field: 'source_ip',
                                            headerName: 'Source IP',
                                            defaultValue: 'All',
                                            validation: (value, formValues) => value.toLowerCase() == 'all' || validations.ipv4_cidr_multiple(value)
                                        },
                                        {
                                            field: 'destination_ip',
                                            headerName: 'Destination IP',
                                            defaultValue: 'All',
                                            validation: (value, formValues) => value.toLowerCase() == 'all' || validations.ipv4_cidr_multiple(value)
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
                        label: 'Layer 7 Firewall Policies',
                        fields: [
                            {
                                sm: 12,
                                content: <ManualConfigReqBanner />
                            },
                            {
                                sm: 12,
                                content: <CustomTable
                                key='layer_seven_firewall_policies'
                                url={'/api/design_portal/table/dp_policy_firewall_layer_seven_firewall_policies?filter=site_id=' + data.eset.dp_site.id}
                                tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                columns={[
                                    {
                                        field: 'action',
                                        headerName: 'Action',
                                        defaultValue: 'Deny',
                                        formControl: 'disabled'
                                    },
                                    {
                                        field: 'type',
                                        headerName: 'Type',
                                        defaultValue: 'HTTP hostname',
                                        // Reset value column on change
                                        onChange: (newValues, currentValues, handleChange, setValues) => {
                                            handleChange(newValues)
                                            setValues(old => ({ ...old, value: ''}))
                                        }
                                    },
                                    {
                                        field: 'value',
                                        headerName: 'Value',
                                        renderField: (render, values) => layerSevenFirewallValue(render, values)
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
                                    key="mne_firewall_policies_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, mne_firewall_policies_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.mne_firewall_policies_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            },
            {
                label: 'AMP/IPS',
                content: generateSections([
                    {
                        label: 'AMP (Enabled by Default)',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='policy_amp'
                                    url={'/api/design_portal/table/dp_policy_amp?filter=site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    columns={[
                                        {
                                            field: 'whitelist_url',
                                            headerName: "Allowed URL's"
                                        },
                                        {
                                            field: 'comment',
                                            headerName: 'Comment'
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
                        label: 'IPS',
                        fields: [
                            {
                                sm: 6,
                                content: <Autocomplete
                                    options={[
                                        'Prevention',
                                        'Detection',
                                        'Disable'
                                    ]}
                                    getOptionLabel={option => option}
                                    value={formData.policy_ips_mode}
                                    onChange={(event, values) => setFormData((old) => ({ ...old, policy_ips_mode: values }))}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='Mode'
                                            error={!formData.policy_ips_mode}
                                        />
                                    )}
                                    fullWidth
                                    disabled={!userHasWriteAccess}
                                />
                            },
                            {
                                sm: 6,
                                content: <Autocomplete
                                    options={[
                                        'Connectivity',
                                        'Balanced',
                                        'Security'
                                    ]}
                                    getOptionLabel={option => option}
                                    value={formData.policy_ips_ruleset}
                                    onChange={(event, values) => setFormData((old) => ({ ...old, policy_ips_ruleset: values }))}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='Ruleset'
                                            error={!formData.policy_ips_ruleset}
                                        />
                                    )}
                                    fullWidth
                                    disabled={!userHasWriteAccess || formData.policy_ips_mode == 'Disable'}
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
                                    key="policy_ips_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, policy_ips_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.policy_ips_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            },
            {
                label: 'Web Filter',
                content: generateSections([
                    {
                        label: 'Web Filter',
                        fields: [
                            { 
                                sm: 4,
                                content: <Button variant="outlined" onClick={() => resetWebFilter(setFormData)}>Set to Defaults</Button>
                            },
                            {
                                sm: 12,
                                content: <Autocomplete
                                    multiple={true}
                                    options={categoryBlocking}
                                    getOptionLabel={option => option}
                                    value={ 
                                        formData.policy_web_filter_category_blocking?.length
                                            ? formData?.policy_web_filter_category_blocking?.split(', ') 
                                            : []
                                    }
                                    onChange={(event, values) => setFormData((old) => ({ 
                                        ...old, 
                                        policy_web_filter_category_blocking: values.sort().join(', ')
                                    }))}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='Category Blocking'
                                        />
                                    )}
                                    fullWidth
                                    disabled={!userHasWriteAccess}
                                />
                            },
                            {
                                sm: 12,
                                content: <Autocomplete
                                    multiple={true}
                                    options={threatCategories}
                                    getOptionLabel={option => option}
                                    value={ 
                                        formData.policy_web_filter_threat_categories?.length
                                            ? formData?.policy_web_filter_threat_categories?.split(', ') 
                                            : []
                                    }
                                    onChange={(event, values) => setFormData((old) => ({ 
                                        ...old, 
                                        policy_web_filter_threat_categories: values.sort().join(', ')
                                    }))}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='Threat Categories'
                                        />
                                    )}
                                    fullWidth
                                    disabled={!userHasWriteAccess}
                                />
                            },
                            {
                                sm: 12,
                                content: <TextField
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, policy_web_filter_url_blacklist: event.target.value }))}
                                    label='URL Blacklist'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.policy_web_filter_url_blacklist}
                                    disabled={!userHasWriteAccess}
                                />
                            },
                            {
                                sm: 12,
                                content: <TextField
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, policy_web_filter_url_whitelist: event.target.value }))}
                                    label='URL Whitelist'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.policy_web_filter_url_whitelist}
                                    disabled={!userHasWriteAccess}
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
                                    key="mne_web_filter_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, mne_web_filter_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.mne_web_filter_comments}
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
export default policyAndObjectsTab
