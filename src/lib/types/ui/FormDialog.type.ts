import { ATFormMinimalControlledUIProps } from "../Common.type";
import { ATFormDialogProps } from "../ATFormDialog.type";

export type ATFormFormDialogProps = ATFormMinimalControlledUIProps & ATFormDialogProps & {
    elements?: any[],
};
