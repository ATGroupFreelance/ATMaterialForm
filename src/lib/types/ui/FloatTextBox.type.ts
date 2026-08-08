import { StrictOmit } from "../Common.type";
import { AtFormTextBoxProps } from "./TextBox.type";

export type AtFormFloatTextBoxProps = StrictOmit<
    AtFormTextBoxProps,
    "value"
> & {
    value?: number | null;
    min?: number;
    max?: number;
    step?: number | "any";
};