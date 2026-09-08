import { AtEnumsType, StrictOmit } from "./Common.type";
import type React from "react";
import type { ColDef } from "ag-grid-community";
import { Grid } from '@mui/material';
import { AtFormTypeInfoInterface } from "./UiTypeUtils.type";
import { AtFormTabConfigInterface, AtFormTabsManagerDefaultSelectedTabPathsType, AtFormTabsOnChangeType } from "./AtFormTabsManager.type";
import { AtFormFormDataFormat, AtFormFormDataKeyValueType, AtFormFormDataSemiKeyValueType, AtFormFormDataType } from "./AtFormFormData.type";
import { AtFormWrapperConfig } from "./AtFormFieldWrapper.type";
import { AtFormRuntime, AtFormRuntimeBindings } from "./AtFormRuntime.type";
import type { AtFormChildren } from "./AtFormLayout.type";

export type AtFormGridSize = React.ComponentProps<typeof Grid>['size'];
export type AtFormColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default'

export interface AtFormOnChangeInterface {
    formData: AtFormFormDataType,
    formDataKeyValue: AtFormFormDataKeyValueType,
    formDataSemiKeyValue: AtFormFormDataSemiKeyValueType,
}

export interface AtFormSetDataInterface {
    /**
     * The complete form data in FormDataSemiKeyValue format.
     *
     * setData replaces the current form data snapshot.
     * Fields omitted from data are reset to their normal/default value.
     *
     * Use setValue when only one field should change while preserving
     * the rest of the current form data.
     */
    data: AtFormFormDataSemiKeyValueType;

    /**
     * Prevent AtForm.onChange from being triggered while the new data
     * is applied to the form.
     */
    suppressFormOnChange?: boolean;
}

export interface AtFormGetValueInterface {
    /**
     * The AtForm field ID whose value should be returned.
     */
    fieldId: string;
}

export interface AtFormSetValueInterface {
    /**
     * The AtForm field ID whose value should be changed.
     */
    fieldId: string;

    /**
     * New value for the field.
     */
    value: unknown;

    /**
     * Prevent AtForm.onChange from being triggered while the value
     * is applied to the form.
     */
    suppressFormOnChange?: boolean;
}

export interface AtFormRefInterface {
    /**
     * Returns the complete current form data using AtForm's canonical
     * FormDataSemiKeyValue representation.
     */
    getData: () => AtFormFormDataSemiKeyValueType;

    /**
     * Replaces the current form data snapshot.
     *
     * Fields omitted from data are reset to their normal/default value.
     * Use setValue to update a single field without replacing the rest.
     */
    setData: (props: AtFormSetDataInterface) => void;

    /**
     * Returns the current value of a single field.
     */
    getValue: (props: AtFormGetValueInterface) => unknown;

    /**
     * Updates one field while preserving all other current form values.
     */
    setValue: (props: AtFormSetValueInterface) => void;

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

export interface AtFormFieldErrorFallbackProps {
    error: Error;
    errorInfo: React.ErrorInfo | null;
    childProps: AtFormChildProps | AtFormUnknownChildProps;
}

export type AtFormFieldErrorFallback = (
    props: AtFormFieldErrorFallbackProps
) => React.ReactNode;

export interface AtFormProps {
    ref?: React.Ref<AtFormRefInterface>,
    children?: AtFormChildren,
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
    fieldErrorFallback?: AtFormFieldErrorFallback,
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

export interface AtFormChildSetValueInterface {
    /**
     * New value to assign to this individual field.
     */
    value: unknown;

    /**
     * Prevent AtForm.onChange from being triggered by this update.
     *
     * This does not suppress the field's own onChange handler.
     */
    suppressFormOnChange?: boolean;
}

/**Type def for tProps.ref */
/**Type def for tProps.ref */
export interface AtFormChildRefInterface {
    reset?: (resetProps?: AtFormChildResetInterface) => void;
    /**
        * Returns the current value of this individual field.
        */
    getValue?: () => unknown;
    /**
     * Updates only this field.
     *
     * Unlike a form reset/setData operation, this must not cause other
     * fields in the form to reset or emit changes.
     */
    setValue?: (props: AtFormChildSetValueInterface) => void;
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
    fieldErrorFallback?: AtFormFieldErrorFallback,
}

export interface AtUiRenderProps {
    children: any,
    childProps: AtFormChildProps | AtFormUnknownChildProps,
    fieldErrorFallback?: AtFormFieldErrorFallback,
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