import { useEffect, useState } from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import './PasswordTextBox.css';
import TextBox from '../TextBox/TextBox';
import { ATFormPasswordTextBoxProps } from '@/lib/types/ui/PasswordTextBox.type';

const PasswordTextBox = ({ id, showPassword = false, onToggleShowPasswordClick, ...restProps }: ATFormPasswordTextBoxProps) => {
    void id;

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
        type={lShowPassword ? "text" : "password"}
        slotProps={{
            input: {
                endAdornment: <InputAdornment position="end">
                    <IconButton onClick={internalOnToggleShowPasswordClick}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>,
            }
        }}
        {...restProps}
    />
}

export default PasswordTextBox;