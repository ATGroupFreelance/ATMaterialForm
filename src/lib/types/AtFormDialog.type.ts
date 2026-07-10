import { DialogActionsProps, DialogContentProps, DialogProps, DialogTitleProps, ModalProps } from "@mui/material";
import { AtFormGridSize, AtFormOnChangeInterface, AtFormProps } from "./AtForm.type";
import { AtFormOnClickType, StrictOmit } from "./Common.type";
import { AtFormButtonProps } from "./ui/Button.type";

export interface AtFormDialogProps extends AtFormProps {
    dialogProps?: StrictOmit<DialogProps, 'open' | 'onClose' | 'fullWidth' | 'maxWidth'>,
    dialogTitleProps?: DialogTitleProps,
    dialogContentProps?: DialogContentProps,
    dialogActionsProps?: DialogActionsProps,
    onSubmitClick?: AtFormOnClickType<AtFormOnChangeInterface>,
    onCancelClick?: AtFormOnClickType<AtFormOnChangeInterface>,
    open?: ModalProps['open'],
    onClose: any,
    fullWidth?: DialogProps['fullWidth'],
    maxWidth?: DialogProps['maxWidth'],
    title?: string,
    loading?: boolean,
    submitLoading?: boolean,
    cancelLoading?: boolean,
    submitButtonProps?: AtFormButtonProps & { gridSize: AtFormGridSize },
    cancelButtonProps?: AtFormButtonProps & { gridSize: AtFormGridSize },
    getActions?: any,
}