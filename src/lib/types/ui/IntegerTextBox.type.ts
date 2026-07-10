import { AtFormTextBoxProps } from "./TextBox.type";

export type AtFormIntegerTextBoxProps = AtFormTextBoxProps & {
    min?: number;
    max?: number;
}
