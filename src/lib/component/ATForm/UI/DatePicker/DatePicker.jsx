import React, { useContext } from 'react';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import ATFormContext from '../../ATFormContext/ATFormContext';

//When date picker value is null, The datepicker is empty which shows the user he has to pick a date
const DatePicker = ({ _formProps_, onChange, error, helperText, readOnly,...restProps }) => {
    const { rtl } = useContext(ATFormContext)

    const onInternalChange = (newValue) => {
        if (onChange) {
            onChange({ target: { value: newValue } })
        }
    }

    return <DesktopDatePicker
        format={rtl ? "yyyy/MM/dd" : "DD/MM/YYYY"}
        disableMaskedInput={true}
        fullwidth={true}
        slotProps={{ textField: { fullWidth: true, error, helperText } }}
        onChange={onInternalChange}
        readOnly={readOnly}
        {...restProps}
    />
}

export default DatePicker;  