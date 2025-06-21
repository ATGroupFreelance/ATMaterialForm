import { useRef } from 'react';
//MUI
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
//ATForm
import ATForm from './ATForm';
import Button from './UI/Button/Button';
import { CircularProgress, Grid } from '@mui/material';
import useATFormConfig from '../../hooks/useATFormConfig/useATFormConfig';
import { ATFormDialogProps } from '@/lib/types/ATFormDialog.type';
import { ATFormButtonProps } from '@/lib/types/ui/Button.type';
import { ATFormOnChangeInterface } from '@/lib/types/ATForm.type';

const ATFormDialog = ({
    dialogProps,
    dialogTitleProps,
    dialogContentProps,
    dialogActionsProps,
    onChange,
    children,
    onSubmitClick,
    onCancelClick,
    onClose,
    open = true,
    fullWidth = true,
    maxWidth = 'md',
    title,
    loading,
    submitLoading,
    cancelLoading,
    submitButtonProps,
    cancelButtonProps,
    getActions,
    ...restProps
}: ATFormDialogProps) => {
    const { localText } = useATFormConfig()

    const mFormData = useRef<ATFormOnChangeInterface>({ formData: {}, formDataKeyValue: {}, formDataSemiKeyValue: {} })

    const onFormChange = ({ formData, formDataKeyValue, formDataSemiKeyValue }: ATFormOnChangeInterface) => {
        mFormData.current = {
            formData, formDataKeyValue, formDataSemiKeyValue
        }

        if (onChange) {
            onChange({ formData, formDataKeyValue, formDataSemiKeyValue })
        }
    }

    const onInternalSubmitClick = ({ ...buttonProps }: ATFormButtonProps) => {
        if (onSubmitClick) {
            onSubmitClick({ ...buttonProps, formData: mFormData.current.formData, formDataKeyValue: mFormData.current.formDataKeyValue, formDataSemiKeyValue: mFormData.current.formDataSemiKeyValue })
        }
    }

    const onInternalCancelClick = ({ ...buttonProps }: ATFormButtonProps) => {
        if (onCancelClick)
            onCancelClick({ ...buttonProps })
        else
            onClose()
    }

    const actions = []

    if (onCancelClick !== null) {
        actions.push(
            {
                id: 'Cancel',
                label: localText['Cancel'],
                onClick: onInternalCancelClick,
                color: 'secondary',
                disabled: cancelLoading,
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
                disabled: submitLoading,
                ...(submitButtonProps || {})
            }
        )
    }

    const newActions = getActions ? getActions(actions) : actions

    return <Dialog
        open={open}
        onClose={onClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        {...(dialogProps || {})}
    >
        <DialogTitle {...(dialogTitleProps || {})}>{title}</DialogTitle>
        <DialogContent {...(dialogContentProps || {})}>
            <Grid container spacing={2} sx={{ marginTop: '5px', marginBottom: '5px' }}>
                {
                    loading && <CircularProgress />
                }
                {
                    !loading && <ATForm onChange={onFormChange} {...restProps}>
                        {children}
                    </ATForm>
                }
            </Grid>
        </DialogContent>
        <DialogActions {...(dialogActionsProps || {})}>
            <Grid container spacing={2}>
                {
                    newActions.map((item: any) => {
                        const { size = { xs: 12, size: 2 }, id, label, onClick, disabled, ...restItem } = item
                        return <Grid key={id} size={size}>
                            <Button
                                label={label ? label : id}
                                onClick={({ ...buttonProps }) => onClick({
                                    ...buttonProps, formData: mFormData.current.formData,
                                    formDataKeyValue: mFormData.current.formDataKeyValue,
                                    formDataSemiKeyValue: mFormData.current.formDataSemiKeyValue
                                })}
                                disabled={loading || disabled}
                                {...restItem}
                            />
                        </Grid>
                    })
                }
            </Grid>
        </DialogActions>
    </Dialog>
}

export default ATFormDialog;