import { ColDef } from "ag-grid-community";
import { ATFormMinimalControlledUIProps, ATFormOnClickType } from "../Common.type";
import { ATFormIconButtonProps } from "./IconButton.type";

export type ATFormButtonFileType = {
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

export interface ATFormUploadButtonProps extends ATFormMinimalControlledUIProps {
    disabled?: boolean;
    accept?: string,
    multiple?: boolean,
    uploadButtonViewType?: 1 | 2,
    authToken?: string,
};

export interface ATFormUploadButtonShowFilesDialogProps {
    onSave?: ATFormOnClickType,
    onClose: ATFormOnClickType,
    files: ATFormButtonFileType[] | null | undefined,
    readOnly: boolean,
    authToken?: string,
}

export interface ATFormUploadButtonFileProps extends ATFormButtonFileType {
    onRemove: (props: any) => void;
    showRemoveIcon?: boolean;
    authToken?: string;
}

export interface ATFormUploadButtonViewImageDialog {
    onClose: (props: any) => void,
    image: string,
    name: string,
}

export interface ATFormUploadButtonCellRenderer {
    data: any,
    colDef: ColDef,

}

export interface ATFormUploadButtonShowFilesIconButtonProps extends ATFormIconButtonProps {
    files: ATFormButtonFileType[] | null | undefined,
    label: string,
}