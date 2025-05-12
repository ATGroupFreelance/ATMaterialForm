import { AutocompleteProps, AutocompleteRenderInputParams } from "@mui/material";
import { ATEnumType, ATFormMinimalControlledUIProps, StrictOmit } from "../Common.type";

// Base shared props (used by both variants)
export type ATFormComboBoxBaseProps = ATFormMinimalControlledUIProps &
  StrictOmit<AutocompleteProps<any, boolean, boolean, boolean>, 'id' | 'value' | 'onChange' | 'readOnly' | 'options' | 'renderInput'> & {
    label?: string;
    renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  };

// Options type for sync
export type ATFormComboBoxStaticOptions = ATEnumType | null | undefined;

// Options type for async
export type ATFormComboBoxAsyncOptions = () => Promise<ATEnumType | null | undefined>;

// Props variant: static (no enumsID required)
export type ATFormComboBoxStaticProps = ATFormComboBoxBaseProps & {
  options: ATFormComboBoxStaticOptions;
  enumsID?: string;
};

// Props variant: async (enumsID required)
export type ATFormComboBoxAsyncProps = ATFormComboBoxBaseProps & {
  options: ATFormComboBoxAsyncOptions;
  enumsID: string;
};

// Final union type for export
export type ATFormComboBoxProps = ATFormComboBoxStaticProps | ATFormComboBoxAsyncProps;
