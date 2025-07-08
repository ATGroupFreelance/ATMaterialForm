import { ATFormTextBoxProps } from '../../../../types/ui/TextBox.type';
import TextField from '@mui/material/TextField';

const TextBox = ({ id, readOnly, slotProps, ...restProps }: ATFormTextBoxProps) => {

    void id;
    return <TextField
        fullWidth={true}
        slotProps={{
            ...(slotProps || {}),
            // Only set 'input' if 'htmlInput' is NOT defined
            ...(slotProps?.htmlInput
                ?
                {}
                :
                {
                    input: {
                        readOnly,
                        ...slotProps?.input,
                    },
                }),
        }}
        {...restProps}
    />
}

export default TextBox;