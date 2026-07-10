import { AtFormFieldTProps } from "./AtForm.type";
import { StrictOmit } from "./Common.type";

export type AtFormFieldTypelessTProps = StrictOmit<AtFormFieldTProps, 'type'>

export interface AtFormBuilderCreateInterface {
    type: string,
    defaultSize: number,
    tProps: AtFormFieldTypelessTProps,
    uiProps?: Record<string, any>,
}

export interface AtFormBuilderConditionalInsertInterface {
    condition: boolean,
    formChildren: any[],
}