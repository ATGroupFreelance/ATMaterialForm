import React from 'react';

import TextField from '@mui/material/TextField';

var counter = 0
const TextBox = ({ atFormProvidedProps, id, TextBox, readOnly, InputProps,...restProps }) => {
    counter =  counter + 1
    console.log('ATFORM RENDER TextBox', counter)
    return <TextField fullWidth={true} InputProps={{readOnly,...(InputProps || {})}} {...restProps} />
}

export default TextBox;