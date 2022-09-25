import React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const CascadeComboBox = ({ _formProps_, label, options, onChange, autoComplete = 'disabled', error, helperText, ...restProps }) => {

    const onInternalChange = (event, newValue) => {
        if (onChange)
            onChange({ target: { value: newValue } })
    }

    return <Autocomplete
        disablePortal
        fullWidth={true}
        options={options || []}
        onChange={onInternalChange}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => <TextField {...params} error={error} helperText={helperText} label={label} inputProps={{ ...params.inputProps, autoComplete: autoComplete }} />}
        {...restProps}
    />
}

export default CascadeComboBox;