import React, { useState } from 'react';

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
import useATFormConfig from '../../../../../hooks/useATFormConfig/useATFormConfig';
import { ATFormUploadButtonShowFilesDialogProps } from '@/lib/types/ui/UploadButton.type';

const ShowFilesDialog = ({ onSave, onClose, files, readOnly, authToken }: ATFormUploadButtonShowFilesDialogProps) => {
    const { localText } = useATFormConfig()

    console.log('files', files)

    const [removeIDList, setRemoveIDList] = useState<string[]>([])

    const onFileRemoveClick = (id: string) => {
        setRemoveIDList((prevList) => {
            return [
                ...prevList,
                id
            ]
        })
    }

    return <Dialog open={true} onClose={onClose} fullWidth={true}>
        <DialogTitle>{localText['View Uploaded Files']}</DialogTitle>
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                {
                    files && Array.isArray(files) && files.length ?
                        files.filter(item => item.id !== undefined && !removeIDList.includes(item.id)).map(item => {
                            return <Grid key={item.id} size={{ xs: 12, md: 6 }}>
                                <File authToken={authToken} {...item} onRemove={onFileRemoveClick} showRemoveIcon={!readOnly} />
                            </Grid>
                        })
                        :
                        <Grid size={12} sx={{ textAlign: 'center' }} justifyContent={'center'}>
                            <Typography>
                                {localText['There are no files to view']}
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
                    onClick={(event, { startLoading, stopLoading }) => onSave(event, { startLoading, stopLoading, removeIDList })}
                    disabled={!removeIDList.length}>
                    {localText['Save']}
                </Button>
            }
            <Button onClick={onClose}>{localText['Cancel']}</Button>
        </DialogActions>
    </Dialog>
}

export default ShowFilesDialog;