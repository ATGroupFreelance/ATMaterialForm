import { ChangeEvent, useState } from 'react';

//MUI
import { InputAdornment } from '@mui/material';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import Add from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
//Components
import Button from '../Button/Button';
import ShowFilesIconButton from './ShowFilesIconButton/ShowFilesIconButton';
//Context
import useATFormConfig from '../../../../hooks/useATFormConfig/useATFormConfig';
//Dialog
import ShowFilesDialog from './ShowFilesDialog/ShowFilesDialog';
import { useTheme } from "@mui/material";
import ATToast from '@/lib/component/ATToast/ATToast';
import { ATFormButtonFileType, ATFormUploadButtonProps } from '@/lib/types/ui/UploadButton.type';
import useATForm from '@/lib/hooks/useATForm/useATForm';
import { ATFormOnClickType } from '@/lib/types/Common.type';
import TextBox from '../TextBox/TextBox';

const UploadButton = ({ id, onChange, value, disabled, accept, error, helperText, multiple = true, uploadButtonViewType = 1, authToken, readOnly }: ATFormUploadButtonProps) => {
    const theme = useTheme()
    const { onLockdownChange } = useATForm()
    const { uploadFilesToServer, localText, maxUploadFileSizeInBytes } = useATFormConfig()

    const [loading, setLoading] = useState(false)
    const [dialog, setDialog] = useState<any>(null)

    const onInternalChange = (event: ChangeEvent<HTMLInputElement>) => {
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
        const selectedFiles = event.target.files ? Array.from(event.target.files) : []

        if (selectedFiles.length > 0) {
            let filesSizeSum = 0

            const formData = new FormData()
            selectedFiles.forEach((file, index) => {
                formData.append(`${localText['file']}${index}`, file)
                filesSizeSum = filesSizeSum + file.size
            })

            if (maxUploadFileSizeInBytes) {
                if (filesSizeSum > maxUploadFileSizeInBytes) {
                    ATToast.error(localText[`File size exceeds the limit. Please select a smaller file`])
                    return null;
                }
            }

            setLoading(true)
            if (onLockdownChange && id)
                onLockdownChange(id, true)

            if (uploadFilesToServer) {
                uploadFilesToServer({ files: formData, authToken })
                    .then(res => {
                        const newValue = [
                            ...value,
                            ...res,
                        ]

                        onChange({ target: { value: newValue } })
                    })
                    .finally(() => {
                        setLoading(false)
                        if (onLockdownChange && id)
                            onLockdownChange(id, false)
                    })
            }
            else {
                onChange({ target: { value: ['No uploadFilesToServer was found, please assign one usnig ATFormConfigProvider!'] } })
                setLoading(false)
                if (onLockdownChange && id)
                    onLockdownChange(id, false)
            }
        }
    }


    const onRemoveFilesClick = () => {
        onChange({ target: { value: [] } })
    }

    const onShowFilesClick = () => {
        setDialog(
            <ShowFilesDialog
                files={value}
                readOnly={disabled || !!readOnly}
                authToken={authToken}
                onSave={onShowFilesDialogSaveChangesClick}
                onClose={() => setDialog(null)}
            />
        )
    }

    const onShowFilesDialogSaveChangesClick: ATFormOnClickType = (_event, { removeIDList }) => {
        onChange({ target: { value: value.filter((item: ATFormButtonFileType) => !removeIDList.includes(item.id)) } })

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
        <TextBox
            fullWidth={true}
            value={`${value.length} ${localText['files']}`}
            error={error}
            helperText={helperText}
            slotProps={
                {
                    input: {
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
                                <ShowFilesIconButton sx={theme?.atConfig?.uploadButton?.showFilesIcon} files={value} onClick={onShowFilesClick} label={localText['Show Files']} />
                                <Tooltip title={localText['Delete All']}   >
                                    <span>
                                        <IconButton disabled={value.length === 0 || disabled || readOnly} color={'error'} sx={theme?.atConfig?.uploadButton?.removeIcon} onClick={onRemoveFilesClick}>
                                            <DeleteForeverTwoToneIcon />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </InputAdornment>
                    }
                }
            }
        />
        {dialog}
    </div>
}

export default UploadButton;