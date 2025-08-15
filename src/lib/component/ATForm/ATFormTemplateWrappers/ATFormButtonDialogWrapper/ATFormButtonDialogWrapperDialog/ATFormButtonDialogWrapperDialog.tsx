import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import Button from "../../../UI/Button/Button";
import useATFormConfig from "@/lib/hooks/useATFormConfig/useATFormConfig";

const ATFormButtonDialogWrapperDialog = ({ children, onClose, onSubmitClick, onResetClick }: any) => {
    const { getLocalText } = useATFormConfig()

    return <Dialog open={true} onClose={onClose}>
        <DialogTitle>

        </DialogTitle>
        <DialogContent>
            {children}
        </DialogContent>
        <DialogActions>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 2 }}>
                    <Button onClick={onSubmitClick}>
                        {getLocalText('Save')}
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <Button onClick={onClose}>
                        {getLocalText('Close')}
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <Button onClick={onResetClick}>
                        {getLocalText('Reset')}
                    </Button>
                </Grid>
            </Grid>
        </DialogActions>
    </Dialog>
}

export default ATFormButtonDialogWrapperDialog;