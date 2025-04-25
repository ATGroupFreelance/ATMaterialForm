import { DesktopDatePickerProps } from "@mui/x-date-pickers/DesktopDatePicker";
import { ATFormMinimalControlledUIProps, StrictOmit } from "../Common.type";

export type ATFormDatePickerProps = ATFormMinimalControlledUIProps & StrictOmit<DesktopDatePickerProps<Date, boolean>, 'value' | 'onChange' | 'readOnly'>;
