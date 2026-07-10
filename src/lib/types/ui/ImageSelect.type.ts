import { GridProps } from "@mui/material";
import { AtFormMinimalControlledUiProps } from "../Common.type";

export type AtFormImageSelectProps = AtFormMinimalControlledUiProps & {
    label?: string,
    width?: number,
    height?: number,
    multiple?: boolean,
    authToken?: string,
    imageWrapperProps?: GridProps
};

export interface AtFormImageSelectImageProps {
    id: string,
    name: string,
    src: string,
    onClick: any,
    width: number,
    height: number,
    selected: boolean
}

