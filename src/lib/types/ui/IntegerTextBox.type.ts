import { ATFormTextBoxProps } from "./TextBox.type";

export type ATFormIntegerTextBoxProps = ATFormTextBoxProps & {
    min?: number;
    max?: number;
}
