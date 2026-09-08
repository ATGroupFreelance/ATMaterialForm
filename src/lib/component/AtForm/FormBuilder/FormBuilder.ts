import { AtFormBuilderCreateInterface, AtFormFieldTypelessTProps } from "../../../types/FormBuilder.type";

import { AtFormTextBoxProps } from "../../../types/ui/TextBox.type";
import { AtFormIntegerTextBoxProps } from "../../../types/ui/IntegerTextBox.type";
import { AtFormFloatTextBoxProps } from "../../../types/ui/FloatTextBox.type";
import { AtFormButtonProps } from "../../../types/ui/Button.type";
import { AtFormComboBoxProps } from "../../../types/ui/ComboBox.type";
import { AtFormMultiComboBoxProps } from "../../../types/ui/MultiComboBox.type";
import { AtFormDatePickerProps } from "../../../types/ui/DatePicker.type";
import { AtFormUploadButtonProps } from "../../../types/ui/UploadButton.type";
import { AtFormUploadImageButtonProps } from "../../../types/ui/UploadImageButton.type";
import { AtFormFileViewerProps } from "../../../types/ui/FileViewer.type";
import { AtFormCascadeComboBoxProps } from "../../../types/ui/CascadeComboBox.type";
import { AtFormMultiValueCascadeComboBoxProps } from "../../../types/ui/MultiValueCascadeComboBox.type";
import { GridProps } from "@mui/material";
import { AtFormCheckBoxProps } from "../../../types/ui/CheckBox.type";
import { AtFormSliderProps } from "../../../types/ui/Slider.type";
import { AtFormPasswordTextBoxProps } from "../../../types/ui/PasswordTextBox.type";
import { AtFormDoublePasswordTextBoxProps } from "../../../types/ui/DoublePasswordTextBox.type";
import { AtFormAvatarProps } from "../../../types/ui/Avatar.type";
import { AtFormLabelProps } from "../../../types/ui/Label.type";
import { AtFormMultiSelectTextBoxProps } from "../../../types/ui/MultiSelectTextBox.type";
import { AtFormTableProps } from "../../../types/ui/Table.type";
import { AtFormImageSelectProps } from "../../../types/ui/ImageSelect.type";
import { AtFormAdvanceStepperProps } from "../../../types/ui/AdvanceStepper.type";
import { AtFormFormProps } from "../../../types/ui/Form.type";
import { AtFormColorTextBoxProps } from "../../../types/ui/ColorTextBox.type";
import { AtFormContainerWithTableProps } from "../../../types/ui/ContainerWithTable.type";
import { AtFormMultiSelectGridProps } from "../../../types/ui/MultiSelectGrid.type";
import { AtFormFieldDefInterface } from "../../../types/AtForm.type";
import { formBuilderUtils } from "./FormBuilderUtils";
import { AtFormFormDialogProps } from "../../../types/ui/FormDialog.type";
import { AtFormCustomControlledFieldProps } from "../../../types/ui/CustomControlledField.type";
import { AtFormCustomUncontrolledFieldProps } from "../../../types/ui/CustomUncontrolledField.type";
import { AtFormCardSelectProps } from "../../../types/ui/CardSelect.type";
import type {
    AtFormBuiltInLayoutCreateProps,
    AtFormBuiltInLayoutDef,
    AtFormBuiltInLayoutType,
    AtFormChildren,
    AtFormCustomLayoutCreateProps,
    AtFormCustomLayoutDef,
    AtFormLayoutDefInterface,
    AtFormLayoutRenderer,
    AtFormLayoutBaseInterface,
} from "../../../types/AtFormLayout.type";

// const splitCapitalBySpace = (input: string) => {
//     const result = input.replace(/([A-Z]+)/g, ",$1").replace(/^,/, "");
//     return result.split(",").join(' ');
// }

const create = (props: AtFormBuilderCreateInterface): AtFormFieldDefInterface => {
    return {
        tProps: {
            type: props.type,
            ...props.tProps,
            size: props.tProps.size || props.defaultSize
        },
        uiProps: props.uiProps,
    }
}

function createLayout<K extends AtFormBuiltInLayoutType>(
    props: AtFormBuiltInLayoutCreateProps<K>,
    children: AtFormChildren,
): AtFormBuiltInLayoutDef<K>;

function createLayout<TConfig>(
    props: AtFormCustomLayoutCreateProps<TConfig>,
    children: AtFormChildren,
): AtFormCustomLayoutDef<TConfig>;

function createLayout(
    props: AtFormLayoutBaseInterface & {
        renderer: AtFormLayoutRenderer,
        config?: unknown,
    },
    children: AtFormChildren,
): AtFormLayoutDefInterface {
    return {
        kind: 'layout',
        ...props,
        children,
    };
}

/**
 * @example
 * formBuilder
    .createFieldDefBuilder(Columns)
    .remove(['B'])    
    .override(
        {
            A: { onChange: (event) => setA(event.target.value) },            
        }
    )
    .build()
 * @param {fieldDefs} columns: Array of {id, label, gridProps, uiProps}
 */

const createTextBox = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormTextBoxProps) => {
    return create({
        type: 'TextBox',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createIntegerTextBox = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormIntegerTextBoxProps) => {
    return create({
        type: 'IntegerTextBox',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createFloatTextBox = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormFloatTextBoxProps) => {
    return create({
        type: 'FloatTextBox',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createButton = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormButtonProps) => {
    return create({
        type: 'Button',
        defaultSize: 2,
        tProps,
        uiProps,
    })
}

const createComboBox = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormComboBoxProps) => {
    return create({
        type: 'ComboBox',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createMultiComboBox = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormMultiComboBoxProps) => {
    return create({
        type: 'MultiComboBox',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createDatePicker = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormDatePickerProps) => {
    return create({
        type: 'DatePicker',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

/**
 * @example
 * formBuilder.createUploadButton({ id: 'UploadButtonType1', size: 6, uploadButtonViewType: 1 }),
   formBuilder.createUploadButton({ id: 'UploadButtonType2', size: 6, uploadButtonViewType: 2 }),
 * @param {uploadButtonViewType} uploadButtonViewType: This button has 2 views, you can switch between them by passing a viewType number, the acceptable values are 1 and 2
 */

const createUploadButton = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormUploadButtonProps) => {
    return create({
        type: 'UploadButton',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createUploadImageButton = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormUploadImageButtonProps) => {
    return create({
        type: 'UploadImageButton',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createFileViewer = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormFileViewerProps) => {
    return create({
        type: 'FileViewer',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createCascadeComboBox = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormCascadeComboBoxProps) => {
    return create({
        type: 'CascadeComboBox',
        defaultSize: 12,
        tProps: {
            ...tProps,
            wrapperRenderer: {
                ...(tProps?.wrapperRenderer || {}),
                config: {
                    container: true,
                    spacing: 2,
                    ...(tProps?.wrapperRenderer?.config) || {},
                }
            },
        },
        uiProps,
    })
}

const createMultiValueCascadeComboBox = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormMultiValueCascadeComboBoxProps) => {
    return create({
        type: 'MultiValueCascadeComboBox',
        defaultSize: 12,
        tProps: {
            ...tProps,
            wrapperRenderer: {
                ...(tProps?.wrapperRenderer || {}),
                config: {
                    container: true,
                    spacing: 2,
                    ...(tProps?.wrapperRenderer?.config) || {},
                }
            },
        },
        uiProps,
    })
}

const createGrid = (tProps: AtFormFieldTypelessTProps, uiProps?: GridProps) => {
    return create({
        type: 'Grid',
        defaultSize: 12,
        tProps: {
            ...tProps,
            skipForm: false,
        },
        uiProps,
    })
}

const createCheckBox = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormCheckBoxProps) => {
    return create({
        type: 'CheckBox',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createSlider = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormSliderProps) => {
    return create({
        type: 'Slider',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createPasswordTextBox = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormPasswordTextBoxProps) => {
    return create({
        type: 'PasswordTextBox',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createDoublePasswordTextBox = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormDoublePasswordTextBoxProps) => {
    return create({
        type: 'PasswordTextBox',
        defaultSize: 6,
        tProps,
        uiProps,
    })
}

const createAvatar = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormAvatarProps) => {
    return create({
        type: 'Avatar',
        defaultSize: 2,
        tProps,
        uiProps,
    })
}

const createLabel = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormLabelProps) => {
    return create({
        type: 'Label',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createContainerWithTable = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormContainerWithTableProps) => {
    return create({
        type: 'ContainerWithTable',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createMultiSelectTextBox = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormMultiSelectTextBoxProps) => {
    return create({
        type: 'MultiSelectTextBox',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

/**
 * @example
    //You only need to supply the data for the table to show.
    const data = [{a: 10, b: 20}]
    //If you don't supply the columns which is any array of texts, it will use the first object of data to create it.
    const columns = ['a', 'b']
    //Use this component only for showing simple data in a tablur manner and nothing more.
 */
const createTable = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormTableProps) => {
    return create({
        type: 'Table',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

/**
 * @example
    This is a multi select grid, it can have label or not, it can also have a confirm changes button if you pass onConfirmButtonClick
    If you don't it will change live and updates the form
    You can provide a confirmButtonProps to customize the confirm button
    If you don't provide a uniqueKey it will simply return the index of selected row which is not always reliable
    If you do provide a unique key it will use this key to pick up the value of a row as the unique key, for example uniqueKey="ID"  
 */
const createMultiSelectGrid = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormMultiSelectGridProps) => {
    return create({
        type: 'MultiSelectGrid',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createImageSelect = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormImageSelectProps) => {
    return create({
        type: 'ImageSelect',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

/**
 * Large single-choice cards grouped into optional business categories.
 * The selected card id is used directly by FormDataKeyValue and FormDataSemiKeyValue.
 */
const createCardSelect = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormCardSelectProps) => {
    return create({
        type: 'CardSelect',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createAdvanceStepper = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormAdvanceStepperProps) => {
    return create({
        type: 'AdvanceStepper',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createForm = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormFormProps) => {
    return create({
        type: 'Form',
        defaultSize: 12,
        tProps,
        uiProps,
    })
}

const createFormDialog = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormFormDialogProps) => {
    return create({
        type: 'FormDialog',
        defaultSize: 3,
        tProps: {
            ...tProps,
            wrapperRenderer: {
                ...(tProps?.wrapperRenderer || {}) as any,
                renderer: tProps?.wrapperRenderer?.renderer ?? "Button",
            },
        },
        uiProps,
    })
}

const createColorTextBox = (tProps: AtFormFieldTypelessTProps, uiProps?: AtFormColorTextBoxProps) => {
    return create({
        type: 'ColorTextBox',
        defaultSize: 3,
        tProps,
        uiProps,
    })
}

const createCustomControlledField = <C extends React.ComponentType<any>>(component: C, tProps: AtFormFieldTypelessTProps, uiProps?: AtFormCustomControlledFieldProps<React.ComponentProps<C>>) => {
    return create({
        type: 'CustomControlledField',
        defaultSize: 3,
        tProps,
        uiProps: {
            ...(uiProps || {}),
            component,
        },
    });
}

const createCustomUncontrolledField = <C extends React.ComponentType<any>>(component: C, tProps: AtFormFieldTypelessTProps, uiProps?: AtFormCustomUncontrolledFieldProps<React.ComponentProps<C>>) => {
    return create({
        type: 'CustomUncontrolledField',
        defaultSize: 3,
        tProps,
        uiProps: {
            ...(uiProps || {}),
            component,
        },
    });
}

export const formBuilder = {
    utils: formBuilderUtils,
    createTextBox,
    createIntegerTextBox,
    createFloatTextBox,
    createButton,
    createComboBox,
    createMultiComboBox,
    createDatePicker,
    createUploadButton,
    createUploadImageButton,
    createFileViewer,
    createCascadeComboBox,
    createMultiValueCascadeComboBox,
    createGrid,
    createCheckBox,
    createSlider,
    createPasswordTextBox,
    createDoublePasswordTextBox,
    createAvatar,
    createLabel,
    createContainerWithTable,
    createMultiSelectTextBox,
    createTable,
    createMultiSelectGrid,
    createImageSelect,
    createCardSelect,
    createAdvanceStepper,
    createForm,
    createFormDialog,
    createColorTextBox,
    createCustomControlledField,
    createCustomUncontrolledField,
    createLayout
}