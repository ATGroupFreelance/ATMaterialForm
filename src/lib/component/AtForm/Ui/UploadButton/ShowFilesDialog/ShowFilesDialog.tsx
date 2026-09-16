import { useState } from 'react';

//MUI
import Button from '../../Button/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, Typography } from '@mui/material';

//Components
import File from './File/File';
//Context
import useAtFormConfig from '../../../../../hooks/useAtFormConfig/useAtFormConfig';
import { AtFormUploadButtonShowFilesDialogProps } from '../../../../../types/ui/UploadButton.type';

const ShowFilesDialog = ({ onSave, onClose, files, readOnly }: AtFormUploadButtonShowFilesDialogProps) => {
    const { t } = useAtFormConfig()
    const [removeArchiveIdList, setRemoveArchiveIdList] = useState<string[]>([])

    const onFileRemoveClick = (archiveId: string) => {
        setRemoveArchiveIdList((prevList) => [
            ...prevList,
            archiveId,
        ])
    }

    return <Dialog open={true} onClose={onClose} fullWidth={true}>
        <DialogTitle>{t('View Uploaded Files')}</DialogTitle>
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                {
                    files && Array.isArray(files) && files.length ?
                        files
                            .filter(item => !removeArchiveIdList.includes(item.archiveId))
                            .map(item => {
                                return <Grid key={item.archiveId} size={{ xs: 12, md: 6 }}>
                                    <File {...item} onRemove={onFileRemoveClick} showRemoveIcon={!readOnly} />
                                </Grid>
                            })
                        :
                        <Grid size={12} sx={{ textAlign: 'center', justifyContent: 'center' }} >
                            <Typography>
                                {t('There are no files to view')}
                            </Typography>
                        </Grid>
                }
            </Grid>
        </DialogContent>
        <DialogActions>
            {
                !readOnly && onSave
                &&
                <Button
                    onClick={(props) => onSave({ ...props, removeArchiveIdList })}
                    disabled={!removeArchiveIdList.length}>
                    {t('Save')}
                </Button>
            }
            <Button onClick={onClose}>{t('Cancel')}</Button>
        </DialogActions>
    </Dialog>
}

export default ShowFilesDialog;
