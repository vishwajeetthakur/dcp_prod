// Packages
import React from 'react'
import { useKeycloakUser } from '../../hooks/useKeycloakUser'

// Components
import { CustomTable } from '../../common'
import { NewToolWrapper } from '../../common'

// Styles
import './VendorModelMapping.scss';

const VendorModelMapping = () => {
    const { checkUserRoles, keycloakUser } = useKeycloakUser()

    // =============================================
    // Return
    // =============================================
    return (
        <NewToolWrapper
            titleElement="Vendor Model Mapping"
            tabDefinitions={[
                { 
                    label: 'SNMP Mapping', 
                    content: <CustomTable 
                        url="/api/eset_db/vendor_model_mapping"
                        columns={[
                            {
                                field: 'snmp_isolated_model',
                                headerName: 'SNMP Isolated Model'
                            },
                            {
                                field: 'snmp_vendor',
                                headerName: 'SNMP Vendor'
                            },
                            {
                                field: 'granite_model',
                                headerName: 'Granite Model'
                            },
                            {
                                field: 'ise_model',
                                headerName: 'ISE Model'
                            },
                            {
                                field: 'role_access_type',
                                headerName: 'Role Access Type'
                            },
                            {
                                field: 'created_by',
                                headerName: 'Created By',
                                formControl: 'hidden'
                            },
                            {
                                field: 'created_at',
                                headerName: 'Created At',
                                formControl: 'hidden'
                            },
                            {
                                field: 'updated_by',
                                headerName: 'Updated By',
                                formControl: 'hidden'
                            },
                            {
                                field: 'updated_at',
                                headerName: 'Updated At',
                                formControl: 'hidden'
                            }
                        ]}
                        tableButtons={checkUserRoles('vendor_model_mapping_rw') ? 'cedf' : 'f'}
                        onCreate={values => {
                            return {
                                ...values,
                                created_by: keycloakUser.sAMAccountName,
                                created_at: (new Date).toISOString()
                            }
                        }}
                        onUpdate={values => {
                            return {
                                ...values,
                                updated_by: keycloakUser.sAMAccountName,
                                updated_at: (new Date).toISOString()
                            }
                        }}
                    /> 
                }
            ]}
        />
    )
}

export default VendorModelMapping
