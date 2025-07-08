import { AutocompleteProps, AutocompleteRenderInputParams } from "@mui/material";
import { ATFormMinimalControlledUIProps, StrictOmit } from "../Common.type";

export interface ATFormMultiSelectTextBoxOption {
    id: number,
    value: number | string,
}

export type ATFormMultiSelectTextBoxValue = ATFormMultiSelectTextBoxOption[]

export type ATFormMultiSelectTextBoxProps = ATFormMinimalControlledUIProps<{ value: ATFormMultiSelectTextBoxValue, onChange: (...args: any[]) => void }> & StrictOmit<AutocompleteProps<any, boolean, boolean, boolean>, 'id' | 'value' | 'onChange' | 'readOnly' | 'options' | 'renderInput'> & {
    label?: string,
    renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode,
    allowDuplicates?: boolean,
    valueType?: 'string' | 'number';
};
