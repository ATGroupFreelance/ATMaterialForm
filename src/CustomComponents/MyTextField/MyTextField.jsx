import React from 'react';

import TextField from '@mui/material/TextField';

const MyTextField = ({ atFormProvidedProps, id, ...restProps }) => {

    return <TextField fullWidth={true} {...restProps} />
}

export default MyTextField;