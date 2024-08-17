import React, { useContext, useRef } from 'react';
//MUI
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
//ATForm
import ATForm from './ATForm';
import Button from './UI/Button/Button';
import { CircularProgress, Grid } from '@mui/material';
//Context
import ATFormContext from './ATFormContext/ATFormContext';

const ATFormDialog = React.forwardRef(({ title, titleStyle, onClose, onCancelClick, cancelButtonEnabled = true, onSubmitClick, onChange, children, submitLoading, cancelLoading, getActions, loading, submitButtonProps, cancelButtonProps, fullWidth, maxWidth, PaperProps, ...restProps }, forwardedRef) => {
    const { localText } = useContext(ATFormContext)

    const mFormData = useRef({ formData: null, formDataKeyValue: null, formDataSemiKeyValue: null })

    const onFormChange = ({ formData, formDataKeyValue, formDataSemiKeyValue }) => {
        mFormData.current = {
            formData, formDataKeyValue, formDataSemiKeyValue
        }

        if (onChange) {
            onChange({ formData, formDataKeyValue, formDataSemiKeyValue })
        }
    }

    const onInternalSubmitClick = (event, { ...buttonProps }) => {
        if (onSubmitClick) {
            onSubmitClick(event, { ...buttonProps, formData: mFormData.current.formData, formDataKeyValue: mFormData.current.formDataKeyValue, formDataSemiKeyValue: mFormData.current.formDataSemiKeyValue })
        }
    }

    const onInternalCancelClick = (event, { ...buttonProps }) => {
        if (onCancelClick)
            onCancelClick(event, { ...buttonProps })
        else
            onClose()
    }

    const actions = []

    if (cancelButtonEnabled) {
        actions.push(
            {
                id: 'Cancel',
                label: localText['Cancel'],
                onClick: onInternalCancelClick,
                color: 'secondary',
                disabled: loading || cancelLoading,
                grid: {
                    md: 2
                },
                ...(cancelButtonProps || {})
            }
        )
    }

    if (onSubmitClick) {
        actions.push(
            {
                id: 'Submit',
                label: localText['Submit'],
                onClick: onInternalSubmitClick,
                disabled: loading || submitLoading,
                grid: {
                    md: 2
                },
                ...(submitButtonProps || {})
            }
        )
    }

    const newActions = getActions ? getActions(actions) : actions

    return <Dialog open={true} onClose={onClose} fullWidth={fullWidth === undefined ? true : fullWidth} maxWidth={maxWidth === undefined ? '800' : maxWidth} PaperProps={PaperProps} >
        <DialogTitle sx={{ ...(titleStyle || {}) }}>{title}</DialogTitle>
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '5px', marginBottom: '5px' }}>
                {
                    loading && <CircularProgress />
                }
                {
                    !loading && <ATForm ref={forwardedRef} onChange={onFormChange} {...restProps}>
                        {children}
                    </ATForm>
                }
            </Grid>
        </DialogContent>
        <DialogActions>
            <Grid container spacing={2}>
                {
                    newActions.map(item => {
                        const { grid, id, label, onClick, disabled, ...restItem } = item
                        return <Grid key={id} item {...(grid ? grid : { xs: 12, md: 2 })}>
                            <Button label={label ? label : id} onClick={(event, { ...buttonProps }) => onClick(event, { ...buttonProps, formData: mFormData.current.formData, formDataKeyValue: mFormData.current.formDataKeyValue, formDataSemiKeyValue: mFormData.current.formDataSemiKeyValue })} disabled={loading || disabled} {...restItem} />
                        </Grid>
                    })
                }
            </Grid>
        </DialogActions>
    </Dialog>
})

export default ATFormDialog;