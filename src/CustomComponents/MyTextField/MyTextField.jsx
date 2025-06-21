import React from 'react';

import TextField from '@mui/material/TextField';

const MyTextField = ({ id, ...restProps }) => {
    void id;

    return <TextField fullWidth={true} {...restProps} />
}

export default MyTextField;