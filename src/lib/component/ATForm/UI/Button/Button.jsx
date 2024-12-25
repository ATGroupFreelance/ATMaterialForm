import React, { useState } from 'react';

import MUIButton from '@mui/material/Button';
import ATToast from '../../../ATToast/ATToast';

const Button = ({ ref, _formProps_, onClick, loading = false, color = 'primary', label, disabled, children, confirmationMessage, ...restProps }) => {
    const [internalLoading, setInternalLoading] = useState(loading)

    const onYesClick = (event, { closeToast }) => {
        closeToast()

        if (onClick) {
            onClick(event, { startLoading: () => setInternalLoading(true), stopLoading: () => setInternalLoading(false) })
        }
    }

    const internalOnClick = (event) => {
        if (confirmationMessage) {
            ATToast.AreYouSure(confirmationMessage, { onYesClick })
        }
        else if (onClick)
            onClick(event, { startLoading: () => setInternalLoading(true), stopLoading: () => setInternalLoading(false) })
    }

    return <MUIButton ref={ref} fullWidth={true} disabled={internalLoading || disabled} onClick={internalOnClick} color={color} {...restProps}>{label}{children}</MUIButton>
}

export default Button;