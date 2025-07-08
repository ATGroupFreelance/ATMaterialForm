import { useState } from 'react';

import Autocomplete, { AutocompleteChangeReason, AutocompleteRenderValue } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { ATFormMultiSelectTextBoxOption, ATFormMultiSelectTextBoxProps } from '@/lib/types/ui/MultiSelectTextBox.type';
import IntegerTextBox from '../IntegerTextBox/IntegerTextBox';

const getInitialTextFieldValue = (valueType: 'number' | 'string') => {
    if (valueType === 'number')
        return 0
    else
        return ''
}

const MultiSelectTextBox = ({ label, onChange, error, helperText, value, autoComplete = false, allowDuplicates = false, valueType = 'string', ...restProps }: ATFormMultiSelectTextBoxProps) => {
    const [textFieldValue, setTextFieldValue] = useState<string | number>(getInitialTextFieldValue(valueType))

    const onTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextFieldValue(event.target.value)
    }

    const onChipDeleteClick = (option: ATFormMultiSelectTextBoxOption) => {
        const newValue = value?.filter((item) => {
            return item.id !== option.id
        })

        if (onChange) {
            setTextFieldValue(getInitialTextFieldValue(valueType))
            onChange({ target: { value: newValue } })
        }
    }

    const updateValue = () => {
        const alreadyExists = value?.find((item) => item.value === textFieldValue)

        if ((allowDuplicates || !alreadyExists) && textFieldValue) {
            const newValue = [
                ...(value || []),
                {
                    id: crypto.randomUUID(),
                    value: textFieldValue
                }
            ]

            if (onChange) {
                onChange({ target: { value: newValue } })
                setTextFieldValue(getInitialTextFieldValue(valueType))
            }
        }
    }

    const onAutocompleteChange = (event: any, newValue: ATFormMultiSelectTextBoxOption[], reason: AutocompleteChangeReason) => {
        if (event?.key === 'Enter')
            return;

        if (reason === 'clear') {
            setTextFieldValue(getInitialTextFieldValue(valueType))

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
        getOptionLabel={(option) => {
            return String(option.value)
        }}
        getOptionKey={(option) => option.id}
        renderValue={(value: AutocompleteRenderValue<ATFormMultiSelectTextBoxOption, true, false>, getItemProps) =>
            value.map((option, index) => {
                //@ts-expect-error Key does exist The interface for getItemProps is wrong
                const { key, ...restPropsChip } = getItemProps({ index })

                return <Chip
                    key={key}
                    variant="outlined"
                    label={String(option.value)}
                    color={'secondary'}
                    {...restPropsChip}
                    onDelete={() => onChipDeleteClick(option)}
                />
            })
        }
        renderInput={
            (params) => {
                const textFieldProps = {
                    ...params,
                    error,
                    helperText,
                    label,
                    onChange: onTextFieldChange,
                    value: textFieldValue,
                    onBlur: () => {
                        updateValue()
                    },
                    onKeyDown: (event: any) => {
                        if (event.key === 'Enter') {
                            updateValue()
                        }
                    },
                    slotProps: {
                        htmlInput: { ...params.inputProps }
                    }
                }

                if (valueType === 'string')
                    return <TextField {...textFieldProps} />
                else if (valueType === 'number')
                    return <IntegerTextBox {...textFieldProps} />
            }
        }
        value={value}
        onChange={onAutocompleteChange}
        autoComplete={autoComplete}
        {...restProps}
    />
}

export default MultiSelectTextBox;