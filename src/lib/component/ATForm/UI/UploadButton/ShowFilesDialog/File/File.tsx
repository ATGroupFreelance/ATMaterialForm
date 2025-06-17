//MUI
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
//Style
import StyleClasses from './File.module.css';
//Components
import Button from '../../../Button/Button';
//Context
import { useEffect, useState } from 'react';
import useATFormConfig from '../../../../../../hooks/useATFormConfig/useATFormConfig';
import ViewImageDialog from './ViewImageDialog/ViewImageDialog';
import { ATFormUploadButtonFileProps } from '@/lib/types/ui/UploadButton.type';
import { ATFormOnClickType } from '@/lib/types/Common.type';

function isImage(url: string) {
    return /\.(jpg|jpeg|png|webp)$/.test(url);
}

const File = ({ id, name, size, onRemove, showRemoveIcon, authToken }: ATFormUploadButtonFileProps) => {
    const { getFile, localText } = useATFormConfig()
    const [thumbnail, setThumbnail] = useState<string | undefined>(undefined)
    const [dialog, setDialog] = useState<any>(null)

    useEffect(() => {
        if (id && name && getFile && isImage(name))
            getFile({ id, authToken, width: 128, height: 128 })
                .then(res => {
                    const objectURL = window.URL.createObjectURL(res)

                    setThumbnail(objectURL)
                })

    }, [id, name, authToken, getFile])

    const onOpenClick: ATFormOnClickType = ({ startLoading, stopLoading }) => {
        startLoading()

        if (getFile && id) {
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

    const onViewImageClick: ATFormOnClickType = ({ startLoading, stopLoading }) => {
        startLoading()

        if (getFile && id) {
            getFile({ id, authToken, width: 600, height: 800 })
                .then(res => {
                    const objectURL = window.URL.createObjectURL(res)

                    setDialog(
                        <ViewImageDialog
                            image={objectURL}
                            name={name}
                            onClose={() => setDialog(null)}
                        />
                    )
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

    return <div className={StyleClasses.File}>
        <div className={StyleClasses.Name}>
            {name}
        </div>
        {
            isImage(name)
            &&
            <img style={{ width: '128px', height: '128px' }} src={thumbnail} alt={name} />
        }
        {
            isImage(name)
            &&
            <Button onClick={onViewImageClick} variant={'text'}>
                {localText['View']}
            </Button>
        }
        <Button onClick={onOpenClick} variant={'text'}>
            {localText['Download']}
            {`(${Math.ceil(size / 1024)} kB)`}
        </Button>
        {
            showRemoveIcon
            &&
            <Tooltip title={localText['Delete']} onClick={() => onRemove(id)}  >
                <IconButton color={'error'} sx={{ display: 'inline-block' }}>
                    <DeleteForeverTwoToneIcon />
                </IconButton>
            </Tooltip>
        }
        {dialog}
    </div>
}

export default File;