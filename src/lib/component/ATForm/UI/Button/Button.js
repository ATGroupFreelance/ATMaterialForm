import React, { useState } from 'react';

import MUIButton from '@mui/material/Button';

const Button = ({ _formProps_, onClick, loading = false, color = 'primary', label, disabled, children, ...restProps }) => {
    const [internalLoading, setInternalLoading] = useState(loading)

    const internalOnClick = (event) => {
        if (onClick)
            onClick(event, { startLoading: () => setInternalLoading(true), stopLoading: () => setInternalLoading(false) })
    }

    return <MUIButton disabled={internalLoading || disabled} onClick={internalOnClick} color={color} {...restProps}>{label}{children}</MUIButton>
}

export default Button;  