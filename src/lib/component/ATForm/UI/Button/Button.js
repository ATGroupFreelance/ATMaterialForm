import React, { useState } from 'react';

import MUIButton from '@mui/material/Button';
import { useSnackbar } from 'notistack';

const Button = ({ _formProps_, onClick, loading = false, color = 'primary', label, disabled, children, confirmationMessage, ...restProps }) => {
    const { enqueueSnackbar } = useSnackbar()
    const [internalLoading, setInternalLoading] = useState(loading)

    const onYesClick = (event, { handleCloseSnackbar }) => {
        handleCloseSnackbar()

        if (onClick) {
            onClick(event, { startLoading: () => setInternalLoading(true), stopLoading: () => setInternalLoading(false) })
        }
    }

    const internalOnClick = (event) => {
        if (confirmationMessage)
            enqueueSnackbar(confirmationMessage, { onYesClick: onYesClick, variant: 'areYouSure', persist: true })
        else if (onClick)
            onClick(event, { startLoading: () => setInternalLoading(true), stopLoading: () => setInternalLoading(false), enqueueSnackbar })
    }

    return <MUIButton fullWidth={true} disabled={internalLoading || disabled} onClick={internalOnClick} color={color} {...restProps}>{label}{children}</MUIButton>
}

export default Button;