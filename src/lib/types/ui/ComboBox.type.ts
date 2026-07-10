import { AutocompleteProps, AutocompleteRenderInputParams } from "@mui/material";
import { AtEnumType, AtFormMinimalControlledUiProps, StrictOmit } from "../Common.type";

// Base shared props (used by both variants)
export type AtFormComboBoxBaseProps = AtFormMinimalControlledUiProps &
  StrictOmit<AutocompleteProps<any, boolean, boolean, boolean>, 'id' | 'value' | 'onChange' | 'readOnly' | 'options' | 'renderInput'> & {
    label?: string;
    renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  };

// Options type for sync
export type AtFormComboBoxStaticOptions = AtEnumType | null | undefined;

// Options type for async
export type AtFormComboBoxAsyncOptions = () => Promise<AtEnumType | null | undefined>;

// Props variant: static (no enumsKey required)
export type AtFormComboBoxStaticProps = AtFormComboBoxBaseProps & {
  options: AtFormComboBoxStaticOptions;
  enumsKey?: string;
};

// Props variant: async (enumsKey required)
export type AtFormComboBoxAsyncProps = AtFormComboBoxBaseProps & {
  options: AtFormComboBoxAsyncOptions;
  enumsKey: string;
};

// Final union type for export
export type AtFormComboBoxProps = AtFormComboBoxStaticProps | AtFormComboBoxAsyncProps;
