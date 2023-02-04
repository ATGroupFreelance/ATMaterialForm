import React, { useState } from 'react';

import MUIIconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';

const IconButton = ({ _formProps_, onClick, loading = false, disabled, icon, confirmationMessage, children, ...restProps }) => {
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
            onClick(event, { startLoading: () => setInternalLoading(true), stopLoading: () => setInternalLoading(false) })
    }

    return <MUIIconButton disabled={internalLoading || disabled} onClick={internalOnClick} {...restProps}>{icon}{children}</MUIIconButton>
}

export default IconButton;