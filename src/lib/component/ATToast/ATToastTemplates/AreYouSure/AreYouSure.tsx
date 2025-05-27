import Button from "@/lib/component/ATForm/UI/Button/Button";
import { ATFormOnClickProps } from "@/lib/types/Common.type";
import { Grid, Typography } from "@mui/material";
import { ToastContentProps } from "react-toastify";

interface AreYouSureProps extends ToastContentProps {
    onYesClick: any,
    onNoClick: any,
    toastContent: any,
}

const AreYouSure = ({ closeToast, onYesClick, onNoClick, toastContent }: AreYouSureProps) => {
    const onInternalNoClick = (props: ATFormOnClickProps) => {
        if (onNoClick)
            onNoClick({ ...props, closeToast })
        else
            closeToast()
    }

    const onInternalYesClick = (props: ATFormOnClickProps) => {
        if (onYesClick)
            onYesClick({ ...props, closeToast })
    }

    return <Grid container spacing={2}>
        <Grid size={12}>
            <Typography variant="h6">{toastContent}</Typography>
        </Grid>
        <Grid size={4}>
            <Button variant={'outlined'} onClick={onInternalNoClick} color={'error'}>No</Button>
        </Grid>
        <Grid size={'grow'}>

        </Grid>
        <Grid size={4}>
            <Button variant={'outlined'} onClick={onInternalYesClick}>Yes</Button>
        </Grid>
    </Grid>
}

export default AreYouSure;