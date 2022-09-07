import React, { useState } from 'react';

//MUI
import Button from '../../../Button/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';

//Components
import File from './File/File';

const ShowFilesDialog = ({ onClose, files, onRemove }) => {
    const [dialogFiles, setDialogFiles] = useState(files)

    const onFileRemoveClick = (id) => {
        onRemove(id)

        setDialogFiles((prevFiles) => {
            return prevFiles.filter(item => item.id !== id)
        })
    }

    return <Dialog open={true} onClose={onClose} fullWidth={true}>
        <DialogTitle>View Uploaded Files</DialogTitle>
        <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: '20px' }}>
                {dialogFiles.map(item => {
                    return <Grid key={item.id} item xs={12} md={6}>
                        <File {...item} onRemove={onFileRemoveClick} showRemoveIcon={onRemove}/>
                    </Grid>
                })}
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
    </Dialog>
}

export default ShowFilesDialog;