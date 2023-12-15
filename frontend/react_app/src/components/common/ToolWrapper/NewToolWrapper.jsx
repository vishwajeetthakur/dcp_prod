// Packages
import React, { useState, useEffect } from 'react'
import { Box, CircularProgress, Container, Typography, Tabs, Tab } from '@mui/material'

// Components
import { Alerts } from '..'


// Hooks

// Utils

// Types

// Styles
import {
    OuterContentPaper,
    PrimaryTitleBox
} from '../styled.components'
import './ToolWrapper.scss'


const NewToolWrapper =
    ({
        titleElement,
        secondaryTitleElement,
        tabDefinitions = [],
        content = 'Empty content, please include the key "content" to ToolWrapper or the ToolWrapper tabDefinitions',
        containerStyle = {maxWidth: '90%'},
        isLoading = false,
        response = null
    }) => {
        function formatTabDefinitions(data, layer=0) {
            return data
                // Add uuid if id is not provided
                .map((tab, index) => {
                    const secondaryTabs = 
                        tab?.secondaryTabs 
                            ? { secondaryTabs: formatTabDefinitions(tab.secondaryTabs, layer + 1) }
                            : {}

                    return {
                        // id: uuidv4(), 
                        id: `${tab?.label}.${layer}.${index}`,
                        ...tab,
                        ...secondaryTabs
                    }
                })
                .reduce((acc, tab) => ({
                    ...acc,
                    [tab.id]: tab
                }), {})
        }
        
        const [_tabDefinitions, setTabDefinitions] = useState(formatTabDefinitions(tabDefinitions))

        const [activeTab, setActiveTab] = useState(Object.keys(_tabDefinitions)[0])
        const [secondaryActiveTab, setSecondaryActiveTab] = useState()

        // First load set tab definitions and active tab
        useEffect(() => {
            if (!tabDefinitions.length) return

            const newTabDefinitions = formatTabDefinitions(tabDefinitions)

            setTabDefinitions(newTabDefinitions)
            setActiveTab(Object.keys(newTabDefinitions)[0])
        }, [])

        // When tabDefinitions is changed, update the tab definitions but keep the same active tab
        useEffect(() => {
            if (!tabDefinitions.length) return

            const newTabDefinitions = formatTabDefinitions(tabDefinitions)
            const firstTab = Object.keys(newTabDefinitions)[0]
            const firstSecondaryTab = newTabDefinitions[firstTab]?.secondaryTabs ? Object.keys(newTabDefinitions[firstTab]?.secondaryTabs)?.[0] : null

            if (!Object.keys(newTabDefinitions).includes(activeTab)) setActiveTab(firstTab)

            if (!Object.keys(newTabDefinitions?.[activeTab]?.secondaryTabs || {}).includes(secondaryActiveTab)){
                setSecondaryActiveTab(
                    newTabDefinitions[activeTab]?.secondaryTabs
                        ? firstSecondaryTab
                        : null
                )
            }

            setTabDefinitions(formatTabDefinitions(tabDefinitions))

        }, [tabDefinitions])

        // When active tab is changed, set secondary tab to first secondary tab
        useEffect(() => {
            if (!tabDefinitions.length) return

            if (_tabDefinitions[activeTab]?.secondaryTabs) {
                setSecondaryActiveTab(Object.keys(_tabDefinitions[activeTab].secondaryTabs)[0])
            }
        }, [activeTab])

        function renderContent(content) {
            return typeof content == 'function' ? content() : content
        }

        return (
            <>
                <Container style={containerStyle}>

                    <OuterContentPaper elevation={14}>
                        {titleElement && (
                            <PrimaryTitleBox>
                                {typeof (titleElement) === 'string'
                                    ? <Typography variant="h3" children={titleElement} />
                                    : titleElement
                                }
                            </PrimaryTitleBox>
                        )}
                        {secondaryTitleElement && (
                            <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
                                {typeof (secondaryTitleElement) === 'string'
                                    ? <Typography variant="h3" children={secondaryTitleElement} />
                                    : secondaryTitleElement
                                }
                            </Box>
                        )}
                            {
                                Object.keys(_tabDefinitions).length > 0
                                    ? (
                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                <Tabs variant="scrollable" scrollButtons="auto" value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)}>
                                                    {
                                                        Object.values(_tabDefinitions)
                                                        .map(({ id, label, disabled }) => (
                                                            <Tab label={label} id={id} key={id} value={id} disabled={disabled ? disabled : false} sx={{ display: disabled ? 'none' : 'flex' }} />
                                                        ))
                                                    }
                                                </Tabs>
                                            </Box>
                                            {
                                                // Secondary tabs
                                                (_tabDefinitions[activeTab]?.secondaryTabs)
                                                    ?   <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                            <Tabs variant="scrollable" scrollButtons="auto" value={secondaryActiveTab} onChange={(event, newValue) => setSecondaryActiveTab(newValue)}>
                                                                {
                                                                    Object.values(_tabDefinitions[activeTab].secondaryTabs)
                                                                        .map(({ id, label }) => (
                                                                            <Tab label={label} id={id} key={id} value={id} />
                                                                        ))
                                                                }
                                                            </Tabs>
                                                        </Box>
                                                    : null
                                                    
                                            }
                                        </Box>
                                        
                                    )
                                    : null
                            }

                        {
                            isLoading
                                ? (
                                    <Box sx={{ textAlign: 'center', width: '100%', mt: 6 }}>
                                        <CircularProgress />
                                    </Box>
                                )
                                : Object.keys(_tabDefinitions).length == 0 
                                    ? renderContent(content)
                                    : _tabDefinitions[activeTab]?.secondaryTabs
                                        ? renderContent(_tabDefinitions[activeTab].secondaryTabs?.[secondaryActiveTab]?.content)
                                        : renderContent(_tabDefinitions[activeTab]?.content)

                        }

                    </OuterContentPaper>
                    {response ? response : null}
                </Container>
                <Alerts />
            </>
        );
    };

export default NewToolWrapper;