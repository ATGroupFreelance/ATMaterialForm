import { ATFormComponentProps } from "./ATForm.type";
import { StrictOmit } from "./Common.type";

export type ATFormTypelessComponentProps = StrictOmit<ATFormComponentProps, 'type'>

export interface ATFormBuilderCreateInterface {
    type: string,
    defaultSize: number,
    tProps: ATFormTypelessComponentProps,
    uiProps?: Record<string, any>,
}

export interface ATFormBuilerColumnGenericProps {
    uiProps?: Record<string, any>;
}

export interface ATFormBuilerColumnInterface<T extends ATFormBuilerColumnGenericProps = ATFormBuilerColumnGenericProps> {
    tProps: ATFormComponentProps,
    uiProps?: T["uiProps"] extends undefined ? Record<string, any> : T["uiProps"];
}

export interface ATFormBuilderConditionalInsertInterface {
    condition: boolean,
    elements: any[],
}