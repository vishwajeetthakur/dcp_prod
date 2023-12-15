import axios from 'axios'
import FileDownload from 'js-file-download'

import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { actions } from '../../../../store'

import {
    Button,
    Grid,
    IconButton,
    Link,
    CircularProgress
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';

import DeleteIcon from '@mui/icons-material/Delete'
import UploadIcon from '@mui/icons-material/Upload'

export default function AttachmentSection({
    data
}) {

    const dispatch = useDispatch()
    const { designPortalAttachmentList } = useSelector(state => state.globalStates)

    const [isLoading, setIsLoading] = useState(false)

    async function reloadAttachmentList() {
        const response = await axios.get('/api/salesforce/all_attachments?id=' + data.salesforce.Service_Location__r.Service_Location_Record_ID__c)

        dispatch(actions.setDesignPortalAttachmentList(response.data))
        setIsLoading(false)
    }

    async function downloadAttachment(attachmentData) {
        axios({
            url: '/api/salesforce/attachment?id=' + attachmentData.Id,
            method: 'GET',
            responseType: 'blob', // Important
        }).then(response => {
            FileDownload(response.data, attachmentData.Name)
        })
    }

    async function uploadAttachment(event) {
        setIsLoading(true)

        const file = event.target.files[0]

        const formData = new FormData()
        formData.append('file', file)
        formData.append('parentId', data.salesforce.Service_Location__r.Service_Location_Record_ID__c)
        // formData.append('parentId', data.salesforce.Service_Location__r.Id)
        formData.append('isPrivate', true)

        const response = await axios.post('/api/salesforce/attachment', formData)

        reloadAttachmentList()
    }


    async function deleteAttachment(attachmentData) {
        if (confirm(`Are you sure that you want to delete this file?\n\n${attachmentData.Name}`)) {
            const response = await axios.delete('/api/salesforce/attachment?id=' + attachmentData.Id)

            reloadAttachmentList()
        }
    }

    return (
        <Grid container columnSpacing={3} justifyContent="center" alignItems="center">
            {
                designPortalAttachmentList.map(item => (
                    <>
                        <Grid item xs={8} style={{ textAlign: 'right' }}>
                            <Link component="button" underline="none" onClick={() => downloadAttachment(item)}>{item.Name}</Link>
                        </Grid>
                        <Grid item xs={4} style={{ textAlign: 'left' }}>
                            <IconButton onClick={() => deleteAttachment(item)}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </>
                ))
            }
            <Grid item style={{ margin: '15px' }}>
                <LoadingButton loading={isLoading} variant="contained" component="label" endIcon={<UploadIcon />}>
                    Upload
                    <input hidden type="file" onChange={uploadAttachment} />
                </LoadingButton>
            </Grid>
        </Grid>
    )
}