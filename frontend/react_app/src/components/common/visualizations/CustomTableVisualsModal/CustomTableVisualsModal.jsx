// Packages
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import {
    Backdrop, Box, Button, Divider, Fade,
    Modal, Tabs, Tab, Typography
} from '@mui/material'

// Components
import BarChart from '../BarChart'
import LineChart from '../LineChart'
import PieChart from '../PieChart'

import paths from '../../../../paths'


const CustomTableVisualsModal = ({
    open,
    handleClose,
    tableState,
    chartTitle = 'Chart Title',
    chartDescription = 'Chart description.'
}) => {
    // console.log(tableState.data.map(prop => ({
        //     grouping: prop.error_create_date,
        //     total_occurrences: prop.seefa_error_decoder.total_occurrences,
        // })))

    const { data, loading, error } = useQuery('visualizations', () => axios.get(paths.SEEFA_REPORTING_JSON))
    const [tabIndex, setTabIndex] = useState(0)

    const sampleRawData = {
        total: '<total_count_for_all_errors>',
        errors: [
            {
                name: '<error_1_name>',
                total: '<total_count_for_error_1>',
                weekly_data: [
                    {
                        week: '01/01/2022',
                        count: '<total_error_1_count_for_that_week>',
                    },
                    {
                        week: '01/08/2022',
                        count: '<total_error_1_count_for_that_week>',
                    }
                ]
            },
            {
                name: '<error_2_name>',
                total: '<total_count_for_error_2>',
                weekly_data: [
                    {
                        week: '01/01/2022',
                        count: '<total_error_2_count_for_that_week>',
                    },
                    {
                        week: '01/08/2022',
                        count: '<total_error_2_count_for_that_week>',
                    }
                ]
            }
        ]
    }

    console.log('CustomTableVisualsModal data: ', tableState)

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: '1px solid rgba(33, 33,33, 0.4)',
        borderRadius: '8px',
        boxShadow: 24,
        p: 4,
    };

    const tabNames = [
        { label: 'Bar Chart' },
        { label: 'Line Chart' },
        { label: 'Pie Chart' },
    ]

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            BackdropComponent={Backdrop}
        >
            <Box sx={style}>
                <Button variant="contained" color="error" size="small" sx={{ float: 'right' }} onClose={handleClose}>X</Button>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {chartTitle}
                </Typography>
                <Typography id="modal-modal-description" sx={{ my: 2 }} gutterBottom>
                    {chartDescription}
                </Typography>
                <Tabs
                    value={tabIndex}
                    onChange={(e, newValue) => setTabIndex(parseInt(newValue))}
                    variant={'standard'}
                    scrollButtons="auto"
                    aria-label={'modal-tabs'}
                >
                {tabNames.map((tab, i) => (
                    <Tab
                        key={tab?.label ? tab.label : 'tab-' + i}
                        id={i}
                        label={tab?.label ? tab.label : i}
                        sx={{ '&:hover': { backgroundColor: 'rgba(100,100,100,0.1)' }}}
                    />
                ))}
                </Tabs>
                <Divider sx={{ mb: 2 }} />
                {{
                    0: <BarChart
                            // data={tableState.data.map(prop => ({
                            //     grouping: prop.error_create_date,
                            //     total_occurrences: prop.seefa_error_decoder.total_occurrences,
                            // }))}
                        />,
                    1: <LineChart
                            // data={tableState.data.map(prop => ({
                            //     grouping: prop.error_create_date,
                            //     total_occurrences: prop.seefa_error_decoder.total_occurrences,
                            // }))}
                    />,
                    2: <PieChart />,
                }[tabIndex]}
            </Box>
        </Modal>
    )
}

export default CustomTableVisualsModal
