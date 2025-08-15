// ATFormWrapper.type.ts
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

// Add others: GridWrapperProps, ButtonWrapperProps, etc.

// Map built-in wrapper types to their props
export interface BuiltInWrapperPropsMap {
    Collapse: ATFormCollapseWrapperProps;
    Grid: GridProps; // Replace with actual
    Button: ATFormButtonWrapperProps; // Replace with actual
    ButtonDialog: ATFormButtonDialogWrapperProps; // Replace with actual
    None: {};
}

export type ATFormBuiltInWrapperType = keyof BuiltInWrapperPropsMap;

export type ATFormWrapperRendererType =
    | ComponentType<any>
    | ATFormBuiltInWrapperType;