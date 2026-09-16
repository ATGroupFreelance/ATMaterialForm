import { ChangeEvent, useEffect, useState } from 'react';
//Context
import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button, CircularProgress, Typography } from '@mui/material';
import { AtFormUploadImageButtonProps } from '../../../../types/ui/UploadImageButton.type';
import type { ArchiveFileReference } from 'at-shared-types/domain';
import useAtForm from '../../../../hooks/useAtForm/useAtForm';

const UploadImageButton = ({ id, label, onChange, value, disabled, accept, error, helperText, archiveUploadOptions, width = 128, height = 128, readOnly }: AtFormUploadImageButtonProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const { onLockdownChange } = useAtForm()
    const { archive } = useAtFormConfig()
    const [src, setSrc] = useState<string | null>(null)

    const archiveFile = value && typeof value === 'object'
        ? value as ArchiveFileReference
        : null

    useEffect(() => {
        let objectUrl: string | undefined;

        if (archiveFile?.archiveId && archive) {
            archive.getFileContent({
                archiveId: archiveFile.archiveId,
                purpose: 'preview',
                previewSize: { width, height },
            })
                .then(res => {
                    objectUrl = window.URL.createObjectURL(res)
                    setSrc(objectUrl)
                })
                .catch(console.error)
        }
        else {
            setSrc(null)
        }

        return () => {
            if (objectUrl)
                window.URL.revokeObjectURL(objectUrl)
        }
    }, [archive, archiveFile?.archiveId, height, width])

    const onInternalChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles: File[] = event.target.files ? Array.from(event.target.files) : []

        if (selectedFiles.length !== 1)
            return;

        setLoading(true)
        if (onLockdownChange && id)
            onLockdownChange(id, true)

        if (archive) {
            archive.uploadFiles({
                files: selectedFiles,
                options: archiveUploadOptions,
            })
                .then(res => {
                    const file = res[0]

                    if (onChange && file)
                        onChange({ target: { value: file } })
                })
                .catch(console.error)
                .finally(() => {
                    setLoading(false)
                    if (onLockdownChange && id)
                        onLockdownChange(id, false)
                })
        }
        else {
            console.error('No archive adapter was found, please provide one using AtFormConfigProvider')
            setLoading(false)
            if (onLockdownChange && id)
                onLockdownChange(id, false)
        }
    }

    return <div style={{ flexDirection: "column", alignItems: "center", textAlign: 'center' }}>
        <Typography sx={{ fontSize: '14px', "userSelect": "none", "WebkitUserSelect": "none" }} color={error ? 'error.main' : 'text.primary'}>
            {label}
        </Typography>
        <Button component="label" sx={{ width: `${width}px`, height: `${height}px` }} variant={"outlined"} disabled={disabled || loading || readOnly} color={error ? 'error' : 'primary'}>
            <img src={src || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"} alt={""} style={{ width: '100%', height: '100%', border: "0px" }} />
            <input hidden type="file" accept={accept || "image/png, image/gif, image/jpeg"} onChange={onInternalChange} />
            {loading ? <CircularProgress sx={{ position: 'absolute' }} /> : <UploadFileIcon sx={{ position: 'absolute' }} />}
        </Button>
        {
            error && helperText &&
            <Typography sx={{ fontSize: '12px', "userSelect": "none", "WebkitUserSelect": "none", color: 'error.main' }}>
                {helperText}
            </Typography>
        }
    </div>
}

export default UploadImageButton;
