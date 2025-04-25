import { AutocompleteProps, AutocompleteRenderInputParams } from "@mui/material";
import { ATEnumType, ATFormMinimalControlledUIProps, StrictOmit } from "../Common.type";

export type ATFormMultiSelectTextBoxProps = ATFormMinimalControlledUIProps & StrictOmit<AutocompleteProps<any, boolean, boolean, boolean>, 'id' | 'value' | 'onChange' | 'readOnly' | 'options' | 'renderInput'> & {    
    label?: string,
    renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode,
};
