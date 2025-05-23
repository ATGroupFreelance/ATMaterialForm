import React, { useState } from 'react';

import MUIIconButton from '@mui/material/IconButton';
import { Tooltip } from '@mui/material';
import ATToast from '../../../ATToast/ATToast';

const IconButton = ({ atFormProvidedProps, onClick, loading = false, disabled, icon, confirmationMessage, children, tooltip, ...restProps }) => {
    const [internalLoading, setInternalLoading] = useState(loading)

    const onYesClick = (event, { closeToast }) => {
        closeToast()

        if (onClick) {
            onClick(event, { startLoading: () => setInternalLoading(true), stopLoading: () => setInternalLoading(false) })
        }
    }

    const internalOnClick = (event) => {
        if (confirmationMessage)
            ATToast.AreYouSure(confirmationMessage, { onYesClick })
        else if (onClick)
            onClick({ event, startLoading: () => setInternalLoading(true), stopLoading: () => setInternalLoading(false) })
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