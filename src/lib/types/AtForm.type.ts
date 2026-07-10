import { AtEnumsType, StrictOmit } from "./Common.type";
import type React from "react";
import type { ColDef } from "ag-grid-community";
import { Grid } from '@mui/material';
import { AtFormTypeInfoInterface } from "./UiTypeUtils.type";
import { AtFormTabConfigInterface, AtFormTabsManagerDefaultSelectedTabPathsType, AtFormTabsOnChangeType } from "./AtFormTabsManager.type";
import { AtFormFormDataFormat, AtFormFormDataKeyValueType, AtFormFormDataSemiKeyValueType, AtFormFormDataType } from "./AtFormFormData.type";
import { AtFormWrapperConfig } from "./AtFormFieldWrapper.type";
import { AtFormRuntime, AtFormRuntimeBindings } from "./AtFormRuntime.type";

export type AtFormGridSize = React.ComponentProps<typeof Grid>['size'];
export type AtFormColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default'

export interface AtFormOnChangeInterface {
    formData: AtFormFormDataType,
    formDataKeyValue: AtFormFormDataKeyValueType,
    formDataSemiKeyValue: AtFormFormDataSemiKeyValueType,
}

export interface AtFormRefInterface {
    reset: (props?: AtFormResetInterface) => void;
    checkValidation: (onValid: any, onInvalid?: any) => void;
    getFormData: () => AtFormOnChangeInterface;
}

/**The part of the ATFormFieldDef that can change be customized. */
export interface AtFormFieldDefGenericProps {
    uiProps?: Record<string, any>;
}

export interface AtFormFieldDefInterface<T extends AtFormFieldDefGenericProps = AtFormFieldDefGenericProps> {
    tProps: AtFormFieldTProps,
    uiProps?: T["uiProps"] extends undefined ? Record<string, any> : T["uiProps"];
}

export interface AtFormDebugProps {
    /** Enable debug mode globally on the form (all fields show debug info) */
    enabled?: boolean;
    id?: string;
}

export type LogLevel = 0 | 1 | 2 | 3 | 4;

export interface AtFormProps {
    ref?: React.Ref<AtFormRefInterface>,
    children?: React.ReactNode | AtFormFieldDefInterface[],
    validationDisabled?: boolean,
    /**The default format for a default value is "FormDataSemiKeyValue" here is an example:
     * { name: "Test", myDatePicker: "2025-01-01", myContainerWithTable: [{}, {}] }
     * 
     * Read defaultValueFormat for more information.
     */
    defaultValue?: any,
    defaultValueFormat?: AtFormFormDataFormat,
    /**onChange is called at the beginning of form creation in uncontrolled forms, but in controlled forms, it is not called at all initially. */
    onChange?: (props: AtFormOnChangeInterface) => void,
    /**e.g [{label: 'tab0', tabs: [label: 'tab 0 in tab 0]}, {label: 'tab1'}] */
    tabs?: StrictOmit<AtFormTabConfigInterface, 'tabPath'>[],
    onTabChange?: AtFormTabsOnChangeType,
    defaultSelectedTabPaths?: AtFormTabsManagerDefaultSelectedTabPathsType,
    /**
     * The form becomes **controlled** when you provide a `value` prop.
     * You can use the `valueFormat` option to define the format of the value you are providing.
     *
     * To easily update the value in a controlled form, you can use `form.reset()`.  
     * This ensures the form is updated correctly with all the necessary props and maintains synchronization.
    */
    value?: any,
    valueFormat?: AtFormFormDataFormat,
    debugProps?: AtFormDebugProps,
    logLevel?: LogLevel;
    runtime?: AtFormRuntime;
    runtimePrefix?: string,
}

export interface AtFormResetInterface {
    inputDefaultValue?: any,
    inputDefaultValueFormat?: AtFormFormDataFormat,
    suppressFormOnChange?: boolean,
}

export interface AtFormOnChildChangeInterface {
    event: any,
    childProps: AtFormChildProps,
    suppressFormOnChange?: boolean,    
    changeId: number,
}

export interface AtFormPendingValidationCallbackInterface {
    isValid: boolean,
    onValid: any,
    onInvalid: any,
}

/**Type def for tProps.ref */
export interface AtFormChildRefInterface {
    reset?: (resetProps?: AtFormChildResetInterface) => void,
}

/**Type def for tProps */
export interface AtFormFieldTProps {
    /**This is ref that gives you access to form apis that are at child level, this is not the same as uiProps.ref ! */
    ref?: React.Ref<AtFormChildRefInterface>,
    id: string,
    type: string,
    size?: AtFormGridSize,
    label?: string | undefined | null,
    tabPath?: number | number[],
    /**Only works for controlled elements and its used for form initialize */
    defaultValue?: any,
    groupDataKey?: string,
    wrapperRenderer?: AtFormWrapperConfig,
    colDef?: ColDef,
    skipForm?: boolean,
    skipRender?: boolean,
    validation?: {
        required?: boolean;
        [key: string]: unknown;
    },
    debug?: boolean,
    typeInfo?: AtFormTypeInfoInterface,
    runtimeBindings?: AtFormRuntimeBindings,
}

export type AtFormChildProps<T extends AtFormFieldDefGenericProps = AtFormFieldDefGenericProps> = AtFormFieldDefInterface<T> & {
    typeInfo: AtFormTypeInfoInterface | undefined,
    errors: any,
    onChildChange: (props: AtFormOnChildChangeInterface) => void,
    isTabSelected?: boolean,
    value?: AtFormFormDataType[string],
    isFormControlled: boolean,
    changeId: number,
};

export interface AtFormUnknownChildProps {
    isTabSelected?: boolean,
    tProps?: {
        id?: string,
        tabPath?: number | number[],
        skipForm?: boolean,
        skipRender?: boolean,
        wrapperRenderer?: AtFormWrapperConfig,
        size?: AtFormGridSize,
        debug?: boolean,
        groupDataKey?: string,
    },
    uiProps?: Record<string, any>,
}

export interface AtFormRenderProps {
    children: any,
    childrenProps: (AtFormChildProps | AtFormUnknownChildProps)[],
}

export interface AtUiRenderProps {
    children: any,
    childProps: AtFormChildProps | AtFormUnknownChildProps,
}

export interface AtUiBuilderProps {
    childProps: AtFormChildProps,
}

export interface AtControlledUiBuilderProps {
    childProps: AtFormChildProps,
}

export interface AtUnControlledUiBuilderProps {
    childProps: AtFormChildProps,
}

export interface AtFormChildResetInterface {
    suppressFormOnChange?: boolean,
}

export interface AtFormAnyToFormDataInterface {
    value: any,
    valueFormat: AtFormFormDataFormat,
    flatChildrenProps: (AtFormChildProps | AtFormUnknownChildProps)[],
    enums: AtEnumsType,
    rtl?: boolean,
}

export interface AtFormFormDataToAnyInterface {
    formData: AtFormFormDataType,
    targetFormat: AtFormFormDataFormat,
    flatChildrenProps: (AtFormChildProps | AtFormUnknownChildProps)[],
    enums: AtEnumsType,
}