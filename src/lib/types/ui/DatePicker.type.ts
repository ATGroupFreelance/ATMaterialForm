import { DesktopDatePickerProps } from "@mui/x-date-pickers/DesktopDatePicker";
import { AtFormMinimalControlledUiProps, StrictOmit } from "../Common.type";

//The following used to be Date, boolean
export type AtFormDatePickerProps = AtFormMinimalControlledUiProps & StrictOmit<DesktopDatePickerProps, 'value' | 'onChange' | 'readOnly'>;
