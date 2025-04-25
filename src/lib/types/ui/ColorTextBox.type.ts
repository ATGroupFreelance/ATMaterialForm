import { DialogProps } from "@mui/material";
import { ATFormTextBoxProps } from "./TextBox.type";

export type ATFormColorTextBoxProps = ATFormTextBoxProps

export interface ATFormColorTextBoxColorPickerDialogProps extends DialogProps {
    defaultValue: any,
    onSubmitClick: any,    
}