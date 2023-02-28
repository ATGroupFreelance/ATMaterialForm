import React, { useContext, useState } from 'react';

//MUI
import { TextField } from '@mui/material';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
//Components
import Button from '../Button/Button';
import ShowFilesIconButton from './ShowFilesIconButton/ShowFilesIconButton';
//Context
import ATFormContext from '../../ATFormContext/ATFormContext';
//Dialog
import ShowFilesDialog from './ShowFilesDialog/ShowFilesDialog';

const UploadButton = ({ _formProps_, label, onChange, value, disabled, accept, error, helperText }) => {
    const { onLockdownChange } = _formProps_
    const { uploadFilesToServer, localText } = useContext(ATFormContext)

    const [loading, setLoading] = useState(false)
    const [dialog, setDialog] = useState(null)

    const onInternalChange = (event) => {
        //selectedFiles is an object
        //the object has keys which start from 0 for each file
        //This kinda object should be treated like an array so use for (i = 0...) not for i in !! 
        //the value of each key is an object itself which contains : 
        // lastModified: 1588580785366
        // lastModifiedDate: Mon May 04 2020 12:56:25
        // name: "Marker3.png"
        // size: 4402
        // type: "image/png"
        // webkitRelativePath: ""
        const selectedFiles = Array.from(event.target.files)
        if (selectedFiles.length > 0) {
            const formData = new FormData()
            selectedFiles.forEach((file, index) => {
                formData.append(`${localText['file']}${index}`, file)
            })

            setLoading(true)
            if (onLockdownChange)
                onLockdownChange(true)

            if (uploadFilesToServer) {
                uploadFilesToServer(formData)
                    .then(res => {
                        const newValue = [
                            ...value,
                            ...res,
                        ]

                        onChange({ target: { value: newValue } })
                    })
                    .finally(() => {
                        setLoading(false)
                        if (onLockdownChange)
                            onLockdownChange(false)
                    })
            }
            else {
                onChange({ target: { value: ['No uploadFilesToServer was found, please assign one usnig ATFormContextProvider!'] } })
                setLoading(false)
                if (onLockdownChange)
                    onLockdownChange(false)
            }
        }
    }


    const onRemoveFilesClick = () => {
        onChange({ target: { value: [] } })
    }

    const onShowFilesClick = () => {
        setDialog(<ShowFilesDialog
            files={value}
            readOnly={disabled}
            onSave={onShowFilesDialogSaveChangesClick}
            onClose={() => setDialog(null)}
        />)
    }

    const onShowFilesDialogSaveChangesClick = (event, { startLoading, stopLoading, removeIDList }) => {
        onChange({ target: { value: value.filter(item => !removeIDList.includes(item.id)) } })

        setDialog(null)
    }

    return <div style={{ flex: 1, display: 'flex' }}>
        <Button sx={{ height: '50px', marginTop: '4px', width: '38%' }} variant="contained" component="label" loading={loading} disabled={disabled}>
            {loading ? localText['Uploading'] : localText['Add Files']}
            <input hidden multiple type="file" accept={accept} onChange={onInternalChange} />
        </Button>
        <TextField label={label} sx={{ width: '38%', paddingLeft: '6px' }} value={`${value.length} ${localText['files']}`} error={error} helperText={helperText} />
        <ShowFilesIconButton sx={{ width: '10%' }} files={value} onClick={onShowFilesClick} />
        <Tooltip title={localText['Delete All']} sx={{ width: '10%' }}  >
            <span>
                <IconButton disabled={value.length === 0 || disabled} sx={{ color: '#e91e63' }} onClick={onRemoveFilesClick}>
                    <DeleteForeverTwoToneIcon />
                </IconButton>
            </span>
        </Tooltip>
        {dialog}
    </div>
}

export default UploadButton;