//Components
import Button from '../../Button/Button';
//Context
import { useEffect, useState } from 'react';
import useAtFormConfig from '../../../../../hooks/useAtFormConfig/useAtFormConfig';
import { Box, Grid, Tooltip, Typography } from '@mui/material';
import { AtFormFileViewerFile } from '../../../../../types/ui/FileViewer.type';
import { AtFormOnClickType } from '../../../../../types/Common.type';

function isImage(fileName: string) {
    return /\.(jpg|jpeg|png|gif|webp|avif|bmp)$/i.test(fileName);
}

const File = ({ archiveId, fileName, size = 0, width, height }: AtFormFileViewerFile) => {
    const { archive, t } = useAtFormConfig()
    const [thumbnail, setThumbnail] = useState<string | undefined>(undefined)

    useEffect(() => {
        let objectUrl: string | undefined;

        if (archiveId && fileName && archive && isImage(fileName)) {
            archive.getFileContent({
                archiveId,
                purpose: 'preview',
                previewSize: { width, height },
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
    }, [archive, archiveId, fileName, height, width])

    const onOpenClick: AtFormOnClickType = ({ startLoading, stopLoading }) => {
        startLoading()

        if (archive) {
            archive.getFileContent({ archiveId, purpose: 'download' })
                .then(res => {
                    const anchor = document.createElement("a");
                    const objectUrl = window.URL.createObjectURL(res);

                    anchor.href = objectUrl;
                    anchor.download = fileName;
                    document.body.appendChild(anchor);
                    anchor.click();
                    anchor.remove();
                    window.URL.revokeObjectURL(objectUrl);
                })
                .finally(() => {
                    stopLoading()
                })
        }
        else {
            stopLoading()
            console.error('No archive adapter was found, please provide it using AtFormConfigProvider')
        }
    }

    return <Box sx={{ display: 'inline-block', border: 1, borderColor: 'divider', bgcolor: 'background.paper', width: `${width}px`, height: `${height}px`, margin: '1px', borderRadius: 1 }}>
        <Grid container direction={'row'} sx={{ width: `${width}px`, justifyContent: 'center' }} >
            <Grid size={12} sx={{ height: '20px', textAlign: 'center', marginBottom: '3px' }}>
                <Tooltip title={fileName} sx={{ fontWeight: 'bold' }}>
                    <Typography sx={{ fontWeight: 'bold', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maringRight: '5px', marginLeft: '5px' }}>
                        {fileName}
                    </Typography>
                </Tooltip>
            </Grid>
            <Grid size={12} sx={{ height: `${height - 65}px`, textAlign: 'center', justifyContent: 'center' }} >
                {
                    isImage(fileName)
                    &&
                    <Tooltip title={`${Math.ceil(size / 1024)} kB`}>
                        <Button variant={'text'}>
                            <img style={{ width: `${width - 20}px`, height: `${height - 65}px` }} src={thumbnail} alt={fileName} />
                        </Button>
                    </Tooltip>
                }
            </Grid>
            <Grid size={12} sx={{ height: '37px', marginTop: '5px', paddingTop: '3px', justifyContent: "flex-end" }} >
                <Button onClick={onOpenClick} variant={'text'} color="primary" sx={{ fontSize: '0.7rem', borderRadius: 0, borderEndEndRadius: 1, borderEndStartRadius: 1 }}>
                    {t('atform.file.downloadWithSize', 'Download ({size, number} kB)', {
                        size: Math.ceil(size / 1024),
                    })}
                </Button>
            </Grid>
        </Grid>
    </Box>
}

export default File;
