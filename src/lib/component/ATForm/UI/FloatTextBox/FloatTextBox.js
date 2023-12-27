import React from 'react';

import TextField from '@mui/material/TextField';
import { convertNoneEnglishNumbers } from '../../FormUtils/FormUtils';

const FloatTextBox = ({ _formProps_, id, value, onChange, ...restProps }) => {

    const onInternalChange = (event) => {
        const newValue = convertNoneEnglishNumbers(event.target.value)
        let integerValue = null

        if (newValue)
            integerValue = Number(newValue)

        if (isNaN(integerValue))
            integerValue = null

        if (onChange)
            onChange({ target: { value: integerValue } })
    }

    const newValue = !value && value !== 0 ? "" : value

    return <TextField
        fullWidth={true}
        type="number"
        onChange={onInternalChange}
        value={newValue}
        onKeyDown={(e) => {
            if (e.key === "e" || e.key === "E" || e.key === "+") {
                e.preventDefault()
            }
        }}
        {...restProps}
    />
}

export default FloatTextBox;