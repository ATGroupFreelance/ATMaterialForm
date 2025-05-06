import { AutocompleteProps, AutocompleteRenderInputParams } from "@mui/material";
import { ATEnumType, ATFormMinimalControlledUIProps, StrictOmit } from "../Common.type";

export type ATFormComboBoxOptionsType = ATEnumType | (() => Promise<ATEnumType | null |undefined>) | null | undefined

export type ATFormComboBoxProps = ATFormMinimalControlledUIProps & StrictOmit<AutocompleteProps<any, boolean, boolean, boolean>, 'id' | 'value' | 'onChange' | 'readOnly' | 'options' | 'renderInput'> & {
    options: ATFormComboBoxOptionsType,
    label?: string,
    renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode,
};
