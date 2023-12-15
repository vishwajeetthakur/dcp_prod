import {
    Paper,
    Box,
    FormControl,
    Grid,
    Typography
} from '@mui/material'

export function generateSections(arrayOfSections) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid
                // Section container
                container
                spacing={{ xs: 2, md: 3 }}
                justifyContent="center"
                alignItems="flex-start"
            >
                {
                    arrayOfSections.map((section) => (
                        <Grid item style={{ minWidth: '50%', width: '75%', ...section.style }}>
                            <Paper elevation={11} sx={{ marginBottom: '1rem', padding: '1rem' }}>
                                <Typography variant="h5">{section.label}</Typography>
                                {generateForm(section.fields)}
                            </Paper>
                        </Grid>
                    ))
                }
            </Grid>
        </Box>

    )
}


export default function generateForm(fields) {
    return (
        <Grid
            // Form container
            // component="form"
            container
            spacing={2}
            justifyContent="center"
            alignItems="flex-start"
            mt={0.5}
        >
            {fields.map((field) => (field.type == 'table'
                ? (
                    <Grid item sm={12} style={{ width: '100%' }}>
                        {field.content}
                    </Grid>
                ) : (
                    <Grid item sm={field.sm || 6}>
                        <FormControl key={field.id} sx={{ width: '100%' }}>
                            {field.content}
                        </FormControl>
                    </Grid>
                )
            ))}
        </Grid>
    )
}

