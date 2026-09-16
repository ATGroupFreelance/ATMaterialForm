import type { ArchiveFileReference } from "at-shared-types/domain";
import { GridProps } from "@mui/material";
import { AtFormMinimalControlledUiProps } from "../Common.type";

export type AtFormImageSelectProps = AtFormMinimalControlledUiProps & {
    label?: string,
    width?: number,
    height?: number,
    multiple?: boolean,
    imageWrapperProps?: GridProps
};

export interface AtFormImageSelectValue extends ArchiveFileReference {
    selected?: boolean;
}

export interface AtFormImageSelectImageProps extends AtFormImageSelectValue {
    src: string,
    onClick: any,
    width: number,
    height: number,
}
