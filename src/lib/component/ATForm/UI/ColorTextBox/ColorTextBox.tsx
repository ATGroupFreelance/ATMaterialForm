import { JSX, useState } from 'react';

import TextField from '@mui/material/TextField';
import { PaletteOutlined } from '@mui/icons-material';
import { IconButton, InputAdornment, Tooltip } from '@mui/material';
import ColorTextBoxColorPickerDialog from './ColorTextBoxColorPickerDialog/ColorTextBoxColorPickerDialog';
//ATForm
import useATFormConfig from '../../../../hooks/useATFormConfig/useATFormConfig';
import { ATFormColorTextBoxProps } from '@/lib/types/ui/ColorTextBox.type';

const ColorTextBox = ({ id, slotProps, value, onChange, ...restProps }: ATFormColorTextBoxProps) => {
    void id;

    const { localText } = useATFormConfig()
    const [dialog, setDialog] = useState<JSX.Element | null>(null)

    const onOpenColorPickerClick = () => {
        setDialog(
            <ColorTextBoxColorPickerDialog
                defaultValue={value}
                onSubmitClick={(_event: any, { color }: any) => {
                    if (onChange)
                        onChange({ target: { value: color } })

                    handleDialogClose()
                }}
                onClose={handleDialogClose}
                open={true}
            />
        )
    }

    const handleDialogClose = () => {
        setDialog(null)
    }

    return <>
        <TextField
            slotProps={{
                input: {
                    endAdornment: <InputAdornment position="start">
                        <Tooltip title={localText['Open Color Picker']}>
                            <IconButton onClick={onOpenColorPickerClick} >
                                <PaletteOutlined />
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>,
                    ...(slotProps?.input || {})
                },
                ...(slotProps || {}),
            }}
            onChange={onChange}
            {...restProps}
        />
        {dialog}
    </>
}

export default ColorTextBox;