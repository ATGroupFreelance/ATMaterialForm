import type { ArchiveUploadOptions } from "at-shared-types/domain";
import { AtFormMinimalControlledUiProps } from "../Common.type";

export interface AtFormUploadImageButtonProps extends AtFormMinimalControlledUiProps {
    label?: string,
    disabled?: boolean,
    accept?: string | undefined,
    archiveUploadOptions?: ArchiveUploadOptions,
    width?: number,
    height?: number,
}
