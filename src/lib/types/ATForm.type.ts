import { StringKeyedObject } from "./Common.type";
import type React from "react";
import type { ColDef } from "ag-grid-community";
import { Grid } from '@mui/material';
import { ATFormTypeInfoInterface } from "./UITypeUtils.type";
import { ATFormTabConfigInterface, ATFormTabsManagerDefaultSelectedTabPathsType, ATFormTabsOnChangeType } from "./ATFormTabsManager.type";
import { ComponentType } from "react";

export type ATFormGridSize = React.ComponentProps<typeof Grid>['size'];
export type ATFormColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default'

export type ATFormDefaultValueFormat = 'FormData' | 'FormDataKeyValue' | 'FormDataSemiKeyValue';

export interface ATFormOnChangeInterface {
    formData: StringKeyedObject,
    formDataKeyValue: StringKeyedObject,
    formDataSemiKeyValue: StringKeyedObject,
}

export interface ATFormRefInterface {
    reset: (props?: ATFormResetInterface) => void;
    checkValidation: (onValid: any, onInvalid?: any) => void;
    getFormData: () => ATFormOnChangeInterface;
}

/**The part of the ATFormFieldDef that can change be customized. */
export interface ATFormFieldDefGenericProps {
    uiProps?: Record<string, any>;
}

export interface ATFormFieldDefInterface<T extends ATFormFieldDefGenericProps = ATFormFieldDefGenericProps> {
    tProps: ATFormFieldTProps,
    uiProps?: T["uiProps"] extends undefined ? Record<string, any> : T["uiProps"];
}

export interface ATFormProps {
    ref?: React.Ref<ATFormRefInterface>,
    children?: React.ReactNode | ATFormFieldDefInterface[],
    validationDisabled?: boolean,
    /**The default format for a default value is "FormDataSemiKeyValue" here is an example:
     * { name: "Test", myDatePicker: "2025-01-01", myContainerWithTable: [{}, {}] }
     * 
     * Read defaultValueFormat for more information.
     */
    defaultValue?: any,
    defaultValueFormat?: ATFormDefaultValueFormat,
    onChange?: (props: ATFormOnChangeInterface) => void,
    tabs?: ATFormTabConfigInterface[],
    onTabChange?: ATFormTabsOnChangeType,
    defaultSelectedTabPaths?: ATFormTabsManagerDefaultSelectedTabPathsType,
}

export interface ATFormResetInterface {
    inputDefaultValue?: any,
    inputDefaultValueFormat?: ATFormDefaultValueFormat,
    reverseConvertToKeyValueEnabled?: boolean,
    suppressFormOnChange?: boolean,
}

export interface ATFormOnChildChangeInterface {
    event: any,
    childProps: ATFormChildProps,
    suppressFormOnChange?: boolean,
    groupDataID?: string,
}

export interface ATFormPendingValidationCallbackInterface {
    isValid: boolean,
    onValid: any,
    onInvalid: any,
}

/**Type def for tProps.ref */
export interface ATFormChildRefInterface {
    reset?: (resetProps?: ATFormChildResetInterface) => void,
}

export type ATFormWrapperRendererProps<TSpecificProps = void> = {
    childProps: ATFormChildProps;
} & ([TSpecificProps] extends [void] ? { [key: string]: any } : TSpecificProps);

export type ATFormWrapperRendererType = ComponentType<any>;

/**Type def for tProps */
export interface ATFormFieldTProps {
    /**This is ref that gives you access to form apis that are at child level, this is not the same as uiProps.ref ! */
    ref?: React.Ref<ATFormChildRefInterface>,
    id: string,
    type: string,
    size?: ATFormGridSize,
    label?: string | undefined | null,
    tabPath?: number | number[],
    /**Only works for controlled elements and its used for form initialize */
    defaultValue?: any,
    groupDataID?: string,
    wrapperRenderer?: ATFormWrapperRendererType,
    wrapperRendererProps?: Record<string, any>,
    colDef?: ColDef,
    skipForm?: boolean,
    skipRender?: boolean,
    validation?: {
        required?: boolean;
        [key: string]: unknown;
    },
}

export type ATFormChildProps<T extends ATFormFieldDefGenericProps = ATFormFieldDefGenericProps> = ATFormFieldDefInterface<T> & {
    typeInfo: ATFormTypeInfoInterface | undefined,
    errors: any,
    onChildChange: (props: ATFormOnChildChangeInterface) => void,
    isTabSelected?: boolean,
};

export interface ATFormUnknownChildProps {
    isTabSelected?: boolean,
    tProps?: {
        id?: string,
        tabPath?: number | number[],
        skipForm?: boolean,
        skipRender?: boolean,
        wrapperRenderer?: ATFormWrapperRendererType,
        wrapperRendererProps?: Record<string, any>,
        size?: ATFormGridSize,
    },
    uiProps?: Record<string, any>,
}

export interface ATFormRenderProps {
    children: any,
    childrenProps: (ATFormChildProps | ATFormUnknownChildProps)[],
}

export interface ATUIRenderProps {
    children: any,
    childProps: ATFormChildProps | ATFormUnknownChildProps,
}

export interface ATUIBuilderProps {
    childProps: ATFormChildProps,
}

export interface ATControlledUIBuilderProps {
    childProps: ATFormChildProps,
}

export interface ATUnControlledUIBuilderProps {
    childProps: ATFormChildProps,
}

export interface ATFormChildResetInterface {
    suppressFormOnChange?: boolean,
}