import React, { useEffect, useState } from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import './PasswordTextBox.css';
import TextBox from '../TextBox/TextBox';

const Password = ({ _formProps_, id, showPassword = false, onToggleShowPasswordClick, error, helperText,readOnly, ...restProps }) => {
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

    return <TextBox
        fullWidth={true}
        type={lShowPassword ? "text" : "password"}
        InputProps={{
            endAdornment: <InputAdornment position="end"><IconButton onClick={internalOnToggleShowPasswordClick}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,

        }}
        error={error}
        helperText={helperText}
        readOnly={readOnly}
        {...restProps}        
    />
}

export default Password;