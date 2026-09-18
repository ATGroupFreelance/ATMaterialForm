import type { AutocompleteProps, AutocompleteRenderInputParams } from "@mui/material";
import type { AtEnumItemType, AtEnumType, AtFormMinimalControlledUiProps, StrictOmit } from "../Common.type";

export interface AtFormMultiComboBoxChangeEvent {
  target: {
    value: AtEnumItemType[];
  };
}

type AtFormMultiComboBoxAutocompleteProps = StrictOmit<
  AutocompleteProps<AtEnumItemType, true, boolean, false>,
  'id' | 'value' | 'onChange' | 'readOnly' | 'options' | 'renderInput' | 'multiple' | 'freeSolo'
>;

/**
 * Multi-select companion to ComboBox. Direct React usage works with rich option
 * objects; ATForm owns conversion to persistent ids.
 */
export type AtFormMultiComboBoxProps = AtFormMinimalControlledUiProps<{
  value: AtEnumItemType[];
  onChange: (event: AtFormMultiComboBoxChangeEvent) => void;
}> & AtFormMultiComboBoxAutocompleteProps & {
  label?: string;
  /** Already-resolved options. Omit to read from AtFormConfigProvider enums. */
  options?: AtEnumType | null;
  /** Enum key to read when `options` is omitted. Defaults to the field/component id. */
  enumsKey?: string;
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  /** Fixed by this component's multi-select contract. */
  multiple?: true;
  /** MultiComboBox values must always be AtEnumItemType objects. */
  freeSolo?: false;
};
