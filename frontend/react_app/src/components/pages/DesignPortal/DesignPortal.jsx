/* eslint no-use-before-define: 0 */

// Packages
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import { Alerts } from '../../common'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '../../../store'
import { useKeycloakUser } from '../../hooks/useKeycloakUser'

import {
    Alert,
    Box,
    Button,
    Chip,
    DialogActions,
    DialogContent,
    Divider,
    Fab,
    Grid,
    Link,
    List,
    ListItem,
    ListItemText,
    Stack,
    Tooltip,
    Typography
} from '@mui/material'

import HomeIcon from '@mui/icons-material/Home'
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save'
import PublishIcon from '@mui/icons-material/Publish'
import BusinessIcon from '@mui/icons-material/Business'
import CloseIcon from '@mui/icons-material/Close'
import HelpIcon from '@mui/icons-material/Help'

import { BootstrapDialog, BootstrapDialogTitle } from '../../common/forms/CustomModal'
import {
    getGraniteUrl,
    getSalesforceUrl,
    isValidMSProductFamily
} from './helpers'

import {
    infoTab,
    managedNetworkEdgeTab,
    policyAndObjectsTab,
    vpnTab,
    usersTab,
    managedNetworkSwitchTab,
    managedNetworkWifiTab,
    managedNetworkCameraTab,
    managedNetworkIotTab
} from './tabs'

// Components
import { NewToolWrapper, SearchInput, CustomTable } from '../../common'
import QuickLinks from './customComponents/QuickLinks'
import DesignComplete from './customComponents/DesignComplete'

import './DesignPortal.scss'


function DesignPortal() {
    const { checkUserRoles, keycloakUser } = useKeycloakUser()
    const dispatch = useDispatch()
    const [userHasWriteAccess, setUserHasWriteAccess] = useState(checkUserRoles('design_portal_rw'))

    const testOrders = ['ENG-02620462']
    const [activeOrder, setActiveOrder] = useState()
    const [loadingOrder, setLoadingOrder] = useState(false)
    const {designPortalData} = useSelector(state => state.globalStates)
    const [formData, setFormData] = useState()
    const [manualConfigRequired, setManualConfigRequired] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const [tabs, setTabs] = useState([])
    const [secondaryInfo, setSecondaryInfo] = useState()
    const [buttons, setButtons] = useState([])
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [createModalValues, setCreateModalValues] = useState()
    const [createModalDuplicateWarning, setCreateModalDuplicateWarning] = useState(false)

    // QuickLinks
    const [isQuickLinksPopoverOpen, setIsQuickLinksPopoverOpen] = useState(false)
    const quickLinksAnchorRef = useRef()

    // Submit Design Complete
    const [designCompleteFormOpen, setDesignCompleteFormOpen] = useState(false)
    const handleDesignCompleteFormClose = () => setDesignCompleteFormOpen(false)

    // For secret fields
    const [showSecret, setShowSecret] = React.useState({}) 
    const handleClickShowSecret = (id) => setShowSecret(old => ({ ...old, [id]: !old[id] }))
    const handleMouseDownSecret = (event) => event.preventDefault()

    // Changing orders
    const checkForUnsavedChanges = () => designPortalData ? JSON.stringify(formData) != JSON.stringify(designPortalData.eset.dp_site_detail) : false
    function changeActiveOrder(data){
        if (
            !activeOrder || // For returning to DP after having an order loaded
            (!checkForUnsavedChanges() || confirm('There are unsaved changes!\n\nAre you sure you wish to continue?'))
        ) {

            setActiveOrder(data)
            return true
        } 
        else {
            return false
        }
    }

    const mainTab = (
        <>
            <Box m={1}>
                <SearchInput
                    label="Search Database"
                    url='/api/design_portal/search?q={query}'
                    getOptionLabel={(option) => {
                        return `${option.cid} ${option.epr} ${option['dp_site.address']}`}
                    }
                    renderOption={(props, option) => (
                        <Stack direction="row" spacing={1} {...props} onClick={() => changeActiveOrder(option)}>
                            <div>{option['dp_site.customer_name']}</div>
                            <Chip variant="outlined" size="small" label={option.cid}/>
                            <Chip label={option['dp_site.address']} size="small"/>
                            <Chip variant="outlined" label={option.product} size="small"/>
                        </ Stack>
                    )}
                />
            </Box>

            <CustomTable
                key='mainTable'
                url='/api/design_portal/table/dp_order'
                columns={[
                    {
                        field: 'dp_site.customer_name',
                        headerName: 'Customer',
                        association: {
                            table: 'dp_site',
                            display: 'customer_name'
                        },
                        width: 450
                    },
                    {
                        field: 'dp_site.address',
                        headerName: 'Address',
                        association: {
                            table: 'dp_site',
                            display: 'address'
                        },
                        width: 275
                    },
                    {
                        field: 'dp_site.clli',
                        headerName: 'CLLI',
                        association: {
                            table: 'dp_site',
                            display: 'clli'
                        },
                        width: 100
                    },
                    {
                        field: 'epr',
                        headerName: 'EPR',
                        width: 130
                    },
                    {
                        field: 'cid',
                        headerName: 'Circuit ID',
                        width: 175
                    },
                    {
                        field: 'product',
                        headerName: 'Product',
                        width: 200
                    },
                    {
                        field: 'status',
                        headerName: 'Status',
                        width: 120
                    },
                ]}
                onRowDoubleClick={({row}) => changeActiveOrder(row)}
                loading={loadingOrder}
                tableButtons={'fx'}
            />
        </>
    )

    const loadOrderData = async () => {
        dispatch(actions.setLoadingDesignPortalOrder(true))
        setLoadingOrder(true)

        const orderData = (await axios.get(`/api/design_portal/orders?epr=${activeOrder.epr}`)).data

        // Checks
        const checks = (await axios.get('/api/design_portal/design_complete_checks?id=' + orderData.eset.dp_site.id)).data
        setManualConfigRequired(
            Object.entries(
                checks.manual_config_req
            ).filter(([key, val]) => val).map(([key,]) => key)
        )

        dispatch(actions.setDesignPortalData(orderData))

        dispatch(actions.setDesignPortalAttachmentList(orderData.salesforce.attachments))        

        setFormData(orderData.eset?.dp_site_detail || {})
        setLoadingOrder(false)
        dispatch(actions.setLoadingDesignPortalOrder(false))
    }

    function createButton(){
        setCreateModalOpen(true)
    }

    function createOrOpenOrder(){
        if (!createModalValues) return
        
        // Kinda buggy here might want to hide create button while an order is open
        setTabs([])

        // Need to determine form_schema_id
        changeActiveOrder({ epr: createModalValues.Name, product: createModalValues.Product_Family__c })
        setCreateModalOpen(false)
        setCreateModalValues()
        setCreateModalDuplicateWarning(false)
    }

    async function editButton(){
        console.log('saving data', { epr: activeOrder.epr, data: formData })

        const response = await axios.put(`/api/design_portal/table/dp_site_detail?id=${designPortalData.eset.dp_site_detail.id}`, formData)

        setShowSecret({}) // Reset secret fields to false

        // Resets save button
        dispatch(actions.setDesignPortalData({
            ...designPortalData,
            eset: {
                ...designPortalData.eset,
                dp_site_detail: formData
            }
        }))

        console.log(response)
    }


    function checkIfUserHasWriteAccess(){
        return checkUserRoles('design_portal_rw') && (
            testOrders.includes(activeOrder?.epr) ||
            activeOrder?.product != 'all'
        )
    }
    

    function loadFullSite(newOrder={}){
        setLoadingOrder(true)
        setActiveOrder(old => ({...old, ...newOrder, product: 'all'}))
    }

    async function closeButton(){
        if (changeActiveOrder()) {
            dispatch(actions.setDesignPortalData(null))
            dispatch(actions.setDesignPortalAttachmentList([]))
            setFormData()
            setTabs([])
            setSecondaryInfo()
        }
    }

    function updateButtons(){
        const hasUnsavedChanges = checkForUnsavedChanges()
        const designCompleteDisabled = 
            designPortalData?.eset?.dp_order?.status == 'Design Complete' ||
                hasUnsavedChanges || 
                !checkIfUserHasWriteAccess()

        setButtons(
            checkUserRoles('design_portal_rw')
                ? !activeOrder
                    ? [ 
                        <Tooltip placement="left" ref={quickLinksAnchorRef} title="Quick Links"><Fab color="primary" onClick={() => setIsQuickLinksPopoverOpen(true)}><HelpIcon /></Fab></Tooltip>,
                        <Tooltip placement="left" title="Create"><Fab color="primary" onClick={createButton}><AddIcon /></Fab></Tooltip>,
                    ]
                    : [
                        <Tooltip placement="left" ref={quickLinksAnchorRef} title="Quick Links"><Fab color="primary" onClick={() => setIsQuickLinksPopoverOpen(true)}><HelpIcon /></Fab></Tooltip>,
                        <Tooltip placement="left" title="Create"><Fab color="primary" onClick={createButton}><AddIcon /></Fab></Tooltip>,
                        ...hasUnsavedChanges
                            ? [<Tooltip placement="left" title="Save"><Fab onClick={editButton}><SaveIcon/></Fab></Tooltip>]
                            : [],
                        <Tooltip placement="left" title="Design Complete"><Fab disabled={designCompleteDisabled || activeOrder?.product == 'all'} onClick={() => setDesignCompleteFormOpen(true)}><PublishIcon /></Fab></Tooltip>,
                        <Tooltip placement="left" title="Load full site"><Fab onClick={loadFullSite} disabled={activeOrder?.product == 'all'}><BusinessIcon /></Fab></Tooltip>,
                        <Tooltip placement="left" title="Close"><Fab onClick={closeButton}><CloseIcon /></Fab></Tooltip>,
                    ]
                : !activeOrder
                    ? [
                        <Tooltip placement="left" ref={quickLinksAnchorRef} title="Quick Links"><Fab color="primary" onClick={() => setIsQuickLinksPopoverOpen(true)}><HelpIcon /></Fab></Tooltip>,
                    ]
                    : [
                        <Tooltip placement="left" ref={quickLinksAnchorRef} title="Quick Links"><Fab color="primary" onClick={() => setIsQuickLinksPopoverOpen(true)}><HelpIcon /></Fab></Tooltip>,
                        <Tooltip placement="left" title="Load full site"><Fab onClick={loadFullSite} disabled={activeOrder?.product == 'all'}><BusinessIcon /></Fab></Tooltip>,
                        <Tooltip placement="left" title="Close"><Fab color="primary" onClick={closeButton}><CloseIcon /></Fab></Tooltip>,
                    ]
        )
    }

    function loadTabs() {
        if (!designPortalData) return

        // Build form tabs
        const tabs = 
            {
                'Managed Network Edge': [
                    managedNetworkEdgeTab,
                    policyAndObjectsTab,
                    vpnTab,
                    usersTab
                ],
                'Managed Network Switch': [managedNetworkSwitchTab],
                'Managed Network WiFi': [managedNetworkWifiTab],
                'Managed Network Camera': [managedNetworkCameraTab],
                'Managed Network Additional': [managedNetworkIotTab],
                'Managed Network IoT Sensor': [managedNetworkIotTab],
                'all': [
                    managedNetworkEdgeTab,
                    policyAndObjectsTab,
                    vpnTab,
                    usersTab,
                    managedNetworkSwitchTab,
                    managedNetworkWifiTab,
                    managedNetworkCameraTab,
                    managedNetworkIotTab
                ]
            }
                ?.[activeOrder.product]
                ?.map(tab => tab(designPortalData, formData, setFormData, userHasWriteAccess))
            || []

        setTabs([ 
            infoTab({designPortalData, setDesignPortalData: newData => dispatch(actions.setDesignPortalData(newData)), formData, setFormData, keycloakUser, userHasWriteAccess, loadFullSite, loadingOrder, activeOrder, changeActiveOrder}),
            ...tabs
        ])
    }

    useEffect(() => {
        if (designPortalData) changeActiveOrder(designPortalData.eset.dp_order)
    }, [])

    useEffect(() => {
        updateButtons()

        if (!formData) return
        loadTabs()
    }, [formData, showSecret])

    useEffect(() => {
        setUserHasWriteAccess(checkIfUserHasWriteAccess())
        updateButtons()

        if (!activeOrder) return
        
        loadOrderData()
    }, [activeOrder])

    useEffect(() => {
        async function checkForExistingOrders() {
            if (!createModalValues) return
 
            const response = (await axios.get(`/api/design_portal/table/dp_order?columns=epr&filter=epr=${createModalValues.Name}`)).data?.data

            // Using !! to short hand evaluate as boolean
            setCreateModalDuplicateWarning(!!response?.length)
        }

        checkForExistingOrders()
    }, [createModalValues])

    function closeCreateModal(){
        setCreateModalValues()
        setCreateModalOpen(false)
        setCreateModalDuplicateWarning(false)
    }

    useEffect(() => {
        if (!designPortalData) return
        // <Alert severity="info">Manual configuration is required for this site</Alert>
        setSecondaryInfo(
            <Grid container spacing={1}>
                <Grid item xs={12} md={8}>
                    <List dense={true}>
                        <ListItem>
                            <Typography variant="h5">{designPortalData.eset.dp_site.customer_name}</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>{designPortalData.eset.dp_site.address}</Typography>
                        </ListItem>
                        { 
                            activeOrder?.product != 'all' && 
                            [
                                <ListItem style={{marginTop: '-4px', marginBottom: '-4px'}}>
                                    <Typography>
                                        <Link href={getSalesforceUrl(designPortalData.salesforce.Id)} target="_blank">
                                            {designPortalData.salesforce.Name}
                                        </Link>
                                    </Typography>
                                    <Chip 
                                        style={{marginLeft: '10px'}}
                                        label={designPortalData.eset.dp_order.product}
                                        variant='outlined'
                                    />
                                    <Chip 
                                        style={{marginLeft: '10px'}} 
                                        color={{
                                            'Design Complete': 'primary',
                                            'Install Complete': 'primary',
                                            'Design Failed': 'error'
                                        }[designPortalData.eset.dp_order.status] || 'default'}
                                        label={designPortalData.eset.dp_order.status}
                                    />
                                </ListItem>,
                                <ListItem>
                                    <Typography>
                                        {
                                            !designPortalData.granite
                                                ? designPortalData.eset.dp_order.cid
                                                : (
                                                    <Link href={getGraniteUrl(designPortalData.granite.CIRC_PATH_INST_ID)} target="_blank">
                                                        {designPortalData.eset.dp_order.cid}
                                                    </Link>
                                                )
                                        } 
                                    </Typography>
                                </ListItem>
                            ]
                        }
                    </List>
                </Grid>
                <Grid item xs={12} md={4}>
                    <List dense={true}>
                        <ListItem dense={true}>
                            <Typography>{"Point of Contact"}</Typography>
                        </ListItem>
                        <Divider />
                        <ListItem dense={true}>
                            <Typography>{designPortalData.salesforce.Technical_Contact_Name_lookup__r?.Contact_Full_Name__c}</Typography>
                        </ListItem>
                        <ListItem dense={true}>
                            <Typography>{designPortalData.salesforce.Technical_Contact_Name_lookup__r?.Email}</Typography>
                        </ListItem>
                        <ListItem dense={true}>
                            <Typography>{designPortalData.salesforce.Technical_Contact_Name_lookup__r?.Phone}</Typography>
                        </ListItem>
                    </List>
                </Grid>
                {
                    manualConfigRequired.length > 0 &&
                    <Grid item xs={12}>
                        <Alert severity="info" style={{marginTop: '-10px', borderRadius: '0'}}>{`Manual configuration required (${manualConfigRequired.join(', ') })`}</Alert>
                    </Grid>
                }
            </Grid>
            
        )
    }, [designPortalData])

    const createModal = (
        <BootstrapDialog
                onClose={closeCreateModal}
                aria-labelledby="customized-dialog-title"
                open={createModalOpen}
                fullWidth={true}
                width={600}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={closeCreateModal}>
                    New Order
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Stack spacing={1}>
                        <SearchInput
                            label="Search Salesforce"
                            url="/api/salesforce/search?q={query}"
                            getOptionLabel={(option) => option.Name}
                            renderOption={(props, option) => (
                                <Stack direction="row" spacing={1} {...props}>
                                    <div>{option.Name}</div>
                                    <Chip variant="outlined" size="small" label={option.Circuit_ID2__c}/>
                                    <Chip label={option.Billing_Account__c} size="small"/>
                                </ Stack>
                            )}
                            additionalOptionsFilter={(options) => options.filter(i => isValidMSProductFamily(i.Product_Family__c))}
                            onChange={(event, option) => setCreateModalValues(option)}
                        />

                        {createModalDuplicateWarning && <Alert style={{ width: '100%' }} severity="warning">A Design Portal record for this EPR already exists!</Alert>}
                        { createModalValues && (
                            <List dense={true}>
                                <ListItem>{`${createModalValues.Name} (${createModalValues.Product_Family__c})`}</ListItem>
                                <ListItem>{createModalValues.Billing_Account__c}</ListItem>
                                <ListItem>{createModalValues.Service_Location_Address__c}</ListItem>
                                <ListItem>{createModalValues.Circuit_ID2__c}</ListItem>
                            </List>
                        )}
                    </Stack>
                    
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={createOrOpenOrder}>
                    { createModalDuplicateWarning ? 'Open' : 'Create' }
                    </Button>
                </DialogActions>
            </BootstrapDialog>
    )

    // Render
    return (
        <>
            <NewToolWrapper
                titleElement='Design Portal'
                secondaryTitleElement={secondaryInfo}
                tabDefinitions={[
                    { label: <HomeIcon />, content: mainTab },
                    ...tabs
                ]}
            />
            {createModal}
            <QuickLinks 
                anchorRef={quickLinksAnchorRef}
                isPopoverOpen={isQuickLinksPopoverOpen}
                setIsPopoverOpen={setIsQuickLinksPopoverOpen}
            />
            <DesignComplete 
                    formOpen={designCompleteFormOpen}
                    handleClose={handleDesignCompleteFormClose}
                    designPortalData={designPortalData}
                    setDesignPortalData={newData => dispatch(actions.setDesignPortalData(newData))}
                    setFormData={setFormData}
            />
            <Stack  
                spacing={1} 
                style={{ 
                    position:'fixed',
                    right:0,
                    top:0,
                    marginRight: '2.5%',
                    marginTop: '180px'
                }} 
            >
                {buttons}
            </Stack>
            <Alerts />
        </>
    )
}

export default DesignPortal
