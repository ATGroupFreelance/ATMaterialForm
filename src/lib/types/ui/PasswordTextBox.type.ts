import { AtFormMinimalControlledUiProps } from "../Common.type";
import { AtFormTextBoxProps } from "./TextBox.type";

export type AtFormPasswordTextBoxProps = AtFormMinimalControlledUiProps & AtFormTextBoxProps & {
    showPassword?: boolean,
    onToggleShowPasswordClick?: any,
}
