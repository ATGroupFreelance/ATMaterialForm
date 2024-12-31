import Button from "@/lib/component/ATForm/UI/Button/Button";
import { Backdrop, Box, Grid2, Modal, Typography } from "@mui/material";

const AreYouSure = ({ closeToast, data, isPaused, toastProps, onYesClick, onNoClick, toastContent }) => {
    const onInternalNoClick = (event, props) => {
        if (onNoClick)
            onNoClick(event, { closeToast, ...props })
        else
            closeToast()
    }

    const onInternalYesClick = (event, props) => {
        if (onYesClick)
            onYesClick(event, { closeToast, ...props })
    }

    // console.log('AreYouSure', { closeToast, data, isPaused, toastProps, onYesClick, onNoClick, toastContent })

    return <Grid2 container spacing={2}>
        <Grid2 size={12}>
            <Typography variant="h6">{toastContent}</Typography>
        </Grid2>
        <Grid2 size={4}>
            <Button variant={'outlined'} onClick={onInternalNoClick} color={'error'}>No</Button>
        </Grid2>
        <Grid2 size={'grow'}>

        </Grid2>
        <Grid2 size={4}>
            <Button variant={'outlined'} onClick={onInternalYesClick}>Yes</Button>
        </Grid2>
    </Grid2>
}

export default AreYouSure;