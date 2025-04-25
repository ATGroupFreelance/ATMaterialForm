import { ATFormMinimalControlledUIProps } from "../Common.type";

export interface ATFormFileViewer extends ATFormMinimalControlledUIProps {
    label?: string,
    fileWidth?: number,
    fileHeight?: number,
    getSortedFiles: any,
}

export interface ATFormFileViewerFile {
    id: string,
    name: string,
    size: number,
    authToken: string,
    width: number,
    height: number,
}