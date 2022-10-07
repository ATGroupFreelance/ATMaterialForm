import React from 'react';

import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox';

const CheckBox = ({ _formProps_, id, onChange, value, helperText, ...restProps }) => {
    const internalOnChange = (event) => {
        if (onChange)
            onChange({ target: { value: event.target.checked } })
    }

    return <FormControlLabel
        sx={{ width: '100%' }}
        value="top"
        control={<Checkbox />}
        onChange={internalOnChange}
        checked={value}
        {...restProps}
    />

}

export default CheckBox;