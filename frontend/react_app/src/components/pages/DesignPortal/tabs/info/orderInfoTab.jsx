import CedtSection from '../../customComponents/cedt/CedtSection'
import { BasicCategoryTable } from '../../../../common'

import { generateSections } from '../../generateForm'

export default function infoTab({
    designPortalData,
    setDesignPortalData,
    formData,
    setFormData,
    userHasWriteAccess,
    keycloakUser
}) {
    return {
        label: 'Order Info',
        content: generateSections([
            {
                label: 'CEDT',
                fields: [
                    {
                        sm: 12,
                        content: <CedtSection designPortalData={designPortalData} setDesignPortalData={setDesignPortalData} username={keycloakUser.data.username}/>
                    }
                ]
            },
            {
                label: 'Granite',
                fields: [
                    {
                        sm: 12,
                        content: !designPortalData.granite
                            ? 'Circuit not found in Granite'
                            : <BasicCategoryTable data={designPortalData.granite} />
                    }
                ]
            },
            {
                label: 'Salesforce',
                fields: [
                    {
                        sm: 12,
                        content: <BasicCategoryTable data={designPortalData.salesforce} />
                    }
                ]
            },
        ])
    }

}