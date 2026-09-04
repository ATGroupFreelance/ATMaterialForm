import Button from "../../../AtForm/Ui/Button/Button";
import useAtFormConfig from "../../../../hooks/useAtFormConfig/useAtFormConfig";
import { AtFormOnClickProps } from "../../../../types/Common.type";
import { Grid, Typography, Box, alpha } from "@mui/material";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
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
            spacing={1.5}
            sx={{
                minWidth: 260,
                maxWidth: 360,
            }}
        >
            {/* Message */}
            <Grid size={12}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                    }}
                >
                    <Box
                        sx={theme => ({
                            width: 36,
                            height: 36,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2,
                            color: "warning.main",
                            backgroundColor: alpha(theme.palette.warning.main, theme.palette.mode === "dark" ? 0.16 : 0.1),
                            border: 1,
                            borderColor: alpha(theme.palette.warning.main, 0.22),
                        })}
                    >
                        <HelpOutlineRoundedIcon sx={{ fontSize: 21 }} />
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            flex: 1,
                            fontWeight: 600,
                            color: "text.primary",
                            lineHeight: 1.5,
                        }}
                    >
                        {toastContent}
                    </Typography>
                </Box>
            </Grid>

            {/* Actions */}
            <Grid size={12}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 1,
                        pt: 0.25,
                    }}
                >
                    <Button
                        fullWidth
                        variant="outlined"
                        color="inherit"
                        onClick={onInternalNoClick}
                        sx={{
                            minHeight: 34,
                            borderColor: "divider",
                            color: "text.secondary",
                        }}
                    >
                        {getLocalText("No")}
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={onInternalYesClick}
                        sx={{
                            minHeight: 34,
                            boxShadow: "none",
                        }}
                    >
                        {getLocalText("Yes")}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default AreYouSure;
