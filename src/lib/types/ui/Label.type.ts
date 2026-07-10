import { TypographyProps } from "@mui/material";
import { AtFormMinimalUncontrolledUiProps, StrictOmit } from "../Common.type";

export type AtFormLabelProps = AtFormMinimalUncontrolledUiProps & StrictOmit<TypographyProps, 'id'> & {
    label?: string,
};