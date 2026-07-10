import { useRef } from 'react';
//MUI
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
//ATForm
import AtForm from './AtForm';
import Button from './Ui/Button/Button';
import { CircularProgress, Grid } from '@mui/material';
import useAtFormConfig from '../../hooks/useAtFormConfig/useAtFormConfig';
import { AtFormDialogProps } from '../../types/AtFormDialog.type';
import { AtFormOnChangeInterface } from '../../types/AtForm.type';
import { AtFormOnClickType } from '../../types/Common.type';

const AtFormDialog = ({
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
}: AtFormDialogProps) => {
    const { localText } = useAtFormConfig()

    const mFormData = useRef<AtFormOnChangeInterface>({ formData: {}, formDataKeyValue: {}, formDataSemiKeyValue: {} })

    const onFormChange = ({ formData, formDataKeyValue, formDataSemiKeyValue }: AtFormOnChangeInterface) => {
        mFormData.current = {
            formData, formDataKeyValue, formDataSemiKeyValue
        }

        if (onChange) {
            onChange({ formData, formDataKeyValue, formDataSemiKeyValue })
        }
    }

    const onInternalSubmitClick: AtFormOnClickType = ({ ...buttonProps }) => {
        if (onSubmitClick) {
            onSubmitClick({ ...buttonProps, formData: mFormData.current.formData, formDataKeyValue: mFormData.current.formDataKeyValue, formDataSemiKeyValue: mFormData.current.formDataSemiKeyValue })
        }
    }

    const onInternalCancelClick: AtFormOnClickType = ({ ...buttonProps }) => {
        if (onCancelClick)
            onCancelClick({ ...buttonProps, formData: mFormData.current.formData, formDataKeyValue: mFormData.current.formDataKeyValue, formDataSemiKeyValue: mFormData.current.formDataSemiKeyValue })
        else {
            if (onClose)
                onClose()
        }
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
                    !loading && <AtForm onChange={onFormChange} {...restProps}>
                        {children}
                    </AtForm>
                }
            </Grid>
        </DialogContent>
        <DialogActions {...(dialogActionsProps || {})}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
                {
                    newActions.map((item: any) => {
                        const { size = { xs: 12, md: 2 }, id, label, onClick, disabled, ...restItem } = item
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

export default AtFormDialog;