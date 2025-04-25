import { useState } from 'react';

import MUIButton from '@mui/material/Button';
import ATToast from '../../../ATToast/ATToast';
import { ATFormButtonProps } from '@/lib/types/ui/Button.type';
import { ATFormOnClickProps } from '@/lib/types/Common.type';

const Button = ({ id, loading = false, label, confirmationText, fullWidth, onClick, color = 'primary', disabled, children, ...restProps }: ATFormButtonProps) => {
    const [internalLoading, setInternalLoading] = useState(loading)

    const onYesClick = (props: ATFormOnClickProps) => {
        props.closeToast()

        if (onClick) {
            onClick({ ...props, startLoading: () => setInternalLoading(true), stopLoading: () => setInternalLoading(false) })
        }
    }

    const internalOnClick = (event: any) => {
        if (confirmationText) {
            ATToast.AreYouSure(confirmationText, { onYesClick })
        }
        else if (onClick)
            onClick({ event, startLoading: () => setInternalLoading(true), stopLoading: () => setInternalLoading(false) })
    }

    return <MUIButton fullWidth={true} disabled={internalLoading || disabled} onClick={internalOnClick} color={color} {...restProps}>{label}{children}</MUIButton>
}

export default Button;