// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _React, { useState } from 'react';

import MUIButton from '@mui/material/Button';
import ATToast from '../../../ATToast/ATToast';
import { ATButtonProps } from '@/lib/types/Button';

const Button = ({ ref, atFormProvidedProps, onClick, loading = false, color = 'primary', label, disabled, children, confirmationMessage, ...restProps }: ATButtonProps) => {
    void atFormProvidedProps;
    
    const [internalLoading, setInternalLoading] = useState(loading)

    const onYesClick = (event: any, { closeToast }: any) => {
        closeToast()

        if (onClick) {
            onClick(event, { startLoading: () => setInternalLoading(true), stopLoading: () => setInternalLoading(false) })
        }
    }

    const internalOnClick = (event: any) => {
        if (confirmationMessage) {
            ATToast.AreYouSure(confirmationMessage, { onYesClick })
        }
        else if (onClick)
            onClick(event, { startLoading: () => setInternalLoading(true), stopLoading: () => setInternalLoading(false) })
    }
    
    return <MUIButton ref={ref} fullWidth={true} disabled={internalLoading || disabled} onClick={internalOnClick} color={color} {...restProps}>{label}{children}</MUIButton>
}

export default Button;