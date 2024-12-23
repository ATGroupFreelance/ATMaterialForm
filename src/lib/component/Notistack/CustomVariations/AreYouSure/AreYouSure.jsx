import React, { useState, useContext } from 'react';
//Notistack
import { useSnackbar, SnackbarContent } from "notistack";
//MUI
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import { CardContent, Typography, Grid2, Modal, TextField } from "@mui/material";
//Components
import Button from '../../../ATForm/UI/Button/Button';
//Styles
import StyleClasses from './AreYouSure.module.css';
//Context
import ATFormContext from '../../../ATForm/ATFormContext/ATFormContext';

const AreYouSure = ({ ref, id, style, message, modalDisabled, onYesClick, onNoClick, reason }) => {
    const { localText } = useContext(ATFormContext)

    const [visible, setVisible] = useState(true)
    const { closeSnackbar } = useSnackbar();
    const [reasonValue, setReasonValue] = useState(null)

    const handleCloseSnackbar = () => {
        setVisible(false)
        closeSnackbar(id)
    }

    const onInternalNoClick = (event, props) => {
        if (onNoClick) {
            onNoClick(event, { ...props, handleCloseSnackbar })
        }
        else
            handleCloseSnackbar()
    }

    let content = <Card className={StyleClasses.AreYouSure} sx={{ backgroundColor: '#fddc6c' }}>
        <CardContent>
            <Grid2 container justifyContent="center">
                <Typography variant="h6" >
                    {message}
                </Typography>
            </Grid2>
            {
                reason
                &&
                <Grid2 container justifyContent="center">
                    <TextField fullWidth={true} label={reason.label} onChange={(event) => setReasonValue(event.target.value)} />
                </Grid2>
            }
        </CardContent>
        <CardActions >
            <Button
                label={localText['Yes']}
                onClick={(event, props) => onYesClick(event, { ...props, handleCloseSnackbar: handleCloseSnackbar, reason: reasonValue })}
            />
            <Button label={localText['No']} onClick={onInternalNoClick} color={'secondary'} />
        </CardActions>
    </Card>

    if (!modalDisabled) {
        content = <Modal open={true} >
            {content}
        </Modal>
    }

    return (
        <SnackbarContent ref={ref} style={style}>
            {visible && content}
        </SnackbarContent>
    );
}

export default AreYouSure;
