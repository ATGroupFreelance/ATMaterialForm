import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';
import { AtFormDatePickerProps } from '../../../../types/ui/DatePicker.type';

//When date picker value is null, The datepicker is empty which shows the user he has to pick a date
const DatePicker = ({ onChange, error, helperText, readOnly, ...restProps }: AtFormDatePickerProps) => {
    const { rtl } = useAtFormConfig()

    const onInternalChange = (newValue: any) => {
        if (onChange) {
            onChange({ target: { value: newValue } })
        }
    }

    return <DesktopDatePicker
        format={rtl ? "yyyy/MM/dd" : "DD/MM/YYYY"}
        // disableMaskedInput={true}
        // fullwidth={true}
        slotProps={{ textField: { fullWidth: true, error, helperText } }}
        onChange={onInternalChange}
        readOnly={readOnly}
        {...restProps}
    />
}

export default DatePicker;  