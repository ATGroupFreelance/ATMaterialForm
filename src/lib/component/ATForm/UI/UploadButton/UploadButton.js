import React, { useContext, useState } from 'react';

//MUI
import { InputAdornment, TextField } from '@mui/material';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import Add from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
//Components
import Button from '../Button/Button';
import ShowFilesIconButton from './ShowFilesIconButton/ShowFilesIconButton';
//Context
import ATFormContext from '../../ATFormContext/ATFormContext';
//Dialog
import ShowFilesDialog from './ShowFilesDialog/ShowFilesDialog';

const UploadButton = ({ _formProps_, label, onChange, value, disabled, accept, error, helperText, multiple = true, uploadButtonViewType = 1, authToken, readOnly }) => {
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
                uploadFilesToServer(formData, authToken)
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
            readOnly={disabled || readOnly}
            authToken={authToken}
            onSave={onShowFilesDialogSaveChangesClick}
            onClose={() => setDialog(null)}
        />)
    }

    const onShowFilesDialogSaveChangesClick = (event, { startLoading, stopLoading, removeIDList }) => {
        onChange({ target: { value: value.filter(item => !removeIDList.includes(item.id)) } })

        setDialog(null)
    }

    return <div style={{ ...(uploadButtonViewType === 1 ? { flex: 1, display: 'flex' } : { width: '100%' }) }}>
        {
            uploadButtonViewType === 1 &&
            <Button sx={{ height: '56px', margin: '0px', width: '45%', marginRight: '5px' }} variant="contained" component="label" loading={loading} disabled={disabled || readOnly}>
                {loading ? localText['Uploading'] : localText['Upload']}
                <input hidden multiple={multiple} type="file" accept={accept} onChange={onInternalChange} />
            </Button>
        }
        <TextField label={label} fullWidth={true} value={`${value.length} ${localText['files']}`} error={error} helperText={helperText}
            InputProps={
                {
                    startAdornment: uploadButtonViewType === 1 ?
                        null
                        :
                        <InputAdornment position="end">
                            <Button variant="text" fullWidth={true} component="label" loading={loading} disabled={disabled || readOnly} sx={{ marginRight: '3px' }}>
                                <Add fontSize='16' />
                                {loading ? localText['Uploading'] : localText['Upload']}
                                <input hidden multiple={multiple} type="file" accept={accept} onChange={onInternalChange} />
                            </Button>
                        </InputAdornment>,
                    endAdornment:
                        <InputAdornment position="end">
                            <ShowFilesIconButton sx={{ width: '10%' }} files={value} onClick={onShowFilesClick} label={localText['Show Files']} />
                            <Tooltip title={localText['Delete All']} sx={{ width: '10%' }}  >
                                <span>
                                    <IconButton disabled={value.length === 0 || disabled || readOnly} sx={{ color: '#e91e63' }} onClick={onRemoveFilesClick}>
                                        <DeleteForeverTwoToneIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </InputAdornment>

                }
            }
        />
        {dialog}
    </div>
}

export default UploadButton;