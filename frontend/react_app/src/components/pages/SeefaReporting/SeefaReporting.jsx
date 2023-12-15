// Packages
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// Components
import { ToolWrapper } from '../../common';
import CustomTable from '../../common/tables/CustomTable';

// Styles

// Hooks
import { useKeycloakUser } from '../../hooks';

// Utils
import paths from '../../../paths'

// Types

// Styles
// infrastructure
// api
// application

const SeefaReporting = () => {
    // ==============================================
    // Hooks
    // ==============================================
    const { keycloakUser } = useKeycloakUser()
    const { tabs } = useSelector(state => state.globalStates)

    // =============================================
    // State/Refs
    // =============================================

    // Table state
    const [tableState, setTableState] = useState({})
    const [tabsStates, setTabsStates] = useState({})

    // =============================================
    // Helpers (Memo, CB, vars)
    // =============================================

    // =============================================
    // Interaction Handlers
    // =============================================
    const handleTabs = async (tab) => {
        const tables = {
            seefa_reporting: {
                url: paths.SEEFA_REPORTING,
                include: "seefa_error_decoder",
                columns: [
                    {
                        field: 'id',
                        headerName: 'ID',
                        width: 60,
                        type: 'number'
                    },
                    {
                        field: 'epr',
                        headerName: 'EPR',
                        width: 120
                    },
                    {
                        field: 'epr_job_type',
                        headerName: 'Job Type',
                        width: 120
                    },
                    {
                        field: 'product',
                        headerName: 'Product',
                        width: 150
                    },
                    {
                        field: 'cid',
                        headerName: 'CID',

                    },
                    {
                        field: 'qualified',
                        headerName: 'Qualified',
                        width: 80,
                        type: 'boolean'
                    },
                    {
                        field: 'summary',
                        headerName: 'Summary',
                    },
                    {
                        field: 'error_name',
                        headerName: 'Error Name',
                    },
                    {
                        field: 'error_message',
                        headerName: 'Error Message',
                        width: 600,
                    },
                    {
                        field: 'error_create_date',
                        headerName: 'Error Create Date',
                        width: 150,
                        type: 'date'
                    },
                    {
                        field: 'workstream',
                        headerName: 'Workstream',
                    },
                    // One to one
                    {
                        field: 'seefa_error_decoder.id',
                        headerName: 'Error ID',
                        type: 'number'
                    },
                    {
                        field: 'seefa_error_decoder.microservice',
                        headerName: 'Microservice'
                    },
                    {
                        field: 'seefa_error_decoder.error_regex',
                        headerName: 'Error Regex'
                    },
                    {
                        field: 'seefa_error_decoder.error_type',
                        headerName: 'Error Type'
                    },
                    {
                        field: 'seefa_error_decoder.manual_resolution',
                        headerName: 'Manual Resolution'
                    },
                    {
                        field: 'seefa_error_decoder.jira_id',
                        headerName: 'Jira ID'
                    },
                    {
                        field: 'seefa_error_decoder.total_occurrences',
                        headerName: 'Total Occurrences',
                        type: 'number'
                    },
                    {
                        field: 'seefa_error_decoder.last_occurrence_date',
                        headerName: 'Last Occurrence Date' ,
                        type: 'date'
                    },
                    {
                        field: 'seefa_error_decoder.last_edited_by',
                        headerName: 'Last Edited By'
                    },
                    {
                        field: 'seefa_error_decoder.last_edited',
                        headerName: 'Last Edited',
                        type: 'dateTime'
                    },
                    {
                        field: 'seefa_error_decoder.owner',
                        headerName: 'Owner'
                    },
                    {
                        field: 'seefa_error_decoder.error_status',
                        headerName: 'Error Status'
                    },
                     {
                        field: 'seefa_error_decoder.seefa_comments',
                        headerName: 'SEEFA Comments'
                    },
                    {
                        field: 'seefa_error_decoder.developer_comments',
                        headerName: 'Developer Comments'
                    },
                ],
                tableButtons: 'fxv', // keycloakUser?.user_roles?.includes('admin') ? 'cedx' : 'x'
                initialState: {
                    sorting: {
                        sortModel: [
                            {field: 'seefa_error_decoder.id', sort: 'asc'}
                        ]
                    },
                },
            },
            seefa_error_decoder: {
                url: paths.SEEFA_ERROR_DECODER,
                include: '',
                columns: [
                    {
                        field: 'id',
                        headerName: 'Error ID',
                        formControl: 'hidden',
                        type: 'number'
                    },
                    {
                        field: 'jira_id',
                        headerName: 'Jira ID',
                        renderCell: ({ row }) => <a href={row.jira_id} target="_blank">{row.jira_id}</a>,
                    },
                    {
                        field: 'error_regex',
                        headerName: 'Error Regex',
                        formControl: keycloakUser.user_roles.includes('developer') ? '' : 'disabled'
                    },
                    {
                        field: 'total_occurrences',
                        headerName: 'Total Occurrences',
                        formControl: 'disabled',
                        type: 'number'
                    },
                    {
                        field: 'last_occurrence_date',
                        headerName: 'Last Occurrence Date',
                        formControl: 'disabled',
                        type: 'date'
                    },
                    {
                        field: 'owner',
                        headerName: 'Owner',
                        type: 'select',
                        options: [
                            {label: 'CSI', value: 'CSI'},
                            {label: 'EXPO', value: 'EXPO'},
                            {label: 'Design Automation', value: 'Design Automation'},
                            {label: 'Provisioning Automation', value: 'Provisioning Automation'},
                            {label: 'Compliance Automation', value: 'Compliance Automation'},
                            {label: 'SENSE', value: 'SENSE'},
                        ]
                    },
                    {
                        field: 'microservice',
                        headerName: 'Microservice',
                        type: 'select',
                        options: [
                            {label: 'ARDA', value: 'ARDA'},
                            {label: 'BEORN', value: 'BEORN'},
                            {label: 'PALANTIR', value: 'PALANTIR'},
                            {label: 'Any', value: 'Any'},
                            {label: 'N/A', value: 'N/A'},
                        ]
                    },
                    {
                        field: 'error_type',
                        headerName: 'Error Type',
                        type: 'select',
                        options: [
                            {label: 'Event', value: 'Event'},
                            {label: 'Manual Data Entry', value: 'Manual Data Entry'},
                            {label: 'Prod Code Release Error', value: 'Prod Code Release Error'},
                            {label: 'Timeout', value: 'Timeout'},
                        ]
                    },
                    {
                        field: 'error_status',
                        headerName: 'Error Status',
                        type: 'select',
                        options: [
                            {label: 'Discovery', value: 'Discovery'},
                            {label: 'Work in Progress', value: 'Work in Progress'},
                            {label: 'Backlog', value: 'Backlog'},
                            {label: 'Resolved', value: 'Resolved'},
                        ],
                    },
                    {
                        field: 'example_error',
                        headerName: 'Example Error',
                        formControl: keycloakUser.user_roles.includes('developer') ? '' : 'disabled'
                    },
                    {
                        field: 'manual_resolution',
                        headerName: 'Manual Resolution',
                    },
                    {
                        field: 'seefa_comments',
                        headerName: 'SEEFA Comments',
                    },
                    {
                        field: 'developer_comments',
                        headerName: 'Developer Comments',
                        formControl: keycloakUser.user_roles.includes('developer') ? '' : 'disabled'
                    },

                    {
                        field: 'last_edited_by',
                        headerName: 'Last Edited By',
                        formControl: 'disabled',
                    },
                    {
                        field: 'last_edited',
                        headerName: 'Last Edited',
                        formControl: 'disabled',
                        renderCell: ({ row }) => row.last_edited?.length ? row.last_edited.replace('T', ' ').replace(/\..*$/, '') + ' UTC' : null
                    },
                ],
                tableButtons: keycloakUser?.user_roles?.includes('developer') ? 'cedfxv' : 'efx',
                initialState: {
                    sorting: {
                        sortModel: [
                            {field: 'id', sort: 'asc'}
                        ]
                    },
                },
                onUpdate: (values) => {
                    return {
                        ...values,
                        last_edited: new Date().toISOString(),
                        last_edited_by: keycloakUser?.data?.username
                    }
                }
            }
        }

        setTabsStates({ [tab]: true })
        setTableState(state => tables[tab])
    };

    const tablesHandler = () => <CustomTable {...tableState} />

    // =============================================
    // Effects
    // =============================================
    useEffect(() => {
        if (!tabs) handleTabs('seefa_reporting')
        else tabs === 0
            ? handleTabs('seefa_reporting')
            : handleTabs('seefa_error_decoder')
    }, [tabs]);

    // =============================================
    // Return
    // =============================================
    return (
        <ToolWrapper
            containerWidth={false} // removes any left and right padding
            titleElement="SEEFA Error Reporting"
            tabDefinitions={[
                { label: 'SEEFA Errors' },
                { label: 'SEEFA Error Decoder' },
            ]}
            inputElement={
                <>
                    {tabsStates?.seefa_reporting && tablesHandler()}
                    {tabsStates?.seefa_error_decoder && tablesHandler()}
                </>
            }
        />
    );
};

export default SeefaReporting;
