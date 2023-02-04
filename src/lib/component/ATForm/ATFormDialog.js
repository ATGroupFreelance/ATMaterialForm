import React, { useContext, useRef } from 'react';
//MUI
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
//ATForm
import ATForm from './ATForm';
import Button from './UI/Button/Button';
import { Grid } from '@mui/material';
//Context
import ATFormContext from './ATFormContext/ATFormContext';

const ATFormDialog = React.forwardRef(({ title, titleStyle, onClose, onCancelClick, onSubmitClick, onChange, children, submitLoading, cancelLoading, ...restProps }, forwardedRef) => {
    const { localText } = useContext(ATFormContext)

    const mFormData = useRef({ formData: null, formDataKeyValue: null })

    const onFormChange = ({ formData, formDataKeyValue }) => {
        mFormData.current = {
            formData, formDataKeyValue
        }

        if (onChange) {
            onChange({ formData, formDataKeyValue })
        }
    }

    const onInternalSubmitClick = (event, { startLoading, stopLoading }) => {
        if (onSubmitClick) {
            onSubmitClick(event, { startLoading, stopLoading, formData: mFormData.current.formData, formDataKeyValue: mFormData.current.formDataKeyValue })
        }
    }

    const onInternalCancelClick = () => {
        if (onCancelClick)
            onCancelClick()
        else
            onClose()
    }

    return <Dialog open={true} onClose={onClose} fullWidth={true} maxWidth={'800'}>
        <DialogTitle sx={{ ...(titleStyle || {}) }}>{title}</DialogTitle>
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '5px', marginBottom: '5px' }}>
                <ATForm ref={forwardedRef} onChange={onFormChange} {...restProps}>
                    {children}
                </ATForm>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                    <Button label={localText['Cancel']} onClick={onInternalCancelClick} variant={'outlined'} color={'secondary'} disabled={submitLoading} />
                </Grid>
                <Grid item xs={12} md={2}>
                    <Button label={localText['Submit']} onClick={onInternalSubmitClick} variant={'outlined'} disabled={cancelLoading} />
                </Grid>
            </Grid>
        </DialogActions>
    </Dialog>
})

export default ATFormDialog;