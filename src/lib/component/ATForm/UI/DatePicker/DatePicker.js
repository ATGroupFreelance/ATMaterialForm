import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

//When date picker value is null, The datepicker is empty which shows the user he has to pick a date
const DatePicker = ({ _formProps_, onChange, ...restProps }) => {
    const onInternalChange = (newValue) => {
        if (onChange) {
            onChange({ target: { value: newValue } })
        }
    }

    return <DesktopDatePicker
        inputFormat="DD/MM/YYYY"
        disableMaskedInput={true}
        fullwidth={true}
        renderInput={(params) => <TextField fullWidth={true} {...params} />}
        onChange={onInternalChange}
        {...restProps}
    />
}

export default DatePicker;