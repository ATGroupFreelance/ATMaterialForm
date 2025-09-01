import { ComponentType, ReactElement } from "react";
import { ATFormChildProps } from "./ATForm.type";
import { ATFormCollapseWrapperConfig } from "./template-wrappers/CollapseWrapper.type";
import { ATFormButtonWrapperConfig } from "./template-wrappers/ButtonWrapper.type";
import { ATFormButtonDialogWrapperConfig } from "./template-wrappers/ButtonDialogWrapper.type";
import { ATFormGridConfig } from "./template-wrappers/GridWrapper";

// Base generic for wrapper props
export type ATFormWrapperRendererProps<TSpecificProps = void> = {
    children: ReactElement;
    childProps: ATFormChildProps;
} & ([TSpecificProps] extends [void] ? { [key: string]: any } : TSpecificProps);

// Map built-in wrapper types to their props
export interface BuiltInWrapperConfigsMap {
    Collapse: ATFormCollapseWrapperConfig;
    Grid: ATFormGridConfig;
    Button: ATFormButtonWrapperConfig;
    ButtonDialog: ATFormButtonDialogWrapperConfig;
    None: {};
}

type ATFormBuiltInWrapperType = keyof BuiltInWrapperConfigsMap;

// Built-in wrapper object form
type BuiltInWrapperConfig = {
    [K in ATFormBuiltInWrapperType]: {
        renderer: K;
        config?: BuiltInWrapperConfigsMap[K];
    };
}[ATFormBuiltInWrapperType];

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
export type ATFormWrapperConfig =
    | DefaultGridWrapperConfig
    | BuiltInWrapperConfig
    | CustomWrapperConfig;
