import { ATFormComponentProps } from "./ATForm.type";
import { StrictOmit } from "./Common.type";

export type ATFormTypelessComponentProps = StrictOmit<ATFormComponentProps, 'type'>

export interface ATFormBuilderCreateInterface {
    type: string,
    defaultSize: number,
    tProps: ATFormTypelessComponentProps,
    uiProps: Record<string, any>,
}

export interface ATFormBuilerColumnInterface {
    tProps: ATFormComponentProps,
    uiProps?: Record<string, any>,
}

export interface ATFormBuilderConditionalInsertInterface {
    condition: boolean,
    elements: any[],
}