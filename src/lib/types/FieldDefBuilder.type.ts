import { ATFormFieldTProps } from "./ATForm.type";
import { StrictOmit } from "./Common.type";

export type ATFieldTProps = StrictOmit<ATFormFieldTProps, 'id'> & {
    id?: string;
}

export interface ATFieldDefInterface {
    id: string;
    tags?: string[];
    tProps: ATFieldTProps,
    uiProps?: any,
    colDef?: any,
}