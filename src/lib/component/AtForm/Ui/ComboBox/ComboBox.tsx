import { useEffect, useState } from 'react';

import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';
import { AtFormComboBoxProps } from '../../../../types/ui/ComboBox.type';
import { AtEnumType } from '../../../../types/Common.type';

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//Facts about autocomplete:
//If "multiple" is false, value/initvalue must be string or null, if initvalue is set to "" it throws a warning that no match was found
//If "multiple" is true,  value/initvalue must be an array
//If "multiple" is false the out of onChange is an string
//if "multiple" is true the output of onChange is an array
//Option can be like this: 
//['uk', 'us']
//[{label: 'uk'}, {label: 'us'}]
const ComboBox = ({ id, onChange, value, readOnly, error, helperText, options, renderInput, label, enumsKey, ...restProps }: AtFormComboBoxProps) => {
    const { enums } = useAtFormConfig()
    const [asyncData, setAsyncData] = useState<AtEnumType | null>(null);

    useEffect(() => {
        let isAlive = true;

        if (typeof options === 'function') {
            options()
                .then(res => {
                    if (isAlive) {
                        setAsyncData(res ?? []);
                    }
                })
                .catch(() => {
                    setAsyncData([]);
                });
        }
        else {
            setAsyncData((options ?? null) as AtEnumType);
        }

        return () => { isAlive = false; }
    }, [options])

    const onInternalChange = (_event: React.SyntheticEvent, newValue: string | null) => {
        if (onChange)
            onChange({ target: { value: newValue } })
    }

    const defaultRenderInput = (params: AutocompleteRenderInputParams): React.ReactNode => {
        return <TextField
            error={error}
            helperText={helperText}
            label={label}
            {...params}
            slotProps={{
                ...params.slotProps,
                htmlInput: {
                    ...params.slotProps.htmlInput,                    
                    readOnly: isMobile(),
                },
            }}
        />
    }

    const searchId = enumsKey || id

    const data = asyncData || (searchId ? enums?.[searchId] : null)

    return <Autocomplete
        fullWidth={true}
        options={(data || [])}
        onChange={onInternalChange}
        getOptionLabel={(option) => option.title}
        isOptionEqualToValue={(option, value) => String(option.id) === String(value.id)}
        value={value}
        renderInput={renderInput ? renderInput : defaultRenderInput}
        {...restProps}
        disabled={restProps.disabled || readOnly}
    />
}

export default ComboBox;