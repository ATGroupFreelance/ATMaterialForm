import { ATFormMinimalControlledUIProps } from "../Common.type";

export interface ATFormUploadImageButtonProps extends ATFormMinimalControlledUIProps {
    label?: string,
    disabled?: boolean,
    accept?: string | undefined,
    authToken?: string,
    width?: number,
    height?: number,    
}