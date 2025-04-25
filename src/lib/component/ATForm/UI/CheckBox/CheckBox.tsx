import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox';
import { ATFormCheckBoxProps } from '@/lib/types/ui/CheckBox.type';

//TODO, add support for read only instead of simply using disable
const CheckBox = ({ id, onChange, value, helperText, color, readOnly, disabled, label, controlProps, ...restProps }: ATFormCheckBoxProps) => {
    const internalOnChange = (_event: React.SyntheticEvent, checked: boolean) => {
        if (onChange)
            onChange({ target: { value: checked } })
    }

    return <FormControlLabel
        sx={{ width: '100%' }}
        value="top"
        control={
            <Checkbox
                color={"ash"}
                {...(controlProps || {})}
            />
        }
        onChange={internalOnChange}
        checked={value}
        disabled={disabled || readOnly}
        label={label}
        labelPlacement='end'
        {...restProps}
    />

}

export default CheckBox;