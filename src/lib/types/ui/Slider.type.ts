import { AtFormMinimalControlledUiProps, StrictOmit } from "../Common.type";
import { SliderProps } from "@mui/material";

export type AtFormSliderProps = AtFormMinimalControlledUiProps & StrictOmit<SliderProps, 'id' | 'value' | 'onChange'> & {
    label?: string,
}
