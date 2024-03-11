import React from 'react';

import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox';

//TODO, add support for read only instead of simply using disable
const CheckBox = ({ _formProps_, id, onChange, value, helperText, color, readOnly, disabled, ...restProps }) => {
    const internalOnChange = (event) => {
        if (onChange)
            onChange({ target: { value: event.target.checked } })
    }

    return <FormControlLabel
        sx={{ width: '100%' }}
        value="top"
        control={
            <Checkbox
                color={color}
            />
        }
        onChange={internalOnChange}
        checked={value}
        disabled={disabled || readOnly}
        {...restProps}
    />

}

export default CheckBox;