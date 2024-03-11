import React from 'react';

import TextField from '@mui/material/TextField';

const TextBox = ({ _formProps_, id, TextBox, readOnly, InputProps,...restProps }) => {

    return <TextField fullWidth={true} InputProps={{readOnly,...(InputProps || {})}} {...restProps} />
}

export default TextBox;