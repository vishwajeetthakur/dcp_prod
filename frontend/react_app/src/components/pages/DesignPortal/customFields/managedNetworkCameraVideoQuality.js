export default (render, values) => {
    const defaults = {
        field: 'mnc_video_quality',
        headerName: 'Video Quality',
    }

    switch(true){
        case ['720p', '4MP', '1080x1080'].includes(values.mnc_video_resolution):
            return render('ENUM', {
                ...defaults,
                options: [
                    'Standard',
                    'Enhanced'
                ]
            })
        case ['1080p', '2058x2058'].includes(values.mnc_video_resolution):
            return render('ENUM', {
                ...defaults,
                options: [
                    'Standard',
                    'Enhanced',
                    'High'
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