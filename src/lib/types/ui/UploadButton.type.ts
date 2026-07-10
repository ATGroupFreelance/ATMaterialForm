import { ColDef } from "ag-grid-community";
import { AtFormMinimalControlledUiProps, AtFormOnClickType } from "../Common.type";
import { AtFormIconButtonProps } from "./IconButton.type";

export type AtFormButtonFileType = {
    id?: string,
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    size: number;
    // The MIME type of the file (e.g., "image/png")
    type: string;
    // Path to the file relative to the file system (typically an empty string for most browsers)
    webkitRelativePath: string;
}

export interface AtFormUploadButtonProps extends AtFormMinimalControlledUiProps {
    disabled?: boolean;
    accept?: string,
    multiple?: boolean,
    uploadButtonViewType?: 1 | 2,
    authToken?: string,
};

export interface AtFormUploadButtonShowFilesDialogProps {
    onSave?: AtFormOnClickType,
    onClose: AtFormOnClickType,
    files: AtFormButtonFileType[] | null | undefined,
    readOnly: boolean,
    authToken?: string,
}

export interface AtFormUploadButtonFileProps extends AtFormButtonFileType {
    onRemove: (props: any) => void;
    showRemoveIcon?: boolean;
    authToken?: string;
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