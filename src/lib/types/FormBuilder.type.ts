import { ATFormComponentProps } from "./ATForm.type";
import { StrictOmit } from "./Common.type";

export type ATFormTypelessComponentProps = StrictOmit<ATFormComponentProps, 'type'>

export interface ATFormBuilderCreateInterface {
    type: string,
    defaultSize: number,
    tProps: ATFormTypelessComponentProps,
    uiProps: any,
}

export interface ATFormBuilerColumnInterface {
    tProps: ATFormComponentProps,
    uiProps: any,
}

export interface ATFormBuilderConditionalInsertInterface {
    condition: boolean,
    elements: any[],
}