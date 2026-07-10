import { AtFormMinimalControlledUiProps } from "../Common.type";

export interface AtFormFileViewerProps extends AtFormMinimalControlledUiProps {
    label?: string,
    fileWidth?: number,
    fileHeight?: number,
    getSortedFiles?: any,
}

export interface AtFormFileViewerFile {
    id: string,
    name: string,
    size: number,
    authToken: string,
    width: number,
    height: number,
}