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
import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';
//Dialog
import ShowFilesDialog from './ShowFilesDialog/ShowFilesDialog';
import AtToast from '../../../AtToast/AtToast';
import { AtFormButtonFileType, AtFormUploadButtonProps } from '../../../../types/ui/UploadButton.type';
import useAtForm from '../../../../hooks/useAtForm/useAtForm';
import { AtFormOnClickType } from '../../../../types/Common.type';
import TextBox from '../TextBox/TextBox';

const UploadButton = ({ id, onChange, value = [], disabled, accept, error, helperText, multiple = true, uploadButtonViewType = 1, archiveUploadOptions, readOnly }: AtFormUploadButtonProps) => {
    const { onLockdownChange } = useAtForm()
    const { archive, t, maxUploadFileSizeInBytes } = useAtFormConfig()

    const [loading, setLoading] = useState(false)
    const [dialog, setDialog] = useState<any>(null)
    const filesValue = Array.isArray(value) ? value as AtFormButtonFileType[] : []

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
        const selectedFiles: File[] = event.target.files ? Array.from(event.target.files) : []

        if (selectedFiles.length > 0) {
            const filesSizeSum = selectedFiles.reduce((sum, file) => sum + file.size, 0)

            if (maxUploadFileSizeInBytes && filesSizeSum > maxUploadFileSizeInBytes) {
                AtToast.error(t('File size exceeds the limit. Please select a smaller file'))
                return null;
            }

            setLoading(true)
            if (onLockdownChange && id)
                onLockdownChange(id, true)

            if (archive) {
                archive.uploadFiles({
                    files: selectedFiles,
                    options: archiveUploadOptions,
                })
                    .then(res => {
                        const newValue = [
                            ...filesValue,
                            ...res,
                        ]

                        if (onChange)
                            onChange({ target: { value: newValue } })
                    })
                    .catch((uploadError) => {
                        console.error(uploadError)
                    })
                    .finally(() => {
                        setLoading(false)
                        if (onLockdownChange && id)
                            onLockdownChange(id, false)
                    })
            }
            else {
                AtToast.error(t('No archive adapter was configured for AtForm.'))
                setLoading(false)
                if (onLockdownChange && id)
                    onLockdownChange(id, false)
            }
        }
    }

    const onRemoveFilesClick = () => {
        if (onChange)
            onChange({ target: { value: [] } })
    }

    const onShowFilesClick = () => {
        setDialog(
            <ShowFilesDialog
                files={filesValue}
                readOnly={disabled || !!readOnly}
                onSave={onShowFilesDialogSaveChangesClick}
                onClose={() => setDialog(null)}
            />
        )
    }

    const onShowFilesDialogSaveChangesClick: AtFormOnClickType = ({ removeArchiveIdList }) => {
        if (onChange)
            onChange({ target: { value: filesValue.filter((item: AtFormButtonFileType) => !removeArchiveIdList.includes(item.archiveId)) } })

        setDialog(null)
    }

    return <div style={{ ...(uploadButtonViewType === 1 ? { flex: 1, display: 'flex' } : { width: '100%' }) }}>
        {
            uploadButtonViewType === 1 &&
            <Button sx={{ height: '56px', margin: '0px', width: '45%', marginRight: '5px' }} variant="contained" component="label" loading={loading} disabled={disabled || readOnly}>
                {loading ? t('Uploading') : t('Upload')}
                <input hidden multiple={multiple} type="file" accept={accept} onChange={onInternalChange} />
            </Button>
        }
        <TextBox
            fullWidth={true}
            value={t('atform.upload.fileCount', { count: filesValue.length })}
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
                                    <Add fontSize='small' />
                                    {loading ? t('Uploading') : t('Upload')}
                                    <input hidden multiple={multiple} type="file" accept={accept} onChange={onInternalChange} />
                                </Button>
                            </InputAdornment>,
                        endAdornment:
                            <InputAdornment position="end">
                                <ShowFilesIconButton sx={{ color: 'primary.main' }} files={filesValue} onClick={onShowFilesClick} label={t('Show Files')} />
                                <Tooltip title={t('Delete All')}>
                                    <span>
                                        <IconButton disabled={filesValue.length === 0 || disabled || readOnly} color={'error'} onClick={onRemoveFilesClick}>
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
