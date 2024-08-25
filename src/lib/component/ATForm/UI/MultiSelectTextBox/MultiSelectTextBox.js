import React, { useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

//Facts about autocomplete:
//If "multiple" is false, value/initvalue must be string or null, if initvalue is set to "" it throws a warning that no match was found
//If "multiple" is true,  value/initvalue must be an array
//If "multiple" is false the out of onChange is an string
//if "multiple" is true the output of onChange is an array
//Option can be like this: 
//['uk', 'us']
//[{label: 'uk'}, {label: 'us'}]

const MultiSelectTextBox = ({ _formProps_, label, onChange, autoComplete = 'disabled', error, helperText, value, ...restProps }) => {
    const [textFieldValue, setTextFieldValue] = useState('')

    const onTextFieldChange = (event) => {
        setTextFieldValue(event.target.value)
    }

    const onChipDeleteClick = (id) => {
        const newValue = value.filter(item => item !== id)

        if (onChange) {
            setTextFieldValue('')
            onChange({ target: { value: newValue } })
        }
    }

    const updateValue = () => {
        const found = value.find(item => item === textFieldValue)
        if (!found && textFieldValue) {
            const newValue = [
                ...value,
                textFieldValue
            ]

            if (onChange) {
                onChange({ target: { value: newValue } })
                setTextFieldValue('')
            }
        }
    }

    const onAutocompleteChange = (event, newValue, reason) => {
        if (event.key === 'Enter')
            return;

        if (reason === 'clear') {
            setTextFieldValue('')
            onChange({ target: { value: [] } })
        }
        else if (reason === 'removeOption') {
            onChange({ target: { value: [...newValue] } })
        }
    }

    return <Autocomplete
        disablePortal
        multiple
        fullWidth={true}
        options={value || []}
        renderTags={(value, getTagProps) =>
            value.map((option, index) => (
                <Chip
                    key={option}
                    variant="outlined"
                    label={option}
                    color={'secondary'}
                    {...getTagProps({ index })}
                    onDelete={() => onChipDeleteClick(option)}
                />
            ))
        }
        renderInput={
            (params) => <TextField
                {...params}
                error={error}
                helperText={helperText}
                label={label}
                onChange={onTextFieldChange}
                value={textFieldValue}
                onBlur={() => {
                    updateValue()
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        updateValue()
                    }
                }}
                inputProps={{ ...params.inputProps, autoComplete: autoComplete }}
            />
        }
        value={value}
        onChange={onAutocompleteChange}
        {...restProps}
    />
}

export default MultiSelectTextBox;