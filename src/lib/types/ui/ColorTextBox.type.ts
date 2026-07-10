import { DialogProps } from "@mui/material";
import { AtFormTextBoxProps } from "./TextBox.type";

export type AtFormColorTextBoxProps = AtFormTextBoxProps

export interface AtFormColorTextBoxColorPickerDialogProps extends DialogProps {
    defaultValue: any,
    onSubmitClick: any,    
}