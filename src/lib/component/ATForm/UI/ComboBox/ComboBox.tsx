import { useEffect, useState } from 'react';

import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useATFormConfig from '@/lib/hooks/useATFormConfig/useATFormConfig';
import { ATFormComboBoxProps } from '../../../../types/ui/ComboBox.type';
import { ATEnumType } from '@/lib/types/Common.type';

//Facts about autocomplete:
//If "multiple" is false, value/initvalue must be string or null, if initvalue is set to "" it throws a warning that no match was found
//If "multiple" is true,  value/initvalue must be an array
//If "multiple" is false the out of onChange is an string
//if "multiple" is true the output of onChange is an array
//Option can be like this: 
//['uk', 'us']
//[{label: 'uk'}, {label: 'us'}]
const ComboBox = ({ id, onChange, value, readOnly, error, helperText, options, renderInput, label, enumsKey, ...restProps }: ATFormComboBoxProps) => {
    const { enums } = useATFormConfig()
    const [data, setData] = useState<ATEnumType>([])

    useEffect(() => {
        if (typeof options === 'function')
            options()
                .then((res: any) => {
                    setData(res)
                })
        else
            setData(options as ATEnumType)

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
        />
    }

    const searchID = enumsKey || id

    return <Autocomplete
        fullWidth={true}
        options={(options ? data : searchID ? enums?.[searchID] : null) || []}
        onChange={onInternalChange}
        getOptionLabel={(option) => option.title}
        isOptionEqualToValue={(option, value) => String(option.id) === String(value.id)}
        value={value}
        renderInput={renderInput ? renderInput : defaultRenderInput}
        {...restProps}
    />
}

export default ComboBox;