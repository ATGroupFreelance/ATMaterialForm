import { useEffect, useState } from 'react';

//Context
import useATFormConfig from '../../../../hooks/useATFormConfig/useATFormConfig';
//UI
import { Grid, Typography, Box } from '@mui/material';
import { ATFormImageSelectImageProps, ATFormImageSelectProps } from '@/lib/types/ui/ImageSelect.type';
import Image from './Image/Image';

const ImageSelect = ({ id, authToken, label, width = 128, height = 128, onChange, value, multiple, imageWrapperProps }: ATFormImageSelectProps) => {
    void id;

    const { getFile } = useATFormConfig()
    const [data, setData] = useState<Array<ATFormImageSelectImageProps>>([])

    useEffect(() => {
        if (value)
            Promise.all(
                value.map((item: any): Promise<ATFormImageSelectImageProps> => {
                    return new Promise((resolve, reject) => {
                        const found = data.find(dataItem => dataItem.id === item.id)

                        if (found)
                            resolve({
                                ...found,
                                ...item
                            })
                        else
                            getFile({ id: item.id, authToken, width, height })
                                .then(res => {
                                    const objectURL = window.URL.createObjectURL(res)

                                    resolve({
                                        ...item,
                                        src: objectURL,
                                    })
                                })
                                .catch((err) => {
                                    reject(err)
                                })
                    })
                })
            )
                .then((filesRes: Array<ATFormImageSelectImageProps>) => {
                    setData(filesRes.map(item => {
                        return {
                            ...item,
                            selected: false,
                        }
                    }))
                })

        // eslint-disable-next-line
    }, [value, authToken])

    const onImageClick = ({ id }: ATFormImageSelectImageProps) => {
        const newValue = value.map((item: any) => {
            let newSelected = item.selected

            if (item.id === id)
                newSelected = !newSelected
            else if (!multiple)
                newSelected = false

            console.log('id newSelected', id, newSelected)

            return {
                ...item,
                selected: newSelected,
            }
        })


        if (onChange) {
            onChange({ target: { value: newValue } })
        }
    }

    console.log('value', data, value)

    return <Box style={{ width: '100%', textAlign: 'center', paddingBottom: '6px' }}>
        <Typography variant={'h5'} sx={{ fontWeight: 'bold' }} >
            {label}
        </Typography>
        <Grid container spacing={2} justifyContent={'center'} sx={{ textAlign: 'center', marginTop: '3px' }} >
            {
                data.map(item => {
                    return <Grid key={item.id} size={3} {...(imageWrapperProps || {})}>
                        <Image {...item} width={width} height={height} onClick={() => onImageClick(item)} />
                    </Grid>
                })
            }
        </Grid>
    </Box>
}

export default ImageSelect;