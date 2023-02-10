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

const ATFormDialog = React.forwardRef(({ title, titleStyle, onClose, onCancelClick, onSubmitClick, onChange, children, submitLoading, cancelLoading, getActions, ...restProps }, forwardedRef) => {
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

    const onInternalSubmitClick = (event, { ...buttonProps }) => {
        if (onSubmitClick) {
            onSubmitClick(event, { ...buttonProps, formData: mFormData.current.formData, formDataKeyValue: mFormData.current.formDataKeyValue })
        }
    }

    const onInternalCancelClick = (event, { ...buttonProps }) => {
        if (onCancelClick)
            onCancelClick(event, { ...buttonProps })
        else
            onClose()
    }

    const actions = [
        {
            id: 'Cancel',
            label: localText['Cancel'],
            onClick: onInternalCancelClick,
            color: 'secondary',
            variant: 'outlined',
            disabled: cancelLoading,
            grid: {
                md: 2
            }
        },
    ]

    if (onSubmitClick) {
        actions.push(
            {
                id: 'Submit',
                label: localText['Submit'],
                onClick: onInternalSubmitClick,
                variant: 'outlined',
                disabled: submitLoading,
                grid: {
                    md: 2
                }
            }
        )
    }

    const newActions = getActions ? getActions(actions) : actions

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
                {
                    newActions.map(item => {
                        const { grid, id, label, onClick, ...restItem } = item
                        return <Grid key={id} item {...(grid ? grid : { xs: 12, md: 2 })}>
                            <Button label={label ? label : id} onClick={(event, { ...buttonProps }) => onClick(event, { ...buttonProps, formData: mFormData.current.formData, formDataKeyValue: mFormData.current.formDataKeyValue })} {...restItem} />
                        </Grid>
                    })
                }
            </Grid>
        </DialogActions>
    </Dialog>
})

export default ATFormDialog;