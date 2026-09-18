import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';
import { AtFormComboBoxProps } from '../../../../types/ui/ComboBox.type';
import { AtEnumItemType } from '../../../../types/Common.type';
import { resolveEnumItemDisplayTitle } from '../../../../enum/resolveEnumItemDisplayTitle';

const ComboBox = ({
    id,
    onChange,
    value,
    readOnly,
    error,
    helperText,
    options,
    renderInput,
    label,
    enumsKey,
    multiple: _multiple,
    freeSolo: _freeSolo,
    getOptionLabel,
    isOptionEqualToValue,
    getOptionKey,
    fullWidth,
    ...restProps
}: AtFormComboBoxProps) => {
    const { enums, t } = useAtFormConfig()
    const searchId = enumsKey || id
    const data = options ?? (searchId ? enums?.[searchId] : undefined) ?? []

    const onInternalChange = (_event: React.SyntheticEvent, newValue: AtEnumItemType | null) => {
        onChange?.({ target: { value: newValue } })
    }

    const defaultRenderInput = (params: AutocompleteRenderInputParams): React.ReactNode => {
        return <TextField
            {...params}
            error={error}
            helperText={helperText}
            label={label}
        />
    }

    return <Autocomplete
        {...restProps}
        fullWidth={fullWidth ?? true}
        multiple={false}
        freeSolo={false}
        options={data}
        onChange={onInternalChange}
        getOptionLabel={getOptionLabel ?? ((option) => {
            const item = data.find(current => current.id === option.id) ?? option;
            return resolveEnumItemDisplayTitle({ enumKey: searchId, item, t });
        })}
        isOptionEqualToValue={isOptionEqualToValue ?? ((option, selectedValue) => option.id === selectedValue.id)}
        getOptionKey={getOptionKey ?? ((option) => `${typeof option.id}:${String(option.id)}`)}
        value={value}
        renderInput={renderInput ?? defaultRenderInput}
        readOnly={readOnly}
    />
}

export default ComboBox;
