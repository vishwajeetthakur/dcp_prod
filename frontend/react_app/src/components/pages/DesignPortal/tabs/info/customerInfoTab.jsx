import * as React from 'react'
import { useSelector } from 'react-redux'
import { CustomTable } from '../../../../common'
import { getGraniteUrl, getSalesforceUrl } from '../../helpers'

import { generateSections } from '../../generateForm'

export default function customerInfoTab(
    data,
    formData,
    setFormData,
    userHasWriteAccess,
    loadFullSite,
    loadingOrder
) {    
    return {
        label: 'Customer Info',
        content: generateSections([
            {
                label: 'Customer Sites',
                fields: [
                    {
                        sm: 12,
                        content: <HookWrapper loadFullSite={loadFullSite} data={data} userHasWriteAccess={userHasWriteAccess} />
                    }
                ]
            },
            {
                label: 'Customer Devices',
                fields: [
                    {
                        sm: 12,
                        content: <CustomTable
                            key='Network Devices'
                            url={'/api/design_portal/table/dp_device?include=dp_switch_settings,dp_network_wan&filter=dp_site.account_id=' + data.eset.dp_site.account_id}
                            columns={[
                                {
                                    field: 'dp_site.address',
                                    headerName: 'Address',
                                    association: {
                                        table: 'dp_site',
                                        display: 'address'
                                    },
                                    width: 300
                                },
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
        ])
    }

}

const HookWrapper = ({loadFullSite, data, userHasWriteAccess}) => {
    
    const {loadingDesignPortalOrder} = useSelector(state => state.globalStates)

    return (
        <CustomTable
            key='site_overview'
            url={'/api/design_portal/table/dp_site?include=dp_order,dp_device&filter=account_id=' + data.eset.dp_site.account_id}
            columns={[
                {
                    field: 'address',
                    headerName: 'Address'
                },
                {
                    field: 'clli',
                    headerName: 'CLLI'
                },
                {
                    field: 'customer_name',
                    headerName: 'Customer Name'
                }
            ]}
            onRowDoubleClick={({row}) => loadFullSite(row.dp_orders[0])}
            loading={loadingDesignPortalOrder}
            tableButtons={userHasWriteAccess ? 'dfx' : 'fx'}
            onDeleteOpen={async (selectedRow, openDeleteModal) => {
                const dpDevices = selectedRow?.[0]?.dp_devices
                const eprs = selectedRow?.[0]?.dp_orders?.map(({epr}) => epr)

                if (dpDevices.length > 0) return alert(`Unable to delete this site. This site has ${dpDevices.length} devices associated to it.`)

                if (confirm(`Deleting this site will also delete all data and unlink CEDT data for ${eprs.join(', ')}`)){
                    openDeleteModal()
                }

            }}
        />
    )
}