//Components
import Button from '@/lib/component/ATForm/UI/Button/Button';
//Context
import { useEffect, useState } from 'react';
import useATFormConfig from '../../../../../hooks/useATFormConfig/useATFormConfig';
import { Box, Grid, Tooltip, Typography } from '@mui/material';
import { useTheme } from "@mui/material";
import { ATFormFileViewerFile } from '@/lib/types/ui/FileViewer.type';
import { ATFormOnClickType } from '@/lib/types/Common.type';

function isImage(url: any) {
    return /\.(jpg|jpeg|png|webp)$/.test(url);
}

const File = ({ id, name, size, authToken, width, height }: ATFormFileViewerFile) => {
    const theme = useTheme()
    const { getFile, localText } = useATFormConfig()
    const [thumbnail, setThumbnail] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (id && name && getFile && isImage(name))
            getFile({ id, authToken, width, height })
                .then(res => {
                    const objectURL = window.URL.createObjectURL(res)

                    setThumbnail(objectURL)
                })

        // eslint-disable-next-line
    }, [id, name, authToken, getFile])

    const onOpenClick: ATFormOnClickType = ({ startLoading, stopLoading }) => {
        startLoading()

        if (getFile) {
            getFile({ id, authToken })
                .then(res => {
                    const a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";
                    const _url = window.URL.createObjectURL(res);
                    a.href = _url;
                    a.download = name;
                    a.click();
                })
                .finally(() => {
                    stopLoading()
                })
        }
        else {
            stopLoading()
            console.error('No getFile was found, please provider it using ATFormConfigProvider')
        }

    }

    return <Box sx={{ display: 'inline-block', border: '1px solid #c3c3c3', width: `${width}px`, height: `${height}px`, margin: '1px', borderRadius: '15px' }}>
        <Grid container direction={'row'} justifyContent={'center'} sx={{ width: `${width}px` }} >
            <Grid size={12} sx={{ height: '20px', textAlign: 'center', marginBottom: '3px' }}>
                <Tooltip title={name} sx={{ fontWeight: 'bold' }}>
                    <Typography sx={{ fontWeight: 'bold', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maringRight: '5px', marginLeft: '5px' }}>
                        {name}
                    </Typography>
                </Tooltip>
            </Grid>
            <Grid size={12} sx={{ height: `${height - 65}px`, textAlign: 'center' }} justifyContent={'center'}>
                {
                    isImage(name)
                    &&
                    <Tooltip title={`${Math.ceil(size / 1024)} kB`}>
                        <Button variant={'text'}>
                            <img style={{ width: `${width - 20}px`, height: `${height - 65}px` }} src={thumbnail} alt={name} />
                        </Button>
                    </Tooltip>
                }
            </Grid>
            <Grid size={12} sx={{ height: '37px', marginTop: '5px', paddingTop: '3px' }} justifyContent="flex-end">
                <Button onClick={onOpenClick} variant={'text'} sx={{ fontSize: '0.7rem', borderRadius: '0px', borderBottomRightRadius: '15px', borderBottomLeftRadius: '15px', ...(theme?.atConfig?.fileViewer?.file?.downloadButton || {}) }}>
                    {localText['Download']}
                    {`(${Math.ceil(size / 1024)} kB)`}
                </Button>
            </Grid>
        </Grid>
    </Box>
}

export default File;