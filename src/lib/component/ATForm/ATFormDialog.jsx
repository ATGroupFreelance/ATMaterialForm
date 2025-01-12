import React, { useRef } from 'react';
//MUI
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
//ATForm
import ATForm from './ATForm';
import Button from './UI/Button/Button';
import { CircularProgress, Grid2 } from '@mui/material';
import useATFormProvider from '../../hooks/useATFormProvider/useATFormProvider';

const ATFormDialog = ({ ref, title, titleStyle, onClose, onCancelClick, cancelButtonEnabled = true, onSubmitClick, onChange, children, submitLoading, cancelLoading, getActions, loading, submitButtonProps, cancelButtonProps, fullWidth, maxWidth, PaperProps, ...restProps }) => {
    const { localText } = useATFormProvider()

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
                    size: 2
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
                    size: 2
                },
                ...(submitButtonProps || {})
            }
        )
    }

    const newActions = getActions ? getActions(actions) : actions

    return <Dialog open={true} onClose={onClose} fullWidth={fullWidth === undefined ? true : fullWidth} maxWidth={maxWidth === undefined ? '800' : maxWidth} PaperProps={PaperProps} >
        <DialogTitle sx={{ ...(titleStyle || {}) }}>{title}</DialogTitle>
        <DialogContent>
            <Grid2 container spacing={2} sx={{ marginTop: '5px', marginBottom: '5px' }}>
                {
                    loading && <CircularProgress />
                }
                {
                    !loading && <ATForm ref={ref} onChange={onFormChange} {...restProps}>
                        {children}
                    </ATForm>
                }
            </Grid2>
        </DialogContent>
        <DialogActions>
            <Grid2 container spacing={2}>
                {
                    newActions.map(item => {
                        const { grid, id, label, onClick, disabled, ...restItem } = item
                        return <Grid2 key={id} size={{ ...(grid ? grid : { xs: 12, size: 2 }) }}>
                            <Button label={label ? label : id} onClick={(event, { ...buttonProps }) => onClick(event, { ...buttonProps, formData: mFormData.current.formData, formDataKeyValue: mFormData.current.formDataKeyValue, formDataSemiKeyValue: mFormData.current.formDataSemiKeyValue })} disabled={loading || disabled} {...restItem} />
                        </Grid2>
                    })
                }
            </Grid2>
        </DialogActions>
    </Dialog>
}

export default ATFormDialog;