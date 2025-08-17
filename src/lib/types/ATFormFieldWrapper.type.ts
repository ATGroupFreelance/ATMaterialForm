import { ComponentType, ReactNode } from "react";
import { ATFormChildProps } from "./ATForm.type";
import { ATFormCollapseWrapperConfig } from "./template-wrappers/CollapseWrapper.type";
import { ATFormButtonWrapperConfig } from "./template-wrappers/ButtonWrapper.type";
import { ATFormButtonDialogWrapperConfig } from "./template-wrappers/ButtonDialogWrapper";
import { ATFormGridConfig } from "./template-wrappers/GridWrapper";

// Base generic for wrapper props
export type ATFormWrapperRendererProps<TSpecificProps = void> = {
    children: ReactNode;
    childProps: ATFormChildProps;
} & ([TSpecificProps] extends [void] ? { [key: string]: any } : TSpecificProps);

// Map built-in wrapper types to their props
export interface BuiltInWrapperPropsMap {
    Collapse: ATFormCollapseWrapperConfig;
    Grid: ATFormGridConfig;
    Button: ATFormButtonWrapperConfig;
    ButtonDialog: ATFormButtonDialogWrapperConfig;
    None: {};
}

type ATFormBuiltInWrapperType = keyof BuiltInWrapperPropsMap;

// Built-in wrapper object form
type BuiltInWrapperConfig = {
    [K in ATFormBuiltInWrapperType]: {
        renderer: K;
        props?: BuiltInWrapperPropsMap[K];
    };
}[ATFormBuiltInWrapperType];

// Custom component wrapper object form
type CustomWrapperConfig<P = any> = {
    renderer: Exclude<ComponentType<P>, undefined | null>;
    props?: P;
};

// Default Grid case when no renderer is specified
type DefaultGridWrapperConfig = {
    renderer?: undefined | null;
    props?: BuiltInWrapperPropsMap["Grid"];
};

// Union used by fields
export type ATFormWrapperConfig =
    | DefaultGridWrapperConfig
    | BuiltInWrapperConfig
    | CustomWrapperConfig;
