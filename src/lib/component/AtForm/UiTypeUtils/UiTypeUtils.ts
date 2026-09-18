import moment from 'moment';
//Cell Renderers
import UploadButtonCellRenderer from '../Ui/UploadButton/UploadButtonCellRenderer/UploadButtonCellRenderer';
import { AtConvertInterface, AtGetTitleByEnumsInterface, AtReverseConvertInterface, AtFormTypeInfoInterface, AtFormCreateControlledType, AtFormCreateUncontrolledType } from '../../../types/UiTypeUtils.type';
import { AtFormComboBoxProps } from '../../../types/ui/ComboBox.type';
import { AtFormMultiComboBoxProps } from '../../../types/ui/MultiComboBox.type';
import { AtFormMultiSelectTextBoxOption } from '../../../types/ui/MultiSelectTextBox.type';
import { AtFormFormProps } from '../../../types/ui/Form.type';

export const UiTypes = {
    Button: 'Button',
    TextBox: 'TextBox',
    IntegerTextBox: 'IntegerTextBox',
    FloatTextBox: 'FloatTextBox',
    ComboBox: 'ComboBox',
    MultiComboBox: 'MultiComboBox',
    DatePicker: 'DatePicker',
    UploadButton: 'UploadButton',
    UploadImageButton: 'UploadImageButton',
    FileViewer: 'FileViewer',
    CascadeComboBox: 'CascadeComboBox',
    CascadePathComboBox: 'CascadePathComboBox',
    CheckBox: 'CheckBox',
    Slider: 'Slider',
    PasswordTextBox: 'PasswordTextBox',
    DoublePasswordTextBox: 'DoublePasswordTextBox',
    Avatar: 'Avatar',
    Label: 'Label',
    ContainerWithTable: 'ContainerWithTable',
    MultiSelectTextBox: 'MultiSelectTextBox',
    Table: 'Table',
    Grid: 'Grid',
    MultiSelectGrid: 'MultiSelectGrid',
    ImageSelect: 'ImageSelect',
    AdvanceStepper: 'AdvanceStepper',
    Form: 'Form',
    FormDialog: 'FormDialog',
    ColorTextBox: 'ColorTextBox',
    CardSelect: 'CardSelect',
    CustomControlledField: 'CustomControlledField',
    CustomUncontrolledField: 'CustomUncontrolledField',
}

export const getTypeInfo = (type: string, customTypes?: AtFormTypeInfoInterface[] | null): AtFormTypeInfoInterface | undefined => {
    const newTypes: AtFormTypeInfoInterface[] = [
        ...types,
        ...(customTypes || [])
    ]

    const found = newTypes.find(item => item.type === type)

    if (!found) {
        console.error(`Invalid UI type found!, Can not find type ${type} inside ATMaterialForm UI Types valid types are : ${JSON.stringify(newTypes.map(item => item.type))}`)
    }

    return found
}

const getEnumOptions = ({ id, enumsKey, options, enums }: Omit<AtGetTitleByEnumsInterface, 'value'>) => {
    if (Array.isArray(options))
        return options

    const searchId = enumsKey || id
    return enums?.[searchId] ?? []
}

export const getEnumItemByValue = ({ id, enumsKey, options, enums, value }: AtGetTitleByEnumsInterface) => {
    if (value === null || value === undefined)
        return undefined

    const data = getEnumOptions({ id, enumsKey, options, enums })
    const exactMatch = data.find(item => item.id === value)
    if (exactMatch)
        return exactMatch

    // MultiComboBox's historical KeyValue format is CSV, so numeric ids can
    // arrive here as strings. Preserve that compatibility only when the
    // serialized id identifies exactly one canonical option.
    const legacyMatches = data.filter(item => String(item.id) === String(value))
    return legacyMatches.length === 1 ? legacyMatches[0] : undefined
}

export const getTitleByEnums = (props: AtGetTitleByEnumsInterface) => {
    if (props.value === null || props.value === undefined)
        return ''

    const found = getEnumItemByValue(props)
    return found ? String(found.title) : String(props.value)
}

const reverseComboBoxValue = (props: AtGetTitleByEnumsInterface) => {
    return getEnumItemByValue(props) ?? {
        id: props.value,
        title: String(props.value),
    }
}

export const createValidation = ({ errorMessage, ...props }: any) => {
    return {
        ...props,
        errorMessage: errorMessage ? errorMessage : 'This field can not be empty'
    }
}

//Facts:
//1- Because values are controlled, Initial value CAN NOT BE UNDEFINED
//2- If initialValue is not inside an object it means the object is uncontrolled
//3- If you want to set the initialValue to null please set "isNullValueValid" to true
export const createType = ({
    type,
    initialValue,
    isNullValueValid,
    convertToKeyValue,
    reverseConvertToKeyValue,
    convertToSemiKeyValue,
    reverseConvertToSemiKeyValue,
    validation,
    getAgGridColumnDef,
    isControlledUi
}: AtFormTypeInfoInterface) => {
    return {
        type,
        initialValue,
        isNullValueValid: isNullValueValid === undefined ? (initialValue === null) : isNullValueValid,
        isControlledUi: isControlledUi ?? (initialValue !== undefined),
        convertToKeyValue,
        reverseConvertToKeyValue,
        convertToSemiKeyValue: convertToSemiKeyValue ?? convertToKeyValue,
        reverseConvertToSemiKeyValue: reverseConvertToSemiKeyValue ?? reverseConvertToKeyValue,
        validation,
        getAgGridColumnDef
    }
}

export const createControlledType = (props: AtFormCreateControlledType) => {
    return createType({
        ...props,
        isControlledUi: true,
    })
}

export const createUncontrolledType = (props: AtFormCreateUncontrolledType) => {
    return createType({
        ...props,
        isControlledUi: false,
    })
}

export const types = [
    createType({
        type: 'Button',
    }),
    createType({
        type: 'TextBox',
        initialValue: '',
        validation: createValidation({ anyOf: [{ type: 'string', minLength: 1 }, { type: 'integer' }] }),
    }),
    createType({
        type: 'IntegerTextBox',
        initialValue: null,
        validation: createValidation({ anyOf: [{ type: 'integer' }] }),
        reverseConvertToKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value && value !== 0)
                return null
            else if (typeof value === "string")
                return parseInt(value)
            else
                return value
        },
        getAgGridColumnDef: () => {
            return {
                valueFormatter: ({ value }: any) => {
                    return value === null ? '' : value
                }
            }
        }
    }),
    createType({
        type: 'FloatTextBox',
        initialValue: null,
        validation: createValidation({ anyOf: [{ type: 'number' }] }),
        reverseConvertToKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value && value !== 0)
                return null
            else if (typeof value === "string")
                return Number(value)
            else
                return value
        },
        getAgGridColumnDef: () => {
            return {
                valueFormatter: ({ value }: any) => {
                    return value === null ? '' : value
                }
            }
        }
    }),
    createType({
        type: 'ComboBox',
        initialValue: null,
        validation: createValidation({ anyOf: [{ type: 'number' }, { type: 'string', minLength: 1 }] }),
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            const selectedItem = event.target.value
            return selectedItem === null || selectedItem === undefined ? null : selectedItem.id
        },
        reverseConvertToKeyValue: ({ value, childProps, enums }: AtReverseConvertInterface<{ uiProps?: AtFormComboBoxProps }>) => {
            if (value === null || value === undefined)
                return null

            return reverseComboBoxValue({
                id: childProps.tProps.id,
                enumsKey: childProps.uiProps?.enumsKey,
                options: childProps.uiProps?.options,
                enums,
                value,
            })
        },
    }),
    createType({
        type: 'MultiComboBox',
        initialValue: [],
        validation: createValidation({ type: 'array', minItems: 1 }),
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            return (event.target.value ?? []).map((item: any) => item.id).join(',')
        },
        reverseConvertToKeyValue: ({ value, childProps, enums }: AtReverseConvertInterface<{ uiProps?: AtFormMultiComboBoxProps }>) => {
            if (!value)
                return []

            const valueArray = Array.isArray(value) ? value : String(value).split(',')
            return valueArray.map((item: any) => reverseComboBoxValue({
                id: childProps.tProps.id,
                enumsKey: childProps.uiProps?.enumsKey,
                options: childProps.uiProps?.options,
                enums,
                value: item,
            }))
        },
        convertToSemiKeyValue: ({ event }: AtConvertInterface) => {
            return (event.target.value ?? []).map((item: any) => item.id)
        },
        reverseConvertToSemiKeyValue: ({ value, childProps, enums }: AtReverseConvertInterface<{ uiProps?: AtFormMultiComboBoxProps }>) => {
            if (!value)
                return []

            return value.map((item: any) => reverseComboBoxValue({
                id: childProps.tProps.id,
                enumsKey: childProps.uiProps?.enumsKey,
                options: childProps.uiProps?.options,
                enums,
                value: item,
            }))
        }
    }),
    createType({
        type: 'DatePicker',
        initialValue: null,
        validation: createValidation({ type: 'string', minLength: 1 }),
        convertToKeyValue: ({ event }: AtConvertInterface) => moment(event.target.value).isValid() ? moment(event.target.value).format('YYYY-MM-DD') : null,
        reverseConvertToKeyValue: ({ value, rtl }: AtReverseConvertInterface) => {
            if (value === undefined || value === null)
                return null
            else
                return rtl ? new Date(value) : moment(value)
        }
    }),
    createType({
        type: 'UploadButton',
        initialValue: [],
        validation: createValidation({ type: 'array', minItems: 1 }),
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return []

            return JSON.parse(value)
        },
        convertToSemiKeyValue: ({ event }: AtConvertInterface) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return []

            return value
        },
        getAgGridColumnDef: () => {
            return {
                cellRenderer: UploadButtonCellRenderer,
            }
        }
    }),
    createType({
        type: 'UploadImageButton',
        initialValue: null,
        validation: createValidation({ type: 'object' }),
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            if (!event.target.value)
                return null

            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return null

            return typeof value === 'string' ? JSON.parse(value) : value
        },
        convertToSemiKeyValue: ({ event }: AtConvertInterface) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: AtReverseConvertInterface) => {
            return value || null
        },
    }),
    createType({
        type: 'FileViewer',
        initialValue: [],
        validation: createValidation({ type: 'array', minItems: 1 }),
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return []

            return JSON.parse(value)
        },
        convertToSemiKeyValue: ({ event }: AtConvertInterface) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return []

            return value
        },
        getAgGridColumnDef: () => {
            return {
                cellRenderer: UploadButtonCellRenderer,
            }
        }
    }),
    createType({
        type: 'CascadeComboBox',
        initialValue: null,
        validation: createValidation({
            anyOf: [
                { type: 'integer' },
                { type: 'string', minLength: 1 },
            ],
        }),
    }),
    createType({
        type: 'CascadePathComboBox',
        initialValue: null,
        validation: createValidation({
            type: 'object',
            eachPropIsValid: true,
            errorMessage: 'This field can not be empty',
        }),
    }),
    createType({
        type: 'CheckBox',
        initialValue: false,
    }),
    createType({
        type: 'Slider',
        initialValue: null,
    }),
    createType({
        type: 'PasswordTextBox',
        initialValue: '',
        validation: createValidation({ type: 'string', minLength: 1 }),
    }),
    createType({
        type: 'DoublePasswordTextBox',
        initialValue: null,
        validation: createValidation({ type: 'string', minLength: 1 }),
    }),
    createType({
        type: 'Avatar',
        initialValue: null,
        validation: createValidation({ type: 'string', minLength: 1 }),
    }),
    createType({
        type: 'Label',
    }),
    createType({
        type: 'ContainerWithTable',
        initialValue: [],
        validation: createValidation({ type: 'array', minItems: 1 }),
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return []

            return JSON.parse(value)
        },
        convertToSemiKeyValue: ({ event }: AtConvertInterface) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return []

            return value
        },
    }),
    createType({
        type: 'MultiSelectTextBox',
        initialValue: [],
        validation: createValidation({ type: 'array', minItems: 1 }),
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            return JSON.stringify(event.target.value.map((item: AtFormMultiSelectTextBoxOption) => {
                return item.value
            }))
        },
        reverseConvertToKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return []
            else
                return JSON.parse(value).map((item: number | string, index: number) => {
                    return {
                        id: index,
                        value: item,
                    }
                })
        },
        convertToSemiKeyValue: ({ event }: AtConvertInterface) => {
            return event.target.value.map((item: AtFormMultiSelectTextBoxOption) => {
                return item.value
            })
        },
        reverseConvertToSemiKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return []
            else
                return value.map((item: number | string, index: number) => {
                    return {
                        id: index,
                        value: item,
                    }
                })
        },
    }),
    createType({
        type: 'Table',
    }),
    createType({
        type: 'Grid',
    }),
    createType({
        type: 'MultiSelectGrid',
        initialValue: [],
        validation: createValidation({ type: 'array', minItems: 1 }),
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return []
            else
                return JSON.parse(value)
        },
        convertToSemiKeyValue: ({ event }: AtConvertInterface) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return []
            else
                return value
        },
    }),
    createType({
        type: 'ImageSelect',
        initialValue: [],
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return []

            return JSON.parse(value)
        },
        convertToSemiKeyValue: ({ event }: AtConvertInterface) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return []

            return value
        },
    }),
    createType({
        type: 'CardSelect',
        initialValue: null,
        validation: createValidation({ anyOf: [{ type: 'string', minLength: 1 }, { type: 'integer' }] }),
        convertToKeyValue: ({ event }: AtConvertInterface) => event.target.value,
        reverseConvertToKeyValue: ({ value }: AtReverseConvertInterface) => value ?? null,
        convertToSemiKeyValue: ({ event }: AtConvertInterface) => event.target.value,
        reverseConvertToSemiKeyValue: ({ value }: AtReverseConvertInterface) => value ?? null,
    }),
    createType({
        type: 'AdvanceStepper',
        initialValue: null
    }),
    createType({
        type: 'Form',
        initialValue: null,
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            if (!event.target.value)
                return null

            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: AtReverseConvertInterface<{ uiProps?: AtFormFormProps }>) => {
            if (!value)
                return null

            return JSON.parse(value)
        },
        convertToSemiKeyValue: ({ event }: AtConvertInterface) => {
            if (!event.target.value)
                return null

            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: AtReverseConvertInterface<{ uiProps?: AtFormFormProps }>) => {
            if (!value)
                return null

            return value
        },
    }),
    createType({
        type: 'FormDialog',
        initialValue: null,
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            if (!event.target.value)
                return null

            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return null

            return JSON.parse(value)
        },
        convertToSemiKeyValue: ({ event }: AtConvertInterface) => {
            if (!event.target.value)
                return null

            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return null

            return value
        },
    }),
    createType({
        type: 'ColorTextBox',
        initialValue: '',
        validation: createValidation({ anyOf: [{ type: 'string', minLength: 1 }, { type: 'integer' }] }),
    }),
    createType({
        type: 'CustomControlledField',
        initialValue: null,
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return null

            return JSON.parse(value)
        },
        convertToSemiKeyValue: ({ event }: AtConvertInterface) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: AtReverseConvertInterface) => {
            if (!value)
                return null

            return value
        },
    }),
    createType({
        type: 'CustomUncontrolledField',
    }),
]