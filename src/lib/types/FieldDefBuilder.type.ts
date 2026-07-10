import { AtFormFieldTProps } from "./AtForm.type";
import { StrictOmit } from "./Common.type";

export type AtFieldTProps = StrictOmit<AtFormFieldTProps, 'id'> & {
    id?: string;
}

export interface AtFieldDefInterface {
    id: string;
    tags?: string[];
    tProps: AtFieldTProps,
    uiProps?: any,
    colDef?: any,
}