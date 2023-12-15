import { CustomTable } from '../../common/';
import { NewToolWrapper } from '../../common';

const SimpleDataDictionary = () => {
    const tables = {
        connections: {
            key: 'connections',
            table: 'dd_user_resource_association',
            columns: [
                {
                    field: 'dd_resource_id',
                    headerName: 'Resource',
                    association: {
                        table: 'dd_resource',
                        display: 'name'
                    }
                },
                {
                    field: 'dd_user_id',
                    headerName: 'User',
                    association: {
                        table: 'dd_user',
                        display: 'name'
                    }
                },
                {
                    field: 'dd_user',
                    headerName: 'Email',
                    formControl: 'hidden',
                    association: {
                        table: 'dd_user',
                        display: 'email'
                    }
                },
            ],
            tableButtons: 'cedxf'
        },
        resources: {
            key: 'resources',
            table: 'dd_resource',
            columns: [
                {
                    field: 'parent_resource_id',
                    headerName: 'Parent Resource',
                    association: {
                        table: 'dd_resource as parent_resource',
                        display: 'name'
                    }
                },
                {
                    field: 'name',
                    headerName: 'Resource Name'
                },
                {
                    field: 'type_id',
                    headerName: 'Type',
                    association: {
                        table: 'dd_type',
                        display: 'name'
                    }
                },
                {
                    field: 'description',
                    headerName: 'Description'
                },
                {
                    field: 'status_id',
                    headerName: 'Status',
                    association: {
                        table: 'dd_status',
                        display: 'name'
                    }
                },
                {
                    field: 'notes',
                    headerName: 'Notes'
                },
                {
                    field: 'owner_id',
                    headerName: 'Owner',
                    association: {
                        table: 'dd_user as owner',
                        display: 'name'
                    }
                },
            ],
            tableButtons: 'cedxf'
        },
        contacts: {
            key: 'contacts',
            table: 'dd_user',
            columns: [
                {
                    field: 'name',
                    headerName: 'Name'
                },
                {
                    field: 'email',
                    headerName: 'Email'
                }
            ],
            tableButtons: 'cedxf'
        },
    }

    // =============================================
    // Return
    // =============================================

    return (
        <NewToolWrapper
            titleElement="Simple Data Dictionary"
            tabDefinitions={[
                { label: 'Connections', content: <CustomTable {...tables.connections} /> },
                { label: 'Resources', content: <CustomTable {...tables.resources} /> },
                { label: 'Contacts', content: <CustomTable {...tables.contacts} /> },
            ]}
        />
    );
};

export default SimpleDataDictionary
