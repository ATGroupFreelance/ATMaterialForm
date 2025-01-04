import React from 'react';

import Typography from '@mui/material/Typography';
import SliderMUI from '@mui/material/Slider';

const Slider = ({ atFormProvidedProps, id, label, error, helperText, ...restProps }) => {
    return <div style={{ width: '100%' }}>
        <Typography>
            {label}
        </Typography>
        <SliderMUI
            valueLabelDisplay="on"            
            {...restProps}
        />
    </div>
}

export default Slider;