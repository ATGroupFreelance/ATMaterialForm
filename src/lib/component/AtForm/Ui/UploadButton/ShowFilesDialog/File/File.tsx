import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Button from '../../../Button/Button';
import useAtFormConfig from '../../../../../../hooks/useAtFormConfig/useAtFormConfig';
import ViewImageDialog from './ViewImageDialog/ViewImageDialog';
import { AtFormUploadButtonFileProps } from '../../../../../../types/ui/UploadButton.type';
import { AtFormOnClickType } from '../../../../../../types/Common.type';

function isImage(fileName: string) {
    return /\.(jpg|jpeg|png|gif|webp|avif|bmp)$/i.test(fileName);
}

const File = ({ archiveId, fileName, size = 0, onRemove, showRemoveIcon }: AtFormUploadButtonFileProps) => {
    const { archive, t } = useAtFormConfig()
    const [thumbnail, setThumbnail] = useState<string | undefined>(undefined)
    const [dialog, setDialog] = useState<any>(null)

    useEffect(() => {
        let objectUrl: string | undefined;

        if (archiveId && fileName && archive && isImage(fileName)) {
            archive.getFileContent({
                archiveId,
                purpose: 'preview',
                previewSize: { width: 128, height: 128 },
            })
                .then(res => {
                    objectUrl = window.URL.createObjectURL(res)
                    setThumbnail(objectUrl)
                })
                .catch(console.error)
        }

        return () => {
            if (objectUrl)
                window.URL.revokeObjectURL(objectUrl)
        }
    }, [archiveId, fileName, archive])

    const onOpenClick: AtFormOnClickType = ({ startLoading, stopLoading }) => {
        startLoading()

        if (archive && archiveId) {
            archive.getFileContent({ archiveId, purpose: 'download' })
                .then(res => {
                    const anchor = document.createElement('a')
                    const objectUrl = window.URL.createObjectURL(res)

                    anchor.href = objectUrl
                    anchor.download = fileName
                    document.body.appendChild(anchor)
                    anchor.click()
                    anchor.remove()
                    window.URL.revokeObjectURL(objectUrl)
                })
                .finally(() => stopLoading())
        }
        else {
            stopLoading()
            console.error('No archive adapter was found, please provide it using AtFormConfigProvider')
        }
    }

    const onViewImageClick: AtFormOnClickType = ({ startLoading, stopLoading }) => {
        startLoading()

        if (archive && archiveId) {
            archive.getFileContent({
                archiveId,
                purpose: 'preview',
                previewSize: { width: 600, height: 800 },
            })
                .then(res => {
                    const objectUrl = window.URL.createObjectURL(res)
                    setDialog(
                        <ViewImageDialog
                            image={objectUrl}
                            name={fileName}
                            onClose={() => {
                                window.URL.revokeObjectURL(objectUrl)
                                setDialog(null)
                            }}
                        />
                    )
                })
                .finally(() => stopLoading())
        }
        else {
            stopLoading()
            console.error('No archive adapter was found, please provide it using AtFormConfigProvider')
        }
    }

    return <Box
        sx={{
            width: '100%',
            height: '100%',
            textAlign: 'center',
            fontSize: '0.875rem',
            p: 0.75,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
            boxShadow: 1,
        }}
    >
        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{fileName}</Typography>
        {isImage(fileName) && <Box component="img" sx={{ width: 128, height: 128, objectFit: 'cover', borderRadius: 1, mt: 0.75 }} src={thumbnail} alt={fileName} />}
        {isImage(fileName) && <Button onClick={onViewImageClick} variant="text">{t('View')}</Button>}
        <Button onClick={onOpenClick} variant="text">
            {t('atform.file.downloadWithSize', 'Download ({size, number} kB)', {
                size: Math.ceil(size / 1024),
            })}
        </Button>
        {showRemoveIcon && <Tooltip title={t('Delete')} onClick={() => onRemove(archiveId)}>
            <IconButton color="error" sx={{ display: 'inline-block' }}><DeleteForeverTwoToneIcon /></IconButton>
        </Tooltip>}
        {dialog}
    </Box>
}

export default File;
