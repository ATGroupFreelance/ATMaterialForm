import { AtEnumItemType, AtEnumsType, AtEnumType, AtFormMinimalControlledUiProps, StrictOmit } from "../Common.type";
import { AtFormComboBoxProps } from "./ComboBox.type";
import { AtFormGridSize } from "../AtForm.type";

export type AtFormCascadeComboBoxOptionsFilterFunction = (params: {
    index: number,
    enums: AtEnumsType;
    values: Record<string, string | Array<AtEnumItemType>> | null;
    option: AtEnumItemType;
}) => boolean;

export type AtFormCascadeComboBoxStaticOptions = AtEnumType | null | undefined;

export type AtFormCascadeComboBoxAsyncOptions = (
    params: {
        enums: AtEnumsType;
        values: Record<string, string | Array<AtEnumItemType>> | null;
    }
) => Promise<AtFormCascadeComboBoxStaticOptions>

export type AtFormCascadeComboBoxOptionsType =
    | AtFormCascadeComboBoxStaticOptions
    | AtFormCascadeComboBoxAsyncOptions;


export interface AtFormCascadeComboBoxDesignLayerBase {
    id: string;
    multiple?: boolean;
    readOnly?: boolean;
    children?: AtFormCascadeComboBoxDesignLayer[];
    uiProps?: StrictOmit<AtFormComboBoxProps, 'id' | 'value' | 'multiple' | 'readOnly' | 'size' | 'options'>;
    size?: AtFormGridSize,
    filterOptions?: AtFormCascadeComboBoxOptionsFilterFunction,
    /**
     * This is used in reverseConvertValue to get the full tree from a leaf
     * Defaults to the id field if not provided.
     */
    enumsKey?: string;
    /** 
     * The key of the parent. 
     * Defaults to "parent_id" if not provided.
    */
    enumsKeyParentIdField?: string;
}

export interface AtFormCascadeComboBoxStaticDesignLayer
    extends AtFormCascadeComboBoxDesignLayerBase {
    options?: AtFormCascadeComboBoxStaticOptions;
}

export interface AtFormCascadeComboBoxAsyncDesignLayer
    extends AtFormCascadeComboBoxDesignLayerBase {
    options: AtFormCascadeComboBoxAsyncOptions;
}

export type AtFormCascadeComboBoxDesignLayer =
    | AtFormCascadeComboBoxStaticDesignLayer
    | AtFormCascadeComboBoxAsyncDesignLayer;

//
// Main Component Props
//

export interface AtFormCascadeComboBoxProps extends AtFormMinimalControlledUiProps {
    label?: string;
    design?: AtFormCascadeComboBoxDesignLayer[];
}

export interface AtFormCascadeComboBoxBaseComboBoxPropsBase {
    id: string;
    value: any;
    parentId: string | null | undefined;
    size?: AtFormGridSize;
    uiProps?: StrictOmit<AtFormComboBoxProps, 'id' | 'value' | 'multiple' | 'readOnly' | 'size' | 'options'>;
    multiple?: boolean;
    readOnly?: boolean;
}

// Static version
export interface AtFormCascadeComboBoxBaseComboBoxStaticProps
    extends AtFormCascadeComboBoxBaseComboBoxPropsBase {
    options: AtFormCascadeComboBoxStaticOptions;
}

// Async version
export interface AtFormCascadeComboBoxBaseComboBoxAsyncProps
    extends AtFormCascadeComboBoxBaseComboBoxPropsBase {
    options: AtFormCascadeComboBoxAsyncOptions;
}

export type AtFormCascadeComboBoxBaseComboBoxProps = AtFormCascadeComboBoxBaseComboBoxAsyncProps;