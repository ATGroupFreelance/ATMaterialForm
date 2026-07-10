import { AutocompleteProps, AutocompleteRenderInputParams } from "@mui/material";
import { AtFormMinimalControlledUiProps, StrictOmit } from "../Common.type";

export interface AtFormMultiSelectTextBoxOption {
    id: number,
    value: number | string,
}

export type AtFormMultiSelectTextBoxValue = AtFormMultiSelectTextBoxOption[]

export type AtFormMultiSelectTextBoxProps = AtFormMinimalControlledUiProps<{ value: AtFormMultiSelectTextBoxValue, onChange: (...args: any[]) => void }> & StrictOmit<AutocompleteProps<any, boolean, boolean, boolean>, 'id' | 'value' | 'onChange' | 'readOnly' | 'options' | 'renderInput'> & {
    label?: string,
    renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode,
    allowDuplicates?: boolean,
    valueType?: 'string' | 'number';
};
