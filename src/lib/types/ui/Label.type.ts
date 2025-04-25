import { TypographyProps } from "@mui/material";
import { ATFormMinimalUncontrolledUIProps, StrictOmit } from "../Common.type";

export type ATFormLabelProps = ATFormMinimalUncontrolledUIProps & StrictOmit<TypographyProps, 'id'> & {
    label?: string,
};