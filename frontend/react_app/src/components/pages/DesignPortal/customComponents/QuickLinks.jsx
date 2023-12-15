import { 
    Box, Link,
    Popover,Stack, Divider,
    Typography
} from '@mui/material'

const QuickLinks = ({anchorRef, isPopoverOpen, setIsPopoverOpen}) => {
    return (
        <Popover
            anchorEl={anchorRef.current}
            open={isPopoverOpen}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            onClose={() => setIsPopoverOpen(false)}
        >
            <Box p={4}>
                <Typography variant="h6" children="Useful Links" gutterBottom />
                <Divider />
                <Stack spacing={1} py={1}>
                    {[
                    { label: 'Salesforce', link: 'https://spectrum-enterprise.my.salesforce.com/' },
                    { label: 'Granite', link: "https://granite-ise.chartercom.com:7533/" },
                    { label: 'Forticloud', link: 'https://login.forticloud.com' },
                    { label: 'Spectrumenterprise.net', link: 'https://spectrumenterprise.net' },
                    { label: 'Dice', link: "https://dice.seek.chtrse.com/dice/mns" },
                    { label: 'Meraki', link: 'https://account.meraki.com/account/account_login' },
                    { label: 'IP Control', link: 'https://ipcontrol.chtrse.com:8443/incontrol/logon.action' },
                    ].map((value, index) => <Typography key={index} component={Link} variant="body1" children={value.label} href={value.link} target="_blank" gutterBottom={index === 3} />)}
                </Stack>

                <Typography variant="h6" children="Documentation" gutterBottom />
                <Divider />
                <Stack spacing={1} py={1}>
                    {[
                    { label: 'docs.fortinet.com', link: 'https://docs.fortinet.com' },
                    { label: 'support.fortinet.com', link: 'https://support.fortinet.com' },
                    ].map((value, index) => <Typography key={index} component={Link} variant="body1" children={value.label} href={value.link} target="_blank" />)}
                </Stack>
                
                <Typography variant="h6" children="Design Portal Ticket Request" gutterBottom />
                <Divider />
                <Stack spacing={1} py={1}>
                    <Typography component={Link} variant="body1" children={'Defect'} onClick={() => window.open('mailto:DL-SENOE-Service-Dev-ESET@charter.com?subject=Design Portal Defect&body=* Please attach a screenshot of the issue with the developer console open (press F12) *%0A%0ASummary: %0APriority: %0AEPR currently open: %0ADescription: ')} sx={{ '&:hover': { cursor: 'pointer' } }} />
                    <Typography component={Link} variant="body1" children={'Enhancement/Feature'} onClick={() => window.open('mailto:DL-SENOE-Service-Dev-ESET@charter.com?subject=Design Portal Enhancement/Feature Request&body=Summary: %0APriority: %0ADescription: ')} sx={{ '&:hover': { cursor: 'pointer' } }} />
                </Stack>
            </Box>
        </Popover>
    )
}

export default QuickLinks
