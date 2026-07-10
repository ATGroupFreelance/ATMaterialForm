import { ComponentType, ReactElement } from "react";
import { AtFormChildProps } from "./AtForm.type";
import { AtFormCollapseWrapperConfig } from "./template-wrappers/CollapseWrapper.type";
import { AtFormButtonWrapperConfig } from "./template-wrappers/ButtonWrapper.type";
import { AtFormButtonDialogWrapperConfig } from "./template-wrappers/ButtonDialogWrapper.type";
import { AtFormGridConfig } from "./template-wrappers/GridWrapper";

// Base generic for wrapper props
export type AtFormWrapperRendererProps<TSpecificProps = void> = {
    children: ReactElement;
    childProps: AtFormChildProps;
} & ([TSpecificProps] extends [void] ? { [key: string]: any } : TSpecificProps);

// Map built-in wrapper types to their props
export interface BuiltInWrapperConfigsMap {
    Collapse: AtFormCollapseWrapperConfig;
    Grid: AtFormGridConfig;
    Button: AtFormButtonWrapperConfig;
    ButtonDialog: AtFormButtonDialogWrapperConfig;
    None: {};
}

type AtFormBuiltInWrapperType = keyof BuiltInWrapperConfigsMap;

// Built-in wrapper object form
type BuiltInWrapperConfig = {
    [K in AtFormBuiltInWrapperType]: {
        renderer: K;
        config?: BuiltInWrapperConfigsMap[K];
    };
}[AtFormBuiltInWrapperType];

// Custom component wrapper object form
type CustomWrapperConfig<P = any> = {
    renderer: Exclude<ComponentType<P>, undefined | null>;
    config?: P;
};

// Default Grid case when no renderer is specified
type DefaultGridWrapperConfig = {
    renderer?: undefined | null;
    config?: BuiltInWrapperConfigsMap["Grid"];
};

// Union used by fields
export type AtFormWrapperConfig =
    | DefaultGridWrapperConfig
    | BuiltInWrapperConfig
    | CustomWrapperConfig;
