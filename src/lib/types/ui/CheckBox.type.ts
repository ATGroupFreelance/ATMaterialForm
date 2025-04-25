import { ATFormMinimalControlledUIProps, StrictOmit } from "../Common.type";
import { CheckboxProps, FormControlLabelProps } from "@mui/material";

export type ATFormCheckBoxProps = ATFormMinimalControlledUIProps & StrictOmit<FormControlLabelProps, 'id' | 'value' | 'onChange' | 'control'> & {
    controlProps?: CheckboxProps,
}
