import { GridProps } from "@mui/material";
import { ATFormMinimalControlledUIProps } from "../Common.type";

export type ATFormImageSelectProps = ATFormMinimalControlledUIProps & {
    label?: string,
    width?: number,
    height?: number,
    multiple?: boolean,
    authToken?: string,
    imageWrapperProps?: GridProps
};

export interface ATFormImageSelectImageProps {
    id: string,
    name: string,
    src: string,
    onClick: any,
    width: number,
    height: number,
    selected: boolean
}

