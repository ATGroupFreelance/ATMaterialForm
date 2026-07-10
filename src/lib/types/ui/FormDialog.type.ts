import { AtFormMinimalControlledUiProps, StrictOmit } from "../Common.type";
import { AtFormDialogProps } from "../AtFormDialog.type";

export type AtFormFormDialogProps = AtFormMinimalControlledUiProps & StrictOmit<AtFormDialogProps, 'onClose'> & {
    formChildren?: any[],
    onClose?: any,
};
