import { AtFormMinimalControlledUiProps } from "../Common.type";

export interface AtFormUploadImageButtonProps extends AtFormMinimalControlledUiProps {
    label?: string,
    disabled?: boolean,
    accept?: string | undefined,
    authToken?: string,
    width?: number,
    height?: number,    
}