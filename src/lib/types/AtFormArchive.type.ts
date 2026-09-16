import type {
    ArchiveFileReference,
    ArchiveId,
    ArchiveUploadOptions,
} from "at-shared-types/domain";

export type AtFormArchiveFilePurpose = "preview" | "download";

export interface AtFormArchiveUploadRequest {
    files: File[];
    options?: ArchiveUploadOptions;
}

export interface AtFormArchiveGetFileContentRequest {
    archiveId: ArchiveId;
    purpose: AtFormArchiveFilePurpose;
    previewSize?: {
        width?: number;
        height?: number;
    };
}

/**
 * UI-only bridge used by archive-aware AtForm controls.
 *
 * The host application owns the implementation. AtForm deliberately has no
 * knowledge of HTTP, authentication, ServiceManager, archive providers, or
 * backend routes.
 */
export interface AtFormArchiveAdapter {
    uploadFiles(request: AtFormArchiveUploadRequest): Promise<ArchiveFileReference[]>;
    getFileContent(request: AtFormArchiveGetFileContentRequest): Promise<Blob>;
}
