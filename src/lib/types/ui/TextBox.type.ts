import { TextFieldProps } from "@mui/material";
import { ATFormMinimalControlledUIProps, StrictOmit } from "../Common.type";

export type ATFormTextBoxProps = ATFormMinimalControlledUIProps & StrictOmit<TextFieldProps, 'id' | 'value' | 'onChange' | 'error' | 'helperText'>;
