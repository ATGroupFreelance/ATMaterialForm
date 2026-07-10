import { AtFormMinimalControlledUiProps, StrictOmit } from "../Common.type";
import { CheckboxProps, FormControlLabelProps } from "@mui/material";

export type AtFormCheckBoxProps = AtFormMinimalControlledUiProps & StrictOmit<FormControlLabelProps, 'id' | 'value' | 'onChange' | 'control'> & {
    controlProps?: CheckboxProps,
}
