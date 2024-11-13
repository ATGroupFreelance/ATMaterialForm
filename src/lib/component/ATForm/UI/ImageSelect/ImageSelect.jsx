import React, { useContext, useEffect, useState } from 'react';

//Context
import ATFormContext from '../../ATFormContext/ATFormContext';
//UI
import Button from '@mui/material/Button';
import { Grid, Typography, Box } from '@mui/material';

// const Image = ({ id, name, src, onClick, imageWidth, imageHeight, selected }) => {
//     console.log('isSelected', selected)
//     return <MUIButton variant={'outlined'} onClick={onClick} sx={{ width: '100%', height: '100%', borderColor: selected ? '#3070F9' : 'black', borderWidth: selected ? '3px' : '1px' }}>
//         <img alt={name || id} src={src} style={{ borderRadius: '10px', margin: '2px' }} />
//     </MUIButton>

// }

const Image = ({ id, name, src, onClick, imageWidth, imageHeight, selected }) => {
    const buttonStyle = {
        display: 'inline-block',
        textAlign: '-webkit-center',
        width: `${imageWidth + 18}px`,
        height: `${imageHeight + 18}px`,
        padding: '1px',
        textTransform: 'none',
        ...(!selected ? {} : {
            border: 'double 1px transparent',
            borderRadius: '20px',
            backgroundOrigin: 'border-box',
            backgroundClip: 'content-box, border-box',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #46BFAE, #2865B3)'
            // 'linear-gradient(#46BFAE, #2865B3) 30'
        })
    }

    return <Button sx={buttonStyle} onClick={onClick} variant={'text'} color={selected ? 'secondary' : 'primary'}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img alt={name || id} src={src} style={{ borderRadius: '10px', width: `${imageWidth}px`, height: `${imageHeight}px` }} />
        </div>
    </Button>
}

const ImageSelect = ({ _formProps_, id, authToken, label, imageWidth = 128, imageHeight = 128, onChange, value, multiple = false, imageGrid = null, ...restProps }) => {
    const { getFile } = useContext(ATFormContext)
    const [data, setData] = useState([])

    useEffect(() => {
        Promise.all(
            value.map(item => {
                return new Promise((resolve, reject) => {
                    const found = data.find(dataItem => dataItem.id === item.id)

                    if (found)
                        resolve({
                            ...found,
                            ...item
                        })
                    else
                        getFile(item.id, authToken, imageWidth, imageHeight)
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
            .then(filesRes => {
                setData(filesRes.map(item => {
                    return {
                        selected: false,
                        ...item,
                    }
                }))
            })

        // eslint-disable-next-line
    }, [value, authToken])

    const onImageClick = ({ id, ...props }) => {
        const newValue = value.map(item => {
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
                    return <Grid key={item.id} item md={3} {...(imageGrid || {})}><Image {...item} imageWidth={imageWidth} imageHeight={imageHeight} onClick={() => onImageClick(item)} /></Grid>
                })
            }
        </Grid>
    </Box>
}

export default ImageSelect;