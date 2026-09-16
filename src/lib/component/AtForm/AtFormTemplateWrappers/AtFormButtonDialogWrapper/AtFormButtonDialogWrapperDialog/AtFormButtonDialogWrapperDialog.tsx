import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import Button from "../../../Ui/Button/Button";
import useAtFormConfig from "../../../../../hooks/useAtFormConfig/useAtFormConfig";

const AtFormButtonDialogWrapperDialog = ({ children, onClose, onSubmitClick, onResetClick }: any) => {
    const { t } = useAtFormConfig()

    return <Dialog open={true} onClose={onClose} maxWidth={"md"} fullWidth>
        <DialogTitle>

        </DialogTitle>
        <DialogContent dividers>
            {children}
        </DialogContent>
        <DialogActions>
            <Grid container spacing={2} sx={{ width: "100%", justifyContent: "end" }} >
                <Grid size={{ xs: 12, md: 2 }}>
                    <Button onClick={onClose} color="error">
                        {t('Close')}
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <Button onClick={onResetClick} color="warning">
                        {t('Reset')}
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <Button onClick={onSubmitClick} color="success">
                        {t('Save')}
                    </Button>
                </Grid>
            </Grid>
        </DialogActions>
    </Dialog>
}

export default AtFormButtonDialogWrapperDialog;