import { ATFormMinimalControlledUIProps } from "../Common.type";
import { ATFormTextBoxProps } from "./TextBox.type";

export type ATFormPasswordTextBoxProps = ATFormMinimalControlledUIProps & ATFormTextBoxProps & {
    showPassword?: boolean,
    onToggleShowPasswordClick?: any,
}
