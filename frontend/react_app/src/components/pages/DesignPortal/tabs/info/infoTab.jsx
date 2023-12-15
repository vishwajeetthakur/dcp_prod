import orderInfoTab from './orderInfoTab'
import customerInfoTab from './customerInfoTab'
import siteInfoTab from './siteInfoTab'

export default function infoTab({
    designPortalData,
    setDesignPortalData,
    formData,
    setFormData,
    keycloakUser,
    userHasWriteAccess,
    loadFullSite,
    loadingOrder,
    activeOrder,
    changeActiveOrder
}) {
    return {
        label: 'Info',
        secondaryTabs: [
            customerInfoTab(designPortalData, formData, setFormData, userHasWriteAccess, loadFullSite, loadingOrder),
            siteInfoTab({designPortalData, setDesignPortalData, formData, setFormData, userHasWriteAccess, changeActiveOrder, loadingOrder}),
            
            ...activeOrder?.product != 'all' 
                ? [orderInfoTab({designPortalData, setDesignPortalData, formData, setFormData, userHasWriteAccess, keycloakUser})] 
                : []
        ]
    }

}