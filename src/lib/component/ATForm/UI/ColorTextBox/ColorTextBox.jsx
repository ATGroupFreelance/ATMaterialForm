import React, { useState, useContext } from 'react';

import TextField from '@mui/material/TextField';
import { PaletteOutlined } from '@mui/icons-material';
import { IconButton, InputAdornment, Tooltip } from '@mui/material';
import ColorTextBoxColorPickerDialog from './ColorTextBoxColorPickerDialog/ColorTextBoxColorPickerDialog';
//ATForm
import ATFormContext from '../../ATFormContext/ATFormContext';

const ColorTextBox = ({ _formProps_, id, TextBox, readOnly, InputProps, value, onChange, ...restProps }) => {
    const { localText } = useContext(ATFormContext)
    const [dialog, setDialog] = useState(null)

    const onOpenColorPickerClick = () => {
        setDialog(
            <ColorTextBoxColorPickerDialog
                defaultValue={value}
                onSubmitClick={(event, { color }) => {
                    onChange({ target: { value: color } })
                    handleDialogClose()
                }}
                onClose={handleDialogClose}
            />
        )
    }

    const handleDialogClose = () => {
        setDialog(null)
    }

    return <>
        <TextField
            fullWidth={true}
            InputProps={{
                readOnly,
                endAdornment: (
                    <InputAdornment position="start">
                        <Tooltip title={localText['Open Color Picker']}>
                            <IconButton onClick={onOpenColorPickerClick} >
                                <PaletteOutlined />
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>
                ),
                ...(InputProps || {})
            }}
            value={value}
            onChange={onChange}
            {...restProps}
        />
        {dialog}
    </>
}

export default ColorTextBox;