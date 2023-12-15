import * as React from 'react';
import {
    Tooltip,
    // IconButton
} from '@mui/material';

const MuiTooltip = (props) => {
    const IconProp = props.icon;
    return (
        <Tooltip 
        title={props.title}
        arrow
        enterDelay={500}
        leaveDelay={200} placement="top">
            {/* Removed IconButton from here as was throwing an error - button cannot be a child of button */}
            <>
                <IconProp {...props}/>
            </>
        </Tooltip>
    )
}

export default React.memo(MuiTooltip);