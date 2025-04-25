import { ATFormMinimalControlledUIProps, StrictOmit } from "../Common.type";
import { SliderProps } from "@mui/material";

export type ATFormSliderProps = ATFormMinimalControlledUIProps & StrictOmit<SliderProps, 'id' | 'value' | 'onChange'> & {
    label?: string,
}
