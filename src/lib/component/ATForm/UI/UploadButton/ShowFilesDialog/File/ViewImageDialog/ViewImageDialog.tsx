import React from 'react';

//MUI
import Button from '@/lib/component/ATForm/UI/Button/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';

//Context
import useATFormConfig from '../../../../../../../hooks/useATFormConfig/useATFormConfig';
import { ATFormUploadButtonViewImageDialog } from '@/lib/types/ui/UploadButton.type';

const ViewImageDialog = ({ onClose, image, name }: ATFormUploadButtonViewImageDialog) => {
    const { localText } = useATFormConfig()

    return <Dialog open={true} onClose={onClose} maxWidth={'md'}>
        <DialogTitle>{localText['View Image']}</DialogTitle>
        <DialogContent>
            <img style={{ width: '600px', height: '800px' }} src={image} alt={name} />
        </DialogContent>
        <DialogActions>
            <Grid container spacing={2} justifyContent={'center'} >
                <Grid size={{ xs: 12, md: 6 }}>
                    <Button onClick={onClose} color={'secondary'}>{localText['Cancel']}</Button>
                </Grid>
            </Grid>
        </DialogActions>
    </Dialog>
}

export default ViewImageDialog;