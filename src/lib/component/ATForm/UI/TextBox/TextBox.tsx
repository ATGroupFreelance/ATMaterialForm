import { ATFormTextBoxProps } from '../../../../types/ui/TextBox.type';
import TextField from '@mui/material/TextField';

const TextBox = ({ id, readOnly, slotProps, ...restProps }: ATFormTextBoxProps) => {
    return <TextField
        fullWidth={true}
        slotProps={{
            ...(slotProps || {}),
            input: {
                readOnly,
                ...((slotProps?.input) ?? {})
            }
        }}
        {...restProps}
    />
}

export default TextBox;