import React, { useEffect, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

//Facts about autocomplete:
//If "multiple" is false, value/initvalue must be string or null, if initvalue is set to "" it throws a warning that no match was found
//If "multiple" is true,  value/initvalue must be an array
//If "multiple" is false the out of onChange is an string
//if "multiple" is true the output of onChange is an array
//Option can be like this: 
//['uk', 'us']
//[{label: 'uk'}, {label: 'us'}]
const isFunction = (obj) => {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

const ComboBox = ({ _formProps_, label, options, onChange, autoComplete = 'disabled', error, helperText, ...restProps }) => {
    const [data, setData] = useState([])

    useEffect(() => {
        if (isFunction(options))
            options()
                .then(res => {
                    setData(res)
                })
        else
            setData(options)

    }, [options])

    const onInternalChange = (event, newValue) => {
        if (onChange)
            onChange({ target: { value: newValue } })
    }

    return <Autocomplete
        disablePortal
        fullWidth={true}
        options={data || []}
        onChange={onInternalChange}
        getOptionLabel={(option) => option.Title}
        isOptionEqualToValue={(option, value) => String(option.ID) === String(value.ID)}
        renderInput={(params) => <TextField {...params} error={error} helperText={helperText} label={label} inputProps={{ ...params.inputProps, autoComplete: autoComplete }} />}
        {...restProps}
    />
}

export default ComboBox;