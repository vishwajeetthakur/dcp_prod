export default (render, values) => {
    const defaults = {
        field: 'mnc_video_resolution',
        headerName: 'Video Resolution',
        // Reset video_resolution column on change
        onChange: (newValues, currentValues, handleChange, setValues) => {
            handleChange(newValues)
            setValues(old => ({ ...old, mnc_video_quality: null}))
        }
    }

    switch(true){
        case ['MV21-HW', 'MV71-HW'].includes(values.model):
            return render('ENUM', {
                ...defaults,
                options: [
                    "720p",
                ]
            })
        case ['MV12N-HW', 'MV12W-HW','MV22-HW', 'MV72-HW', 'MV12WE-HW'].includes(values.model):
            return render('ENUM', {
                ...defaults,
                options: [
                    "720p",
                    "1080p"
                ]
            })
        case ['MV22X-HW', 'MV52-HW', 'MV72X-HW'].includes(values.model):
            return render('ENUM', {
                ...defaults,
                options: [
                    "720p",
                    "1080p",
                    "4MP",
                ]
            })
        case values.model == 'MV32-HW':
            return render('ENUM', {
                ...defaults,
                options: [
                    "1080x1080",
                    "2058x2058"
                ]
            })
        default:
            return render('ENUM', {
                ...defaults,
                options: [],
                disabled: true
            })
    }
}