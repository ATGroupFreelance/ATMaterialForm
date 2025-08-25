import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import Button from "../../../UI/Button/Button";
import useATFormConfig from "@/lib/hooks/useATFormConfig/useATFormConfig";

const ATFormButtonDialogWrapperDialog = ({ children, onClose, onSubmitClick, onResetClick }: any) => {
    const { getLocalText } = useATFormConfig()

    return <Dialog open={true} onClose={onClose} maxWidth={"md"} fullWidth>
        <DialogTitle>

        </DialogTitle>
        <DialogContent dividers>
            {children}
        </DialogContent>
        <DialogActions>
            <Grid container spacing={2} sx={{ width: "100%" }} justifyContent={"end"}>
                <Grid size={{ xs: 12, md: 2 }}>
                    <Button onClick={onClose} color="error">
                        {getLocalText('Close')}
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <Button onClick={onResetClick} color="warning">
                        {getLocalText('Reset')}
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <Button onClick={onSubmitClick} color="success">
                        {getLocalText('Save')}
                    </Button>
                </Grid>
            </Grid>
        </DialogActions>
    </Dialog>
}

export default ATFormButtonDialogWrapperDialog;