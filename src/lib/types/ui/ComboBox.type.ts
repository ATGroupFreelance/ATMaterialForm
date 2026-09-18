import type { AutocompleteProps, AutocompleteRenderInputParams } from "@mui/material";
import type { AtEnumItemType, AtEnumType, AtFormMinimalControlledUiProps, StrictOmit } from "../Common.type";

export interface AtFormComboBoxChangeEvent {
  target: {
    value: AtEnumItemType | null;
  };
}

type AtFormComboBoxAutocompleteProps = StrictOmit<
  AutocompleteProps<AtEnumItemType, false, boolean, false>,
  'id' | 'value' | 'onChange' | 'readOnly' | 'options' | 'renderInput' | 'multiple' | 'freeSolo'
>;

/**
 * A thin, data-source-agnostic single-select ComboBox.
 *
 * Direct React usage works with rich enum option objects. ATForm is responsible
 * for converting those objects to/from persistent ids. `options` must already be
 * resolved; async acquisition/search belongs to the caller or ATForm runtime.
 */
export type AtFormComboBoxProps = AtFormMinimalControlledUiProps<{
  value: AtEnumItemType | null;
  onChange: (event: AtFormComboBoxChangeEvent) => void;
}> & AtFormComboBoxAutocompleteProps & {
  label?: string;
  /** Already-resolved options. Omit to read from AtFormConfigProvider enums. */
  options?: AtEnumType | null;
  /** Enum key to read when `options` is omitted. Defaults to the field/component id. */
  enumsKey?: string;
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  /** Fixed by this component's single-select contract. */
  multiple?: false;
  /** ComboBox values must always be AtEnumItemType objects. */
  freeSolo?: false;
};
