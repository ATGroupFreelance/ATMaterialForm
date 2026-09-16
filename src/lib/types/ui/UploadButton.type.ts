import { ColDef } from "ag-grid-community";
import type {
    ArchiveFileReference,
    ArchiveId,
    ArchiveUploadOptions,
} from "at-shared-types/domain";
import { AtFormMinimalControlledUiProps, AtFormOnClickType } from "../Common.type";
import { AtFormIconButtonProps } from "./IconButton.type";

export type AtFormButtonFileType = ArchiveFileReference;

export interface AtFormUploadButtonProps extends AtFormMinimalControlledUiProps {
    disabled?: boolean;
    accept?: string,
    multiple?: boolean,
    uploadButtonViewType?: 1 | 2,
    archiveUploadOptions?: ArchiveUploadOptions,
};

export interface AtFormUploadButtonShowFilesDialogProps {
    onSave?: AtFormOnClickType,
    onClose: AtFormOnClickType,
    files: AtFormButtonFileType[] | null | undefined,
    readOnly: boolean,
}

export interface AtFormUploadButtonFileProps extends AtFormButtonFileType {
    onRemove: (archiveId: ArchiveId) => void;
    showRemoveIcon?: boolean;
}

export interface AtFormUploadButtonViewImageDialog {
    onClose: (props: any) => void,
    image: string,
    name: string,
}

export interface AtFormUploadButtonCellRenderer {
    data: any,
    colDef: ColDef,
}

export interface AtFormUploadButtonShowFilesIconButtonProps extends AtFormIconButtonProps {
    files: AtFormButtonFileType[] | null | undefined,
    label: string,
}
