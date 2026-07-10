import Button from "../../../AtForm/Ui/Button/Button";
import useAtFormConfig from "../../../../hooks/useAtFormConfig/useAtFormConfig";
import { AtFormOnClickProps } from "../../../../types/Common.type";
import { Grid, Typography, Box } from "@mui/material";
import { ToastContentProps } from "react-toastify";

interface AreYouSureProps extends ToastContentProps {
    onYesClick?: any;
    onNoClick?: any;
    toastContent: any;
}

const AreYouSure = ({
    closeToast,
    onYesClick,
    onNoClick,
    toastContent,
}: AreYouSureProps) => {
    const { getLocalText } = useAtFormConfig();

    const onInternalNoClick = (props: AtFormOnClickProps) => {
        if (onNoClick) {
            onNoClick({ ...props, closeToast });
        } else {
            closeToast();
        }
    };

    const onInternalYesClick = (props: AtFormOnClickProps) => {
        if (onYesClick) {
            onYesClick({ ...props, closeToast });
        }
    };

    return (
        <Grid
            container
            spacing={2}
            sx={{
                minWidth: 240,
            }}
        >
            {/* Message */}
            <Grid size={12}>
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 500,
                        textAlign: "center",
                        lineHeight: 1.5,
                    }}
                >
                    {toastContent}
                </Typography>
            </Grid>

            {/* Actions */}
            <Grid size={12}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1.5,
                    }}
                >
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={onInternalNoClick}
                    >
                        {getLocalText("No")}
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onInternalYesClick}
                    >
                        {getLocalText("Yes")}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default AreYouSure;
