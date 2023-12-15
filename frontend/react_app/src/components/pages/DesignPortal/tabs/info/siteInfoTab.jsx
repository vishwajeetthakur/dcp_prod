import {
    Autocomplete,
    TextField,
    Tooltip
} from '@mui/material'

import { generateSections } from '../../generateForm'

import { CustomTable } from '../../../../common'

import AttachmentSection from '../../customComponents/attachmentSection'
import { useSelector } from 'react-redux'

function TableWrapper({designPortalData, setDesignPortalData, userHasWriteAccess, changeActiveOrder}){
    const {loadingDesignPortalOrder} = useSelector(state => state.globalStates)

    return (
        <CustomTable
            key='Site Orders'
            url={'/api/design_portal/table/dp_order?filter=site_id=' + designPortalData.eset.dp_site.id}
            tableButtons={userHasWriteAccess ? 'ef' : 'f'}
            onRowDoubleClick={({row}) => changeActiveOrder(row)}
            loading={loadingDesignPortalOrder}
            stateSave={false} // stateSave gets confused with the main tab dp_order table, may need to fix bug in future
            columns={[
                {
                    field: 'epr',
                    headerName: 'EPR',
                    width: 150,
                    formControl: 'disabled'
                },
                {
                    field: 'cid',
                    headerName: 'Circuit ID',
                    width: 200,
                    formControl: 'disabled'
                },
                {
                    field: 'product',
                    headerName: 'Product Type',
                    width: 200,
                    formControl: 'disabled'
                },
                {
                    field: 'status',
                    headerName: 'Status',
                },
            ]}
            onEdit={values => {

                if (values.epr == designPortalData.eset.dp_order.epr){
                    setDesignPortalData({
                        ...designPortalData,
                        eset: {
                            ...designPortalData.eset,
                            dp_order: {
                                ...designPortalData.eset.dp_order,
                                status: values.status
                            }
                        }
                    })
                }

                return values
            }}
        />
    )
}

export default function siteInfoTab({
    designPortalData,
    setDesignPortalData,
    formData,
    setFormData,
    userHasWriteAccess,
    changeActiveOrder,
    loadingOrder
}) {
    return {
        label: 'Site Info',
        content: generateSections([
            {
                label: 'Site Devices',
                fields: [
                    {
                        sm: 12,
                        content: <CustomTable
                            key='Network Devices'
                            url={'/api/design_portal/table/dp_device?include=dp_switch_settings,dp_network_wan&filter=site_id=' + designPortalData.eset.dp_site.id}
                            columns={[
                                {
                                    field: 'hostname',
                                    headerName: 'Hostname',
                                    width: 150
                                },
                                {
                                    field: 'model',
                                    headerName: 'Model',
                                    width: 100
                                },
                                {
                                    field: 'type',
                                    headerName: 'Type',
                                    width: 100
                                },
                                {
                                    field: 'ip',
                                    headerName: 'IP',
                                    renderCell: ({ row }) => 
                                        row.type == 'switch'
                                            ? row.dp_switch_settings.ip || 'DHCP'
                                            : row.type == 'network'
                                                ? row.dp_network_wans.map(r => r.ip || 'DHCP').join(', ')
                                                : row.ip
                                },
                                {
                                    field: 'cid',
                                    headerName: 'Circuit',
                                    sortable: false, // If this becomes an issue we will need to create a view
                                    renderCell: ({ row }) => 
                                        row.type == 'network'
                                            ? row.dp_network_wans.map(r => r.cid).filter(r => r).join(', ')
                                            : row.cid
                                },
                                {
                                    field: 'mne_features',
                                    headerName: 'Features'
                                }
                            ]}
                        />
                    }
                ]
            },
            {
                label: 'Site Orders',
                fields: [
                    {
                        sm: 12,
                        content: <TableWrapper 
                            designPortalData={designPortalData}
                            setDesignPortalData={setDesignPortalData}
                            userHasWriteAccess={userHasWriteAccess}
                            changeActiveOrder={changeActiveOrder}
                        />
                    }
                ]
            },
            {
                label: 'Site Info',
                fields: [
                    {
                        sm: 6,
                        content: <TextField
                            key="network_id"
                            autoComplete="off"
                            // onChange={(event) => setFormData((old) => ({ ...old, network_id: event.target.value }))}
                            label='Network ID'
                            defaultValue={formData.network_id}
                            disabled={true} // {!userHasWriteAccess}
                        />
                    },
                    {
                        sm: 6,
                        content: <TextField
                            key="network_name"
                            autoComplete="off"
                            onChange={(event) => setFormData((old) => ({ ...old, network_name: event.target.value }))}
                            label='Network Name'
                            defaultValue={formData.network_name}
                            disabled={!userHasWriteAccess}
                            error={!formData.network_name}
                        />
                    },
                    {
                        sm: 6,
                        content: <TextField
                            key="organization_id"
                            autoComplete="off"
                            // onChange={(event) => setFormData((old) => ({ ...old, organization_id: event.target.value }))}
                            label='Organization ID'
                            defaultValue={formData.organization_id}
                            disabled={true} // {!userHasWriteAccess}
                        />
                    },
                    {
                        sm: 6,
                        content: <TextField
                            key="organization_name"
                            autoComplete="off"
                            onChange={(event) => setFormData((old) => ({ ...old, organization_name: event.target.value }))}
                            label='Organization Name'
                            defaultValue={formData.organization_name}
                            disabled={!userHasWriteAccess}
                            error={!formData.organization_name}
                        />
                    },
                    {
                        sm: 6,
                        content: <Autocomplete
                            name='Site Type'
                            options={[
                                'Spoke',
                                'Data Center-1',
                                'Data Center-2',
                                'Hub-1',
                                'Hub-2',
                                'HQ-1',
                                'HQ-2'
                            ]}
                            getOptionLabel={option => option}
                            value={formData.site_type}
                            onChange={(event, values) => setFormData((old) => ({ ...old, site_type: values }))}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label='Site Type'
                                />
                            )}
                            fullWidth
                            disabled={!userHasWriteAccess}
                        />
                    },
                    {
                        sm: 12,
                        content: <TextField
                            autoComplete='off'
                            onChange={(event) => setFormData((old) => ({ ...old, site_comments: event.target.value }))}
                            label='Comments'
                            multiline
                            rows={4}
                            defaultValue={designPortalData.eset.dp_site_detail.site_comments}
                            disabled={!userHasWriteAccess}
                        />
                    }
                ]
            },
            {
                label: 'Attachments',
                fields: [
                    {
                        sm: 12,
                        content: (
                            <AttachmentSection 
                                data={designPortalData}
                            />
                        )
                    }
                ]
            },
            {
                label: 'Site History',
                fields: [
                    {
                        sm: 12,
                        content: <CustomTable
                            key='site_history'
                            url={`/api/design_portal/table/dp_site_history?filter=site_id=${designPortalData.eset.dp_site.id}`}
                            columns={[
                                {
                                    field: 'action',
                                    headerName: 'Action'
                                },
                                {
                                    field: 'table_name',
                                    headerName: 'Table'
                                },
                                {
                                    field: 'previous_value',
                                    headerName: 'Previous Value',
                                    renderCell: ({value}) => 
                                        value
                                            ? (
                                                <Tooltip title={<span style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(value, null, 4)}</span>} placement="top-start">
                                                    <span>{JSON.stringify(value)}</span>
                                                </Tooltip>
                                            ) : ''
                                },
                                {
                                    field: 'new_value',
                                    headerName: 'New Value',
                                    renderCell: ({value}) => 
                                        value
                                            ? (
                                                <Tooltip title={<span style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(value, null, 4)}</span>} placement="top-start">
                                                    <span>{JSON.stringify(value)}</span>
                                                </Tooltip>
                                            ) : ''
                                },
                                {
                                    field: 'user',
                                    headerName: 'User'
                                },
                                {
                                    field: 'timestamp',
                                    headerName: 'Timestamp',
                                    renderCell: ({value}) => value.replace('T', ' ').slice(0, -5)
                                }
                            ]}
                            initialState={{
                                sorting: {
                                    sortModel: [{ field: 'timestamp', sort: 'desc' }],
                                },
                            }}
                        />
                    }
                ]
            }
        ])
    }

}