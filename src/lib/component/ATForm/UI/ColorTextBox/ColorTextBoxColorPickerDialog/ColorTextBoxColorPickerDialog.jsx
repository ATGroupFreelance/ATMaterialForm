//React
import React, { useState, useContext } from 'react';
//MUI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 } from '@mui/material';
//ATForm
import ATFormContext from '../../../ATFormContext/ATFormContext';
//Others
//'@uiw/react-color-sketch' Package Size is 12kb
import Sketch from '@uiw/react-color-sketch';

function ColorTextBoxColorPickerDialog({ defaultValue, onClose, onSubmitClick, ...restProps }) {
    const { localText } = useContext(ATFormContext)
    const [hex, setHex] = useState(defaultValue)

    const onChange = (newColor) => {
        setHex(newColor.hex)
    }

    const onInternalSubmitClick = (event) => {
        onSubmitClick(event, { color: hex })
    }

    return (
        <Dialog open={true} onClose={onClose} maxWidth={false} {...restProps} >
            <DialogTitle >{localText['Choose A Color']}</DialogTitle>
            <DialogContent>
                <Grid2 container spacing={2} sx={{ marginTop: '5px', marginBottom: '5px' }}>
                    <Grid2 size={12}>
                        <Sketch
                            color={hex}
                            onChange={onChange}
                        />
                    </Grid2>
                </Grid2>
            </DialogContent>
            <DialogActions>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <Button fullWidth={true} onClick={onInternalSubmitClick} color={'success'} >
                            {localText['Submit']}
                        </Button>
                    </Grid2>
                    <Grid2 size={12}>
                        <Button fullWidth={true} onClick={onClose} color={'red'}>
                            {localText['Cancel']}
                        </Button>
                    </Grid2>
                </Grid2>
            </DialogActions>
        </Dialog>
    );
}

export default ColorTextBoxColorPickerDialog;