import { TextFieldProps } from "@mui/material";
import { AtFormMinimalControlledUiProps, StrictOmit } from "../Common.type";

export type AtFormTextBoxProps = AtFormMinimalControlledUiProps & StrictOmit<TextFieldProps, 'id' | 'value' | 'onChange' | 'error' | 'helperText'>;
