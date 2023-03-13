//MUI
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
//Style
import StyleClasses from './File.module.css';
//Components
import Button from '../../../Button/Button';
//Context
import { useContext, useEffect, useState } from 'react';
import ATFormContext from '../../../../ATFormContext/ATFormContext';

function isImage(url) {
    return /\.(jpg|jpeg|png|webp)$/.test(url);
}

const File = ({ id, name, size, onRemove, showRemoveIcon, authToken }) => {
    const { getFile, localText } = useContext(ATFormContext)
    const [thumbnail, setThumbnail] = useState('')

    useEffect(() => {
        if (id && name && getFile && isImage(name))
            getFile(id, authToken, 128, 128)
                .then(res => {
                    const objectURL = window.URL.createObjectURL(res)

                    setThumbnail(objectURL)
                })

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

    return <div className={StyleClasses.File}>
        <div className={StyleClasses.Name}>
            {name}
        </div>
        {
            isImage(name)
            &&
            <img style={{ width: '128px', height: '128px' }} src={thumbnail} alt={name} />
        }
        <Button onClick={onOpenClick} variant={'text'}>
            {localText['Download']}
            {`(${Math.ceil(size / 1024)} kB)`}
        </Button>
        {showRemoveIcon &&
            <Tooltip title={localText['Delete']} onClick={() => onRemove(id)}  >
                <IconButton sx={{ color: '#e91e63', display: 'inline-block' }}>
                    <DeleteForeverTwoToneIcon />
                </IconButton>
            </Tooltip>
        }
    </div>
}

export default File;