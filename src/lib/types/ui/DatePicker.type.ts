import { DesktopDatePickerProps } from "@mui/x-date-pickers/DesktopDatePicker";
import { ATFormMinimalControlledUIProps, StrictOmit } from "../Common.type";

//The following used to be Date, boolean
export type ATFormDatePickerProps = ATFormMinimalControlledUIProps & StrictOmit<DesktopDatePickerProps<boolean>, 'value' | 'onChange' | 'readOnly'>;
