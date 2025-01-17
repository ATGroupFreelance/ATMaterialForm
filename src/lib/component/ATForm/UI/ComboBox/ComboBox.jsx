import React, { useEffect, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { isFunction } from '../../FormUtils/FormUtils';
import useATFormProvider from '@/lib/hooks/useATFormProvider/useATFormProvider';

//Facts about autocomplete:
//If "multiple" is false, value/initvalue must be string or null, if initvalue is set to "" it throws a warning that no match was found
//If "multiple" is true,  value/initvalue must be an array
//If "multiple" is false the out of onChange is an string
//if "multiple" is true the output of onChange is an array
//Option can be like this: 
//['uk', 'us']
//[{label: 'uk'}, {label: 'us'}]

const ComboBox = ({ id, atFormProvidedProps, label, options, onChange, autoComplete = 'off', error, helperText, value, getInputProps, ...restProps }) => {
    const { enums } = useATFormProvider()
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
        fullWidth={true}
        options={(options ? data : enums?.[id]) || []}
        onChange={onInternalChange}
        getOptionLabel={(option) => option.title}
        isOptionEqualToValue={(option, value) => String(option.id) === String(value.id)}
        renderInput={(params) => {
            let newInputProps = null

            if (getInputProps)
                newInputProps = getInputProps({ params, value })

            const { InputProps, ...restParams } = params

            return <TextField
                error={error}
                helperText={helperText}
                label={label}
                inputProps={{ ...params.inputProps, autoComplete: autoComplete }}
                InputProps={{ ...InputProps, ...(newInputProps || {}) }}
                {...restParams}
            />
        }
        }
        value={value}
        {...restProps}
    />
}

export default ComboBox;