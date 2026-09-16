import type { ArchiveFileReference } from "at-shared-types/domain";
import { AtFormMinimalControlledUiProps } from "../Common.type";

export interface AtFormFileViewerProps extends AtFormMinimalControlledUiProps {
    label?: string,
    fileWidth?: number,
    fileHeight?: number,
    getSortedFiles?: (files: ArchiveFileReference[]) => ArchiveFileReference[],
}

export interface AtFormFileViewerFile extends ArchiveFileReference {
    width: number,
    height: number,
}
