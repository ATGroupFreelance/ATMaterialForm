//React
import { useState } from 'react';
//MUI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
//ATForm
import useAtFormConfig from '../../../../../hooks/useAtFormConfig/useAtFormConfig';
//Others
//'@uiw/react-color-sketch' Package Size is 12kb
import Sketch from '@uiw/react-color-sketch';
import { AtFormColorTextBoxColorPickerDialogProps } from '../../../../../types/ui/ColorTextBox.type';

function ColorTextBoxColorPickerDialog({ defaultValue, onSubmitClick, onClose, ...restProps }: AtFormColorTextBoxColorPickerDialogProps) {
    const { localText } = useAtFormConfig()
    const [hex, setHex] = useState(defaultValue)

    const onChange = (newColor: any) => {
        setHex(newColor.hex)
    }

    const onInternalSubmitClick = (event: any) => {
        onSubmitClick(event, { color: hex })
    }

    return (
        <Dialog maxWidth={false} onClose={onClose} {...restProps} >
            <DialogTitle >{localText['Choose A Color']}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ marginTop: '5px', marginBottom: '5px' }}>
                    <Grid size={12}>
                        <Sketch
                            color={hex}
                            onChange={onChange}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Button fullWidth={true} onClick={onInternalSubmitClick} color={'success'} >
                            {localText['Submit']}
                        </Button>
                    </Grid>
                    <Grid size={12}>
                        <Button
                            fullWidth={true}
                            onClick={
                                (event) => {
                                    if (onClose)
                                        onClose(event, 'escapeKeyDown')
                                }
                            }
                            color={'error'}
                        >
                            {localText['Cancel']}
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
}

export default ColorTextBoxColorPickerDialog;