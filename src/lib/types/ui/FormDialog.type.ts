import { ATFormMinimalControlledUIProps, StrictOmit } from "../Common.type";
import { ATFormDialogProps } from "../ATFormDialog.type";

export type ATFormFormDialogProps = ATFormMinimalControlledUIProps & StrictOmit<ATFormDialogProps, 'onClose'> & {
    formChildren?: any[],
    onClose?: any,
};
