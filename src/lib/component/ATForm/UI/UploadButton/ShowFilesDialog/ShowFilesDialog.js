import React, { useContext, useState } from 'react';

//MUI
import Button from '../../Button/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';

//Components
import File from './File/File';
//Context
import ATFormContext from 'lib/component/ATForm/ATFormContext/ATFormContext';

const ShowFilesDialog = ({ onSave, onClose, files, readOnly, authToken }) => {
    const { localText } = useContext(ATFormContext)

    const [removeIDList, setRemoveIDList] = useState([])

    const onFileRemoveClick = (id) => {
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
                {files.filter(item => !removeIDList.includes(item.id)).map(item => {
                    return <Grid key={item.id} item xs={12} md={6}>
                        <File authToken={authToken} {...item} onRemove={onFileRemoveClick} showRemoveIcon={!readOnly} />
                    </Grid>
                })}
            </Grid>
        </DialogContent>
        <DialogActions>
            {!readOnly && <Button onClick={(event, { startLoading, stopLoading }) => onSave(event, { startLoading, stopLoading, removeIDList })} disabled={!removeIDList.length}>{localText['Save']}</Button>}
            <Button onClick={onClose}>{localText['Cancel']}</Button>
        </DialogActions>
    </Dialog>
}

export default ShowFilesDialog;