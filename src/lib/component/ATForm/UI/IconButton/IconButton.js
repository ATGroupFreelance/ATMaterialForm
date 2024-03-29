import React, { useState } from 'react';

import MUIIconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';
import { Tooltip } from '@mui/material';

const IconButton = ({ _formProps_, onClick, loading = false, disabled, icon, confirmationMessage, children, tooltip, ...restProps }) => {
    const { enqueueSnackbar } = useSnackbar()
    const [internalLoading, setInternalLoading] = useState(loading)

    const onYesClick = (event, { handleCloseSnackbar }) => {
        handleCloseSnackbar()

        if (onClick) {
            onClick(event, { enqueueSnackbar, startLoading: () => setInternalLoading(true), stopLoading: () => setInternalLoading(false) })
        }
    }

    const internalOnClick = (event) => {
        if (confirmationMessage)
            enqueueSnackbar(confirmationMessage, { onYesClick: onYesClick, variant: 'areYouSure', persist: true })
        else if (onClick)
            onClick(event, { enqueueSnackbar, startLoading: () => setInternalLoading(true), stopLoading: () => setInternalLoading(false) })
    }

    const output = <MUIIconButton disabled={internalLoading || disabled} onClick={internalOnClick} {...restProps}>{icon}{children}</MUIIconButton>

    return tooltip ?
        <Tooltip {...tooltip}>
            <span>
            {output}
            </span>
        </Tooltip>
        :
        output
}

export default IconButton;