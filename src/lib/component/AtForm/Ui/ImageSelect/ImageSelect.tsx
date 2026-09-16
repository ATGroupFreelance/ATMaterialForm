import { useEffect, useState } from 'react';

//Context
import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';
//UI
import { Grid, Typography, Box } from '@mui/material';
import { AtFormImageSelectImageProps, AtFormImageSelectProps, AtFormImageSelectValue } from '../../../../types/ui/ImageSelect.type';
import Image from './Image/Image';

const ImageSelect = ({ id, label, width = 128, height = 128, onChange, value, multiple, imageWrapperProps }: AtFormImageSelectProps) => {
    void id;

    const { archive } = useAtFormConfig()
    const [data, setData] = useState<Array<AtFormImageSelectImageProps>>([])

    useEffect(() => {
        if (!Array.isArray(value)) {
            setData([])
            return
        }

        if (!archive) {
            setData([])
            console.error('No archive adapter was found, please provide it using AtFormConfigProvider')
            return
        }

        let cancelled = false
        const objectUrls: string[] = []

        Promise.all(
            value.map(async (item: AtFormImageSelectValue): Promise<AtFormImageSelectImageProps> => {
                const content = await archive.getFileContent({
                    archiveId: item.archiveId,
                    purpose: 'preview',
                    previewSize: { width, height },
                })
                const objectUrl = window.URL.createObjectURL(content)
                objectUrls.push(objectUrl)

                return {
                    ...item,
                    src: objectUrl,
                    width,
                    height,
                    onClick: undefined,
                }
            })
        )
            .then(filesRes => {
                if (!cancelled)
                    setData(filesRes)
            })
            .catch(console.error)

        return () => {
            cancelled = true
            objectUrls.forEach(url => window.URL.revokeObjectURL(url))
        }
    }, [archive, height, value, width])

    const onImageClick = ({ archiveId }: AtFormImageSelectImageProps) => {
        if (!Array.isArray(value))
            return

        const newValue = value.map((item: AtFormImageSelectValue) => ({
            ...item,
            selected: item.archiveId === archiveId
                ? !item.selected
                : multiple
                    ? item.selected
                    : false,
        }))

        if (onChange)
            onChange({ target: { value: newValue } })
    }

    return <Box style={{ width: '100%', textAlign: 'center', paddingBottom: '6px' }}>
        <Typography variant={'h5'} sx={{ fontWeight: 'bold' }} >
            {label}
        </Typography>
        <Grid container spacing={2} sx={{ textAlign: 'center', marginTop: '3px', justifyContent: 'center' }} >
            {
                data.map(item => {
                    return <Grid key={item.archiveId} size={3} {...(imageWrapperProps || {})}>
                        <Image {...item} width={width} height={height} onClick={() => onImageClick(item)} />
                    </Grid>
                })
            }
        </Grid>
    </Box>
}

export default ImageSelect;
