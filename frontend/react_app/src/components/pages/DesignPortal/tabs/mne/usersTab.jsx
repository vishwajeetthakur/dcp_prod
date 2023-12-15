import { CustomTable } from '../../../../common'

import { 
    TextField
} from '@mui/material'

import { generateSections } from '../../generateForm'

import { validations } from '../../validation'

export default function usersTab(data, formData, setFormData, userHasWriteAccess) {
    const clientVpnAuthentication = data.eset.dp_site_detail.vpn_client_vpn_authentication
    // console.log("usersTab: ", data, clientVpnAuthentication)
    return {
        label: 'Users',
        secondaryTabs: [
            {
                label: 'Meraki Cloud Authentication',
                content: generateSections([
                    {
                        label: 'Meraki Cloud Authentication',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_users_meraki_cloud_authentication'
                                    url={'/api/design_portal/table/dp_users_meraki_cloud_authentication?filter=site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    columns={[
                                        {
                                            field: 'email',
                                            headerName: 'Email',
                                            // validation: (value, formValues) => validations.unique_email(value)
                                        },
                                        {
                                            field: 'password',
                                            headerName: 'Password'
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
                        label: 'Comments',
                        fields: [
                            {
                                sm: 12,
                                content: <TextField
                                    key="users_meraki_cloud_authentication_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, users_meraki_cloud_authentication_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.users_meraki_cloud_authentication_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            },
            {
                label: 'LDAP (Active Directory)',
                content: generateSections([
                    {
                        label: 'LDAP (Active Directory)',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_users_ldap'
                                    url={'/api/design_portal/table/dp_users_ldap?filter=site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    columns={[
                                        {
                                            field: 'ip',
                                            headerName: 'IP',
                                            validation: (value, formValues) => validations.ipv4(value)
                                        },
                                        {
                                            field: 'domain',
                                            headerName: 'Domain'
                                        },
                                        {
                                            field: 'username',
                                            headerName: 'Username'
                                        },
                                        {
                                            field: 'password',
                                            headerName: 'Password'
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
                                    key="users_ldap_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, users_ldap_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.users_ldap_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            },
            {
                label: 'Radius',
                content: generateSections([
                    {
                        label: 'Radius',
                        fields: [
                            {
                                sm: 12,
                                content: <CustomTable
                                    key='dp_users_radius'
                                    url={'/api/design_portal/table/dp_users_radius?filter=site_id=' + data.eset.dp_site.id}
                                    tableButtons={userHasWriteAccess ? 'cedf' : 'f'}
                                    columns={[
                                        {
                                            field: 'ip',
                                            headerName: 'IP',
                                            validation: (value) => validations.ipv4(value)
                                        },
                                        {
                                            field: 'port',
                                            headerName: 'Port',
                                            validation: (value) => validations.port(value)
                                        },
                                        {
                                            field: 'psk',
                                            headerName: 'PSK'
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
                                    key="users_radius_comments"
                                    autoComplete="off"
                                    onChange={(event) => setFormData((old) => ({ ...old, users_radius_comments: event.target.value }))}
                                    label='Comments'
                                    multiline
                                    rows={4}
                                    defaultValue={formData.users_radius_comments}
                                    disabled={!userHasWriteAccess}
                                />
                            }
                        ]
                    }
                ])
            },
        ].filter(({ label }) => label.includes(clientVpnAuthentication))
    }
}