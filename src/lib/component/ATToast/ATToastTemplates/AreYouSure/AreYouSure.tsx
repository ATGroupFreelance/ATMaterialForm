import Button from "@/lib/component/ATForm/UI/Button/Button";
import useATFormConfig from "@/lib/hooks/useATFormConfig/useATFormConfig";
import { ATFormOnClickProps } from "@/lib/types/Common.type";
import { Grid, Typography } from "@mui/material";
import { ToastContentProps } from "react-toastify";

interface AreYouSureProps extends ToastContentProps {
    onYesClick: any,
    onNoClick: any,
    toastContent: any,
}

const AreYouSure = ({ closeToast, onYesClick, onNoClick, toastContent }: AreYouSureProps) => {
    const { getLocalText } = useATFormConfig()
    
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
            <Button variant={'outlined'} onClick={onInternalNoClick} color={'error'}>{getLocalText('No')}</Button>
        </Grid>
        <Grid size={'grow'}>

        </Grid>
        <Grid size={4}>
            <Button variant={'outlined'} onClick={onInternalYesClick}>{getLocalText('Yes')}</Button>
        </Grid>
    </Grid>
}

export default AreYouSure;