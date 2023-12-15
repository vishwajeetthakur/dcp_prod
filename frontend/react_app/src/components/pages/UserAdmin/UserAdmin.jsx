// Packages
import React from 'react'
import { useKeycloakUser } from '../../hooks/useKeycloakUser'

// Components
import { CustomTable } from '../../common'
import { NewToolWrapper } from '../../common'

import KeyIcon from '@mui/icons-material/Key'


// Styles
import './UserAdmin.scss';

const UserAdmin = () => {
    const { keycloakUser } = useKeycloakUser()

    const tables = {
        users: {
            key: 'users',
            table: 'users',
            columns: [
                {
                    field: 'username',
                    headerName: 'Username'
                },
                {
                    field: 'email',
                    headerName: 'Email Address'
                },
                {
                    field: 'api_user',
                    headerName: 'API User',
                    defaultValue: false,
                    type: 'boolean',
                    width: 100
                },
                {
                    field: 'secret',
                    headerName: 'Secret',
                    align: 'center',
                    headerAlign: 'center',
                    width: 90,
                    renderCell: ({row}) => row.secret ? <KeyIcon color="primary"/> : null
                },
                {
                    field: 'last_login',
                    headerName: 'Last Login',
                    type: 'datetime',
                    formControl: 'hidden'
                },
                // Many to many
                {
                    headerName: 'User Roles',
                    multiple: true, // Should be automatic 
                    flex: 1,
                    association: {
                        table: 'user_roles',
                        display: 'role_name', // If not provided remote id column is shown
                        through: {
                            table: 'user_role_associations',
                            localKey: 'user_id',
                            remoteKey: 'role_id'
                        }
                    },
                },
                // // One to one
                // {
                //     field: 'manager.username',
                //     headerName: 'Manager',
                //     relationship: {
                //         'manager.id': 'manager_id' 
                //     }
                // },
            ],
            tableButtons: keycloakUser?.user_roles?.includes('admin') ? 'cedf' : 'f'
        },
        user_roles: {
            key: 'user_roles',
            url: "/api/eset_db/user_roles",
            columns: [
                {
                    field: 'role_name',
                    headerName: 'Role Name'
                },
                {
                    field: 'description',
                    headerName: 'Description'
                },
            ],
            tableButtons: keycloakUser?.user_roles?.includes('admin') ? 'cedf' : 'f'
        }
    }

    // =============================================
    // Return
    // =============================================
    return (
        <NewToolWrapper
            titleElement="User Admin"
            tabDefinitions={[
                { label: 'Users', content: <CustomTable {...tables.users} /> },
                { label: 'User Roles', content: <CustomTable {...tables.user_roles} /> },
            ]}
        />
    )
}

export default UserAdmin
