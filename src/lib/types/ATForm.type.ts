import { StringKeyedObject } from "./Common.type";
import type React from "react";
import type { ColDef } from "ag-grid-community";
import { Grid } from '@mui/material';
import { ATFormBuilerColumnGenericProps, ATFormBuilerColumnInterface } from "./FormBuilder.type";
import { ATTypeInterface } from "./UITypeUtils.type";
import { ATFormTabConfigInterface, ATFormTabsManagerDefaultSelectedTabPathsType, ATFormTabsOnChangeType } from "./ATFormTabsManager.type";

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
    tabs?: ATFormTabConfigInterface[],    
    onTabChange?: ATFormTabsOnChangeType,
    defaultSelectedTabPaths?: ATFormTabsManagerDefaultSelectedTabPathsType,
}

export interface ATFormResetInterface {
    inputDefaultValue?: any,
    inputDefaultValueFormat?: ATFormDefaultValueFormat,
    reverseConvertToKeyValueEnabled?: boolean,
    callFormOnChangeDisabled?: boolean,
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

/**Type def for tProps.ref */
export interface ATFormComponentRefInterface {
    reset?: (resetProps?: ATFormChildResetInterface) => void,
}

/**Type def for tProps */
export interface ATFormComponentProps {
    /**This is ref that gives you access to form apis that are at child level, this is not the same as uiProps.ref ! */
    ref?: React.Ref<ATFormComponentRefInterface>,
    id: string,
    type: string,
    size?: ATFormGridSize,
    label?: string | undefined | null,
    tabPath?: number | number[],
    /**Only works for controlled elements and its used for form initialize */
    defaultValue?: any,
    groupDataID?: string,
    wrapperRenderer?: any,
    wrapperRendererProps?: any,
    colDef?: ColDef,
    skipForm?: boolean,
    skipRender?: boolean,
    validation?: {
        required?: boolean;
        [key: string]: unknown;
    },
}

export type ATFormChildProps<T extends ATFormBuilerColumnGenericProps = ATFormBuilerColumnGenericProps> = ATFormBuilerColumnInterface<T> & {
    typeInfo: ATTypeInterface | undefined,
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
        wrapperRenderer?: any,
        wrapperRendererProps?: any,
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
    callFormOnChangeDisabled?: boolean,
}