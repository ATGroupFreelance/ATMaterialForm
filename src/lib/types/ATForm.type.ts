import { ATFormMinimalControlledUIProps, StringKeyedObject } from "./Common.type";
import type React from "react";
import type { ColDef } from "ag-grid-community";
import { Grid } from '@mui/material';
import { ATFormBuilerColumnInterface } from "./FormBuilder.type";
import { ATTypeInterface } from "./UITypeUtils.type";

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

export interface ATFormProps {
    ref?: React.Ref<ATFormRefInterface>,
    children?: ATFormBuilerColumnInterface[],
    validationDisabled?: boolean,
    defaultValue?: any,
    defaultValueFormat?: ATFormDefaultValueFormat,
    onChange?: (props: ATFormOnChangeInterface) => void,
    tabs?: any[],
    tabsGridProps?: any,
    onTabChange?: (event: any) => void,
}

export interface ATFormResetInterface {
    inputDefaultValue?: any,
    inputDefaultValueFormat?: ATFormDefaultValueFormat,
    reverseConvertToKeyValueEnabled?: boolean,
    callFormOnChangeDisabled?: boolean,
}

export interface ATFormComponentRefInterface {
    reset?: (resetProps: ATFormResetInterface) => void,
}

export interface ATFormOnChildChangeInterface {
    event: any,
    childProps: ATFormChildProps,
    callFormOnChangeDisabled?: boolean,
    groupDataID?: string,
}

export interface ATFormPendingValidationCallbackInterface {
    isValid: boolean,
    onValid: any,
    onInvalid: any,
}

export interface ATFormComponentProps {
    id: string,
    type: string,
    size?: ATFormGridSize,
    label?: string | undefined | null,
    tabIndex?: number | number[],
    /**Only works for controlled elements and its used for form initialize */
    defaultValue?: any,
    groupDataID?: string,
    wrapperRenderer?: any,
    wrapperRendererProps?: any,
    colDef?: ColDef,
    skipForm?: boolean,
    skipRender?: boolean,
    ref?: React.Ref<any>,
    validation?: {
        required?: boolean;
        [key: string]: unknown;
    },
}

export type ATFormChildProps = ATFormBuilerColumnInterface & {
    typeInfo: ATTypeInterface | undefined,
    errors: any,
    onChildChange: (props: ATFormOnChildChangeInterface) => void,
    isTabSelected?: boolean,
};

export interface ATFormUnknownChildProps {
    isTabSelected?: boolean,
    tProps?: {
        id?: string,
        tabIndex?: number | number[],
        skipForm?: boolean,
        skipRender?: boolean,
        wrapperRenderer?: any,
        wrapperRendererProps?: any,
        size?: ATFormGridSize,
    },
    uiProps: any,
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

export interface ATTabWrapper {
    tabs?: any[],
    tabsGridProps: any,
    children: any,
    childrenProps: (ATFormChildProps | ATFormUnknownChildProps)[],
    onChange?: (event: any, props: ATTabWrapperOnChangeInterface) => void,
}

export interface ATTabWrapperOnChangeInterface {
    newIndexArray: number[],
    selectedTab: any,
}

export interface ATFormChildResetInterface {
    callFormOnChangeDisabled?: boolean,
}