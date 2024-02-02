//Components
import Button from 'lib/component/ATForm/UI/Button/Button';
//Context
import { useContext, useEffect, useState } from 'react';
import ATFormContext from 'lib/component/ATForm/ATFormContext/ATFormContext';
import { Box, Grid, Typography } from '@mui/material';

function isImage(url) {
    return /\.(jpg|jpeg|png|webp)$/.test(url);
}

const File = ({ id, name, size, authToken, width, height }) => {
    const { getFile, localText } = useContext(ATFormContext)
    const [thumbnail, setThumbnail] = useState('')

    useEffect(() => {
        if (id && name && getFile && isImage(name))
            getFile(id, authToken, width, height)
                .then(res => {
                    const objectURL = window.URL.createObjectURL(res)

                    setThumbnail(objectURL)
                })

        // eslint-disable-next-line
    }, [id, name, authToken, getFile])

    const onOpenClick = (event, { startLoading, stopLoading }) => {
        startLoading()

        if (getFile) {
            getFile(id, authToken)
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
            console.error('No getFile was found, please provider it using ATFormContextProvider')
        }

    }

    return <Box sx={{ display: 'inline-block', border: '1px solid #c3c3c3', width: `${width}px`, height: `${height}px`, margin: '1px', borderRadius: '15px' }}>
        <Grid container direction={'row'} justifyContent={'center'} sx={{ width: `${width}px` }} >
            <Grid item xs={12} sx={{ height: '20px' }}>
                <Typography>
                    {name}
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ height: `${height - 50}px` }}>
                {
                    isImage(name)
                    &&
                    <img style={{ width: `${width}px`, height: `${height - 50}px` }} src={thumbnail} alt={name} />
                }
            </Grid>
            <Grid item xs={12} sx={{ height: '20px' }} justifyContent="flex-end">
                <Button onClick={onOpenClick} variant={'text'}>
                    {localText['Download']}
                    {`(${Math.ceil(size / 1024)} kB)`}
                </Button>
            </Grid>
        </Grid>
    </Box>
}

export default File;