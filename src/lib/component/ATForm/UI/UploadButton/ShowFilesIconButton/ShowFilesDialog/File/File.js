//MUI
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
//Style
import StyleClasses from './File.module.css';
//Components
import Button from '../../../../Button/Button';
//Context
import { useContext } from 'react';
import ATFormContext from '../../../../../ATFormContext/ATFormContext';

const File = ({ id, name, size, onRemove, showRemoveIcon }) => {
    const { getFile } = useContext(ATFormContext)

    const onOpenClick = (event, { startLoading, stopLoading }) => {
        startLoading()

        if (getFile) {
            getFile(id)
                .then(res => {
                    const a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";
                    const _url = window.URL.createObjectURL(res.data);
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
        <Button onClick={onOpenClick}>
            download
            {`(${Math.ceil(size / 1024)} kB)`}

        </Button>
        {showRemoveIcon &&
            <Tooltip title={'Delete'} onClick={() => onRemove(id)}  >
                <IconButton sx={{ color: '#e91e63', display: 'inline-block' }}>
                    <DeleteForeverTwoToneIcon />
                </IconButton>
            </Tooltip>
        }
    </div>
}

export default File;