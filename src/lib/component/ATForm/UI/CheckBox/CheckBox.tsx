import { FormControl, FormHelperText, FormControlLabel } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { ATFormCheckBoxProps } from '@/lib/types/ui/CheckBox.type';

//TODO, add support for read only instead of simply using disable
const CheckBox = ({ id, onChange, value, helperText, color, readOnly, disabled, label, controlProps, error, ...restProps }: ATFormCheckBoxProps) => {
    void id;

    const internalOnChange = (_event: React.SyntheticEvent, checked: boolean) => {
        if (onChange) {
            onChange({ target: { value: checked } });
        }
    };

    return (
        <FormControl
            sx={{ width: '100%' }}
            error={!!error} // highlights error style if provided
            disabled={disabled || readOnly}
        >
            <FormControlLabel
                value="top"
                control={
                    <Checkbox
                        onChange={internalOnChange}
                        checked={value}
                        //@ts-ignore
                        color={color}
                        {...(controlProps || {})}
                    />
                }
                label={label}
                labelPlacement="end"
                {...restProps}
            />
            {helperText && (
                <FormHelperText>{helperText}</FormHelperText>
            )}
        </FormControl>
    );
};

export default CheckBox;
