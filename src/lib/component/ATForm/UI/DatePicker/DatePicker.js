import React, { useContext } from 'react';

import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import ATFormContext from '../../ATFormContext/ATFormContext';

//When date picker value is null, The datepicker is empty which shows the user he has to pick a date
const DatePicker = ({ _formProps_, onChange, error, helperText, ...restProps }) => {
    const { rtl } = useContext(ATFormContext)

    const onInternalChange = (newValue) => {
        if (onChange) {
            onChange({ target: { value: newValue } })
        }
    }

    return <DesktopDatePicker
        inputFormat={rtl ? "yyyy/MM/dd" : "DD/MM/YYYY"}
        disableMaskedInput={true}
        fullwidth={true}
        renderInput={(params) => <TextField fullWidth={true} {...params} error={error} helperText={helperText} />}
        onChange={onInternalChange}
        {...restProps}
    />
}

export default DatePicker;  