import { ATFormMinimalControlledUIProps } from "../Common.type";

export interface ATFormUploadImageButton extends ATFormMinimalControlledUIProps {
    label?: string,
    disabled?: boolean,
    accept?: string | undefined,
    authToken?: string,
    width?: number,
    height?: number,    
}