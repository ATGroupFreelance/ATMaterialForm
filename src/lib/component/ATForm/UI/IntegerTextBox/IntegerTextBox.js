import React from 'react';

import TextField from '@mui/material/TextField';

const IntegerTextBox = ({ _formProps_, id, value, onChange, ...restProps }) => {
    const onInternalChange = (event) => {
        const newValue = event.target.value
        let integerValue = null

        if (newValue)
            integerValue = parseInt(newValue)

        if (onChange)
            onChange({ target: { value: integerValue } })
    }

    const newValue = !value && value !== 0 ? "" : value

    return <TextField fullWidth={true} type="number" onChange={onInternalChange} value={newValue} {...restProps} />
}

export default IntegerTextBox;