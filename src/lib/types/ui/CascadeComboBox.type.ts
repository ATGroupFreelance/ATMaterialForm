import { ATEnumItemType, ATEnumsType, ATEnumType, ATFormMinimalControlledUIProps, StrictOmit } from "../Common.type";
import { ATFormComboBoxProps } from "./ComboBox.type";
import { ATFormGridSize } from "../ATForm.type";

export type ATFormCascadeComboBoxOptionsFilterFunction = (params: {
    index: number,
    enums: ATEnumsType;
    values: Record<string, string | Array<ATEnumItemType>> | null;
    option: ATEnumItemType;
}) => boolean;

export type ATFormCascadeComboBoxStaticOptions = ATEnumType | null | undefined;

export type ATFormCascadeComboBoxAsyncOptions = (
    params: {
        enums: ATEnumsType;
        values: Record<string, string | Array<ATEnumItemType>> | null;
    }
) => Promise<ATFormCascadeComboBoxStaticOptions>

export type ATFormCascadeComboBoxOptionsType =
    | ATFormCascadeComboBoxStaticOptions
    | ATFormCascadeComboBoxAsyncOptions;


export interface ATFormCascadeComboBoxDesignLayerBase {
    id: string;
    multiple?: boolean;
    readOnly?: boolean;
    children?: ATFormCascadeComboBoxDesignLayer[];
    uiProps?: StrictOmit<ATFormComboBoxProps, 'id' | 'value' | 'multiple' | 'readOnly' | 'size' | 'options'>;
    size?: ATFormGridSize,
    filterOptions?: ATFormCascadeComboBoxOptionsFilterFunction,
    /**
     * This is used in reverseConvertValue to get the full tree from a leaf
     * Defaults to the id field if not provided.
     */
    enumsKey?: string;
    /** 
     * The key of the parent. 
     * Defaults to "parent_id" if not provided.
    */
    enumsKeyParentIDField?: string;
}

export interface ATFormCascadeComboBoxStaticDesignLayer
    extends ATFormCascadeComboBoxDesignLayerBase {
    options?: ATFormCascadeComboBoxStaticOptions;
}

export interface ATFormCascadeComboBoxAsyncDesignLayer
    extends ATFormCascadeComboBoxDesignLayerBase {
    options: ATFormCascadeComboBoxAsyncOptions;
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
    parentID: string | null | undefined;
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

export type ATFormCascadeComboBoxBaseComboBoxProps = ATFormCascadeComboBoxBaseComboBoxAsyncProps;