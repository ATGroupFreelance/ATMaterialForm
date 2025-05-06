import { ATEnumItemType, ATEnumsType, ATEnumType, ATFormMinimalControlledUIProps, StrictOmit } from "../Common.type";
import { ATFormComboBoxProps } from "./ComboBox.type";
import { ATFormGridSize } from "../ATForm.type";

export interface ATFormCascadeComboBoxDesignLayerOptionsFunctionProps {
    enums: ATEnumsType,
    keyValue: Record<string, string | Array<ATEnumItemType>> | null
}

export type ATFormCascadeComboBoxOptionsType = ATEnumType | ((props: ATFormCascadeComboBoxDesignLayerOptionsFunctionProps) => Promise<ATEnumType | null | undefined>) | null | undefined

export interface ATFormCascadeComboBoxDesignLayer {
    id: string,
    options?: ATFormCascadeComboBoxOptionsType,
    multiple?: boolean,
    readOnly?: boolean,
    enumKey?: string,
    enumParentKey?: string,
    children?: ATFormCascadeComboBoxDesignLayer[],
    uiProps?: StrictOmit<ATFormComboBoxProps, 'id' | 'value' | 'multiple' | 'readOnly' | 'size' | 'options'>,
}

export interface ATFormCascadeComboBoxProps extends ATFormMinimalControlledUIProps {
    label?: string;
    design?: ATFormCascadeComboBoxDesignLayer[],
};

export interface ATFormCascadeComboBoxBaseComboBoxProps {
    id: string,
    value: any,
    parentID: string | null,
    options: ATFormCascadeComboBoxOptionsType,
    multiple: boolean | undefined,
    readOnly: boolean | undefined,
    size?: ATFormGridSize,
    uiProps?: StrictOmit<ATFormComboBoxProps, 'id' | 'value' | 'multiple' | 'readOnly' | 'size' | 'options'>,
}
