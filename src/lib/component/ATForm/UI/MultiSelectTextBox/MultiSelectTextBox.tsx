import { useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { ATFormMultiSelectTextBoxProps } from '@/lib/types/ui/MultiSelectTextBox.type';
//Facts about autocomplete:
//If "multiple" is false, value/initvalue must be string or null, if initvalue is set to "" it throws a warning that no match was found
//If "multiple" is true,  value/initvalue must be an array
//If "multiple" is false the out of onChange is an string
//if "multiple" is true the output of onChange is an array
//Option can be like this: 
//['uk', 'us']
//[{label: 'uk'}, {label: 'us'}]

const MultiSelectTextBox = ({ label, onChange, autoComplete = false, error, helperText, value, ...restProps }: ATFormMultiSelectTextBoxProps) => {
    const [textFieldValue, setTextFieldValue] = useState('')

    const onTextFieldChange = (event: any) => {
        setTextFieldValue(event.target.value)
    }

    const onChipDeleteClick = (id: any) => {
        const newValue = value.filter((item: any) => item !== id)

        if (onChange) {
            setTextFieldValue('')
            onChange({ target: { value: newValue } })
        }
    }

    const updateValue = () => {
        const found = value.find((item: any) => item === textFieldValue)
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

    const onAutocompleteChange = (event: any, newValue: any, reason: any) => {
        if (event.key === 'Enter')
            return;

        if (reason === 'clear') {
            setTextFieldValue('')

            if (onChange)
                onChange({ target: { value: [] } })
        }
        else if (reason === 'removeOption') {
            if (onChange)
                onChange({ target: { value: [...newValue] } })
        }
    }

    return <Autocomplete
        disablePortal
        multiple
        fullWidth={true}
        options={value || []}
        renderTags={(value, getTagProps) =>
            value.map((option, index) => {
                const { key, ...restPropsChip } = getTagProps({ index })
                return <Chip
                    key={key}
                    variant="outlined"
                    label={option}
                    color={'secondary'}
                    {...restPropsChip}
                    onDelete={() => onChipDeleteClick(option)}
                />
            })
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
                slotProps={{
                    htmlInput: { ...params.inputProps }
                }}
            />
        }
        value={value}
        onChange={onAutocompleteChange}
        autoComplete={autoComplete}
        {...restProps}
    />
}

export default MultiSelectTextBox;