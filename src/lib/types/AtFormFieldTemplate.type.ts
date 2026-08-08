//serializable AtForm types

import { AtJsonObject, AtJsonValue } from "at-shared-types/domain";

export type AtFormUiTypeKey = string;

export interface AtFormFieldTemplateTProps {
    /**
     * Actual AtForm runtime UI type.
     *
     * Examples:
     * TextBox
     * ComboBox
     * DatePicker
     * Report
     * CustomProjectComponent
     */
    type: AtFormUiTypeKey;

    size?: number;

    tabPath?: AtJsonValue;

    validation?: AtJsonValue;

    debug?: boolean;

    defaultValue?: AtJsonValue;
}

/**
 * Persistable AtForm field template.
 *
 * It intentionally does not contain:
 * - id
 * - label
 * - wrapperRenderer
 * - runtimeBindings
 * - colDef
 * - callbacks
 * - React components
 */
export interface AtFormFieldTemplate {
    tProps: AtFormFieldTemplateTProps;

    /**
     * Component-specific, JSON-safe defaults.
     */
    uiProps?: AtJsonObject;
}