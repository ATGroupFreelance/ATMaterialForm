import { DialogActionsProps, DialogContentProps, DialogProps, DialogTitleProps, ModalProps } from "@mui/material";
import { ATFormGridSize, ATFormProps } from "./ATForm.type";
import { ATFormOnClickType, StrictOmit } from "./Common.type";
import { ATFormButtonProps } from "./ui/Button.type";

export interface ATFormDialogProps extends ATFormProps {
    dialogProps?: StrictOmit<DialogProps, 'open' | 'onClose' | 'fullWidth' | 'maxWidth'>,
    dialogTitleProps?: DialogTitleProps,
    dialogContentProps?: DialogContentProps,
    dialogActionsProps?: DialogActionsProps,
    onSubmitClick?: ATFormOnClickType,
    onCancelClick?: ATFormOnClickType,
    open?: ModalProps['open'],
    onClose: any,
    fullWidth?: DialogProps['fullWidth'],
    maxWidth?: DialogProps['maxWidth'],
    title?: string,
    loading?: boolean,
    submitLoading?: boolean,
    cancelLoading?: boolean,
    submitButtonProps?: ATFormButtonProps & { gridSize: ATFormGridSize },
    cancelButtonProps?: ATFormButtonProps & { gridSize: ATFormGridSize },
    getActions?: any,
}