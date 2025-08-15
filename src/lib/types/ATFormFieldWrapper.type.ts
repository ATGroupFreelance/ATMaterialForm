import { ComponentType, ReactNode } from "react";
import { ATFormChildProps } from "./ATForm.type";
import { ATFormCollapseWrapperProps } from "./template-wrappers/CollapseWrapper.type";
import { GridProps } from "@mui/material";
import { ATFormButtonWrapperProps } from "./template-wrappers/ButtonWrapper.type";
import { ATFormButtonDialogWrapperProps } from "./template-wrappers/ButtonDialogWrapper";

// Base generic for wrapper props
export type ATFormWrapperRendererProps<TSpecificProps = void> = {
    children: ReactNode;
    childProps: ATFormChildProps;
} & ([TSpecificProps] extends [void] ? { [key: string]: any } : TSpecificProps);

// Map built-in wrapper types to their props
export interface BuiltInWrapperPropsMap {
    Collapse: ATFormCollapseWrapperProps;
    Grid: GridProps;
    Button: ATFormButtonWrapperProps;
    ButtonDialog: ATFormButtonDialogWrapperProps;
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
