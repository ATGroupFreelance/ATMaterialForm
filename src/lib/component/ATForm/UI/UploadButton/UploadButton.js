import React, { useState } from 'react';

//MUI
import { TextField } from '@mui/material';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
//Components
import Button from '../Button/Button';
import ShowFilesIconButton from './ShowFilesIconButton/ShowFilesIconButton';

const UploadButton = ({ _formProps_, label, onChange, defaultValue, disabled }) => {
    const { onLockdownChange, serviceManager } = _formProps_
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState(defaultValue || [])

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
                formData.append(`file${index}`, file)
            })

            setLoading(true)
            if (onLockdownChange)
                onLockdownChange(true)

            if (serviceManager) {
                serviceManager.uploadFilesToServer(formData)
                    .then(res => {
                        setFiles((prevFiles) => {
                            const newFiles = [
                                ...prevFiles,
                                ...res,
                            ]

                            onChange({ target: { value: newFiles } })

                            return newFiles
                        })
                    })
                    .finally(() => {
                        setLoading(false)
                        if (onLockdownChange)
                            onLockdownChange(false)
                    })
            }
            else {
                onChange({ target: { value: ['No service manager was found, please assign one!'] } })
                setLoading(false)
                if (onLockdownChange)
                    onLockdownChange(false)
            }
        }
    }

    const onRemoveSingleFileClick = (id) => {
        setFiles((prevFiles) => {
            return prevFiles.filter(item => item.id !== id)
        })
    }

    const onRemoveFilesClick = () => {
        setFiles([])
        onChange({ target: { value: [] } })
    }

    return <div style={{ flex: 1, display: 'flex' }}>
        <Button sx={{ height: '50px', marginTop: '4px', width: '38%' }} variant="contained" component="label" loading={loading} disabled={disabled}>
            {loading ? 'Uploading' : 'Add Files'}
            <input hidden multiple type="file" accept={'.pdf'} onChange={onInternalChange} />
        </Button>
        <TextField label={label} sx={{ width: '38%', paddingLeft: '6px' }} value={`${files.length} files`} />
        <ShowFilesIconButton sx={{ width: '10%' }} files={files} onRemove={disabled ? null : onRemoveSingleFileClick} />
        <Tooltip title={'Delete All'} sx={{ width: '10%' }}  >
            <span>
                <IconButton disabled={files.length === 0 || disabled} sx={{ color: '#e91e63' }} onClick={onRemoveFilesClick}>
                    <DeleteForeverTwoToneIcon />
                </IconButton>
            </span>
        </Tooltip>
    </div>
}

export default UploadButton;