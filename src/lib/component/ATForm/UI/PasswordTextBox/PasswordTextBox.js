import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import './PasswordTextBox.css';

const Password = ({ _formProps_, id, showPassword = false, onToggleShowPasswordClick, ...restProps }) => {
    const [lShowPassword, setLShowPassword] = useState(showPassword)

    useEffect(() => {
        setLShowPassword(showPassword)
    }, [showPassword])

    const internalOnToggleShowPasswordClick = () => {
        if (onToggleShowPasswordClick) {
            onToggleShowPasswordClick()
        }
        else {
            setLShowPassword(!lShowPassword)
        }
    }

    return <TextField
        fullWidth={true}
        type={lShowPassword ? "text" : "password"}
        InputProps={{
            endAdornment: <InputAdornment position="end"><IconButton onClick={internalOnToggleShowPasswordClick}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,

        }}
        {...restProps}        
    />
}

export default Password;