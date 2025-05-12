import { ATEnumItemType, ATEnumsType, ATEnumType, ATFormMinimalControlledUIProps, StrictOmit } from "../Common.type";
import { ATFormComboBoxProps } from "./ComboBox.type";
import { ATFormGridSize } from "../ATForm.type";

export interface ATFormCascadeComboBoxDesignLayerOptionsFunctionProps {
    enums: ATEnumsType,
    keyValue: Record<string, string | Array<ATEnumItemType>> | null
}

export type ATFormCascadeComboBoxStaticOptions = ATEnumType | null | undefined;

export type ATFormCascadeComboBoxAsyncOptions = (
    props: ATFormCascadeComboBoxDesignLayerOptionsFunctionProps
) => Promise<ATEnumType | null | undefined>;

export type ATFormCascadeComboBoxOptionsType =
    | ATFormCascadeComboBoxStaticOptions
    | ATFormCascadeComboBoxAsyncOptions;


export interface ATFormCascadeComboBoxDesignLayerBase {
    id: string;
    multiple?: boolean;
    readOnly?: boolean;
    children?: ATFormCascadeComboBoxDesignLayer[];
    uiProps?: StrictOmit<ATFormComboBoxProps, 'id' | 'value' | 'multiple' | 'readOnly' | 'size' | 'options'>;
}

// Static: no enumKey required
export interface ATFormCascadeComboBoxStaticDesignLayer
    extends ATFormCascadeComboBoxDesignLayerBase {
    options?: ATFormCascadeComboBoxStaticOptions;
    enumKey?: string; // optional
    enumParentKey?: string;
}


// Async: enumKey required
export interface ATFormCascadeComboBoxAsyncDesignLayer
    extends ATFormCascadeComboBoxDesignLayerBase {
    options: ATFormCascadeComboBoxAsyncOptions;
    enumKey: string; // required
    enumParentKey?: string;
}

export type ATFormCascadeComboBoxDesignLayer =
    | ATFormCascadeComboBoxStaticDesignLayer
    | ATFormCascadeComboBoxAsyncDesignLayer;

//
// Main Component Props
//

export interface ATFormCascadeComboBoxProps extends ATFormMinimalControlledUIProps {
    label?: string;
    design?: ATFormCascadeComboBoxDesignLayer[];
}

export interface ATFormCascadeComboBoxBaseComboBoxPropsBase {
    id: string;
    value: any;
    parentID: string | null;
    size?: ATFormGridSize;
    uiProps?: StrictOmit<ATFormComboBoxProps, 'id' | 'value' | 'multiple' | 'readOnly' | 'size' | 'options'>;
    multiple?: boolean;
    readOnly?: boolean;
}

// Static version
export interface ATFormCascadeComboBoxBaseComboBoxStaticProps
    extends ATFormCascadeComboBoxBaseComboBoxPropsBase {
    options: ATFormCascadeComboBoxStaticOptions;
}

// Async version
export interface ATFormCascadeComboBoxBaseComboBoxAsyncProps
    extends ATFormCascadeComboBoxBaseComboBoxPropsBase {
    options: ATFormCascadeComboBoxAsyncOptions;
}

export type ATFormCascadeComboBoxBaseComboBoxProps =
    | ATFormCascadeComboBoxBaseComboBoxStaticProps
    | ATFormCascadeComboBoxBaseComboBoxAsyncProps;