import React, { useContext, useState } from 'react';

//MUI
import Button from '../../Button/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid2, Typography } from '@mui/material';

//Components
import File from './File/File';
//Context
import ATFormContext from '@/lib/component/ATForm/ATFormContext/ATFormContext';

const ShowFilesDialog = ({ onSave, onClose, files, readOnly, authToken }) => {
    const { localText } = useContext(ATFormContext)

    console.log('files', files)

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
            <Grid2 container spacing={2} sx={{ marginTop: '20px' }}>
                {
                    files && Array.isArray(files) && files.length ?
                        files.filter(item => !removeIDList.includes(item.id)).map(item => {
                            return <Grid2 key={item.id} size={{ xs: 12, md: 6 }}>
                                <File authToken={authToken} {...item} onRemove={onFileRemoveClick} showRemoveIcon={!readOnly} />
                            </Grid2>
                        })
                        :
                        <Grid2 size={12} sx={{ textAlign: 'center' }} justifyContent={'center'}>
                            <Typography>
                                {localText['There are no files to view']}
                            </Typography>
                        </Grid2>
                }
            </Grid2>
        </DialogContent>
        <DialogActions>
            {!readOnly && <Button onClick={(event, { startLoading, stopLoading }) => onSave(event, { startLoading, stopLoading, removeIDList })} disabled={!removeIDList.length}>{localText['Save']}</Button>}
            <Button onClick={onClose}>{localText['Cancel']}</Button>
        </DialogActions>
    </Dialog>
}

export default ShowFilesDialog;