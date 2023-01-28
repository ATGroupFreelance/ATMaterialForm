import React from 'react';

import TextField from '@mui/material/TextField';

const ContainerWithTable = ({ _formProps_, id, ...restProps }) => {


    return <TextField fullWidth={true} {...restProps} />
}

export default ContainerWithTable;