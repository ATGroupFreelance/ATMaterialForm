import { ATEnumsType, StrictOmit } from "./Common.type";
import type React from "react";
import type { ColDef } from "ag-grid-community";
import { Grid } from '@mui/material';
import { ATFormTypeInfoInterface } from "./UITypeUtils.type";
import { ATFormTabConfigInterface, ATFormTabsManagerDefaultSelectedTabPathsType, ATFormTabsOnChangeType } from "./ATFormTabsManager.type";
import { ATFormFormDataFormat, ATFormFormDataKeyValueType, ATFormFormDataSemiKeyValueType, ATFormFormDataType } from "./ATFormFormData.type";
import { ATFormWrapperConfig } from "./ATFormFieldWrapper.type";

export type ATFormGridSize = React.ComponentProps<typeof Grid>['size'];
export type ATFormColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default'

export interface ATFormOnChangeInterface {
    formData: ATFormFormDataType,
    formDataKeyValue: ATFormFormDataKeyValueType,
    formDataSemiKeyValue: ATFormFormDataSemiKeyValueType,
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

export interface ATFormDebugProps {
    /** Enable debug mode globally on the form (all fields show debug info) */
    enabled?: boolean;
    id?: string;
}

export type LogLevel = 0 | 1 | 2 | 3 | 4;

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
    defaultValueFormat?: ATFormFormDataFormat,
    /**onChange is called at the beginning of form creation in uncontrolled forms, but in controlled forms, it is not called at all initially. */
    onChange?: (props: ATFormOnChangeInterface) => void,
    /**e.g [{label: 'tab0', tabs: [label: 'tab 0 in tab 0]}, {label: 'tab1'}] */
    tabs?: StrictOmit<ATFormTabConfigInterface, 'tabPath'>[],
    onTabChange?: ATFormTabsOnChangeType,
    defaultSelectedTabPaths?: ATFormTabsManagerDefaultSelectedTabPathsType,
    value?: any,
    valueFormat?: ATFormFormDataFormat,
    debugProps?: ATFormDebugProps,
    logLevel?: LogLevel;
}

export interface ATFormResetInterface {
    inputDefaultValue?: any,
    inputDefaultValueFormat?: ATFormFormDataFormat,
    suppressFormOnChange?: boolean,
}

export interface ATFormOnChildChangeInterface {
    event: any,
    childProps: ATFormChildProps,
    suppressFormOnChange?: boolean,
    groupDataID?: string,
    changeID: number,
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
    wrapperRenderer?: ATFormWrapperConfig,
    colDef?: ColDef,
    skipForm?: boolean,
    skipRender?: boolean,
    validation?: {
        required?: boolean;
        [key: string]: unknown;
    },
    debug?: boolean,
}

export type ATFormChildProps<T extends ATFormFieldDefGenericProps = ATFormFieldDefGenericProps> = ATFormFieldDefInterface<T> & {
    typeInfo: ATFormTypeInfoInterface | undefined,
    errors: any,
    onChildChange: (props: ATFormOnChildChangeInterface) => void,
    isTabSelected?: boolean,
    value?: ATFormFormDataType[string],
    isFormControlled: boolean,
};

export interface ATFormUnknownChildProps {
    isTabSelected?: boolean,
    tProps?: {
        id?: string,
        tabPath?: number | number[],
        skipForm?: boolean,
        skipRender?: boolean,
        wrapperRenderer?: ATFormWrapperConfig,        
        size?: ATFormGridSize,
        debug?: boolean,
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

export interface ATFormAnyToFormDataInterface {
    value: any,
    valueFormat: ATFormFormDataFormat,
    flatChildrenProps: (ATFormChildProps | ATFormUnknownChildProps)[],
    enums: ATEnumsType,
    rtl?: boolean,
}

export interface ATFormFormDataToAnyInterface {
    formData: ATFormFormDataType,
    targetFormat: ATFormFormDataFormat,
    flatChildrenProps: (ATFormChildProps | ATFormUnknownChildProps)[],
    enums: ATEnumsType,
}