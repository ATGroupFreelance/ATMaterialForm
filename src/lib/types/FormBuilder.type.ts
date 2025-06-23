import { ATFormFieldTProps } from "./ATForm.type";
import { StrictOmit } from "./Common.type";

export type ATFormFieldTypelessTProps = StrictOmit<ATFormFieldTProps, 'type'>

export interface ATFormBuilderCreateInterface {
    type: string,
    defaultSize: number,
    tProps: ATFormFieldTypelessTProps,
    uiProps?: Record<string, any>,
}

export interface ATFormBuilderConditionalInsertInterface {
    condition: boolean,
    elements: any[],
}