import moment from 'moment';
//Cell Renderers
import UploadButtonCellRenderer from '../Ui/UploadButton/UploadButtonCellRenderer/UploadButtonCellRenderer';
import { AtConvertInterface, AtGetTitleByEnumsInterface, AtReverseConvertInterface, AtFormTypeInfoInterface, AtFormCreateControlledType, AtFormCreateUncontrolledType } from '../../../types/UiTypeUtils.type';
import { AtFormComboBoxProps } from '../../../types/ui/ComboBox.type';
import { AtFormMultiComboBoxProps } from '../../../types/ui/MultiComboBox.type';
import { AtFormCascadeComboBoxProps } from '../../../types/ui/CascadeComboBox.type';
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
    MultiValueCascadeComboBox: 'MultiValueCascadeComboBox',
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

export const getTitleByEnums = ({ id, enumsKey, options, enums, value }: AtGetTitleByEnumsInterface) => {
    if (value === null || value === undefined)
        return ''

    const searchId = enumsKey || id
    const stringValue = String(value)
    let result = stringValue

    if (options && Array.isArray(options)) {
        const found = options.find(item => String(item.id) === stringValue)
        if (found)
            result = String(found.title)
    }
    else if (enums && enums[searchId]) {
        const found = enums[searchId].find((item: any) => String(item.id) === stringValue)
        if (found)
            result = String(found.title)
    }

    return result
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

const getLeafNodes = (nodes: any[] | undefined, result: any[] = []) => {
    if (!nodes)
        return result;

    for (let i = 0, length = nodes.length; i < length; i++) {
        if (!nodes[i].children || nodes[i].children.length === 0) {
            result.push(nodes[i]);
        } else {
            result = getLeafNodes(nodes[i].children, result);
        }
    }
    return result;
}

const getParentNode = (tree: any, node: any): any => {
    let result = null

    for (let i = 0; i < tree.length; i++) {
        if (tree[i].children || tree[i].children.length) {
            for (let j = 0; j < tree[i].children.length; j++) {
                const child = tree[i].children[j]
                if (child.id === node.id)
                    result = tree[i]
                else {
                    result = getParentNode([child], node)
                }

                if (result)
                    break;
            }

            if (result)
                break;
        }
    }

    return result
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
        validation: createValidation({ type: 'integer' }),
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            if (!event.target.value)
                return event.target.value

            return event.target.value.id
        },
        reverseConvertToKeyValue: ({ value, childProps, enums }: AtReverseConvertInterface<{ uiProps?: AtFormComboBoxProps }>): null | { id: number | string, title: string } => {
            if (value === null || value === undefined)
                return null
            else {
                return {
                    id: value,
                    title: getTitleByEnums({ id: childProps.tProps.id, enumsKey: childProps.uiProps?.enumsKey, options: childProps?.uiProps?.options, enums, value })
                }
            }
        },
    }),
    createType({
        type: 'MultiComboBox',
        initialValue: [],
        validation: createValidation({ type: 'array', minItems: 1 }),
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            return event.target.value.map((item: any) => item.id).join(',')
        },
        reverseConvertToKeyValue: ({ value, childProps, enums }: AtReverseConvertInterface<{ uiProps?: AtFormMultiComboBoxProps }>) => {
            if (!value)
                return []
            else {
                const valueArray = value.split(',')

                return valueArray.map((item: any) => {
                    return {
                        id: item,
                        title: getTitleByEnums({ id: childProps.tProps.id, enumsKey: childProps.uiProps?.enumsKey, options: childProps.uiProps?.options, enums, value: item })
                    }
                })
            }
        },
        convertToSemiKeyValue: ({ event }: AtConvertInterface) => {
            return event.target.value.map((item: any) => item.id)
        },
        reverseConvertToSemiKeyValue: ({ value, childProps, enums }: AtReverseConvertInterface<{ uiProps?: AtFormMultiComboBoxProps }>) => {
            if (!value)
                return []
            else {
                return value.map((item: any) => {
                    return {
                        id: item,
                        title: getTitleByEnums({ id: childProps.tProps.id, enumsKey: childProps.uiProps?.enumsKey, options: childProps.uiProps?.options, enums, value: item })
                    }
                })
            }
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
        validation: createValidation({ anyOf: [{ type: 'string', minLength: 1 }, { type: 'integer' }] }),
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            return event.target.value
        },
        reverseConvertToKeyValue: ({ value }: AtReverseConvertInterface) => {
            return value
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
        validation: createValidation({ type: 'integer' }),
        convertToKeyValue: ({ event, childProps }: AtConvertInterface<{ uiProps?: AtFormCascadeComboBoxProps }>) => {
            if (!event.target.value)
                return event.target.value

            const result: { [key: string]: any[] } = {}

            const leafs = getLeafNodes(childProps.uiProps?.design)

            if (leafs.length > 1) {
                console.error('Design can not have more than 1 leaf!!!, if you want multiple leafs use MultiValueCascadeComboBox! leafs: ', leafs)
                return event.target.value
            }
            else if (leafs.length === 0) {
                console.error('You need to have at least one leaf!! leafs: ', leafs)
                return event.target.value
            }

            const leaf = leafs[0]

            for (const key in event.target.value) {
                if (Array.isArray(event.target.value[key]))
                    result[key] = event.target.value[key].map(item => item.id)
                else
                    result[key] = event.target.value[key] ? event.target.value[key].id : null
            }

            return result[leaf.id]
        },
        reverseConvertToKeyValue: ({ value, childProps, enums }: AtReverseConvertInterface<{ uiProps?: AtFormCascadeComboBoxProps }>) => {
            if (value === undefined || value === null)
                return null

            const leafs = getLeafNodes(childProps.uiProps?.design)

            if (leafs.length > 1) {
                console.error('Design can not have more than 1 leaf!!!, if you want multiple leafs use MultiValueCascadeComboBox! leafs: ', leafs)
                return null
            }
            else if (leafs.length === 0) {
                console.error('You need to have at least one leaf!! leafs: ', leafs)
                return null
            }

            const getLeafCascadeValue = (leaf: any, value: any | undefined | null): any => {
                if (!leaf)
                    return {}

                const found = enums?.[leaf.enumsKey || leaf.id]?.find((item: any) => String(item.id) === String(value))

                const enumsKeyParentIdField = leaf.enumsKeyParentIdField === undefined ? 'parentId' : leaf.enumsKeyParentIdField
                const parentId = found?.metadata?.[enumsKeyParentIdField]

                if (enumsKeyParentIdField && parentId) {
                    const parentValueResult = getLeafCascadeValue(getParentNode(childProps.uiProps?.design, leaf), parentId)
                    console.log('parentValueResult', found, parentValueResult, leaf)

                    return {
                        [leaf.id]: found,
                        ...parentValueResult,
                    }
                }
                else
                    return {
                        [leaf.id]: found
                    }
            }

            const leaf = leafs[0]

            const res = getLeafCascadeValue(leaf, value)
            console.log('getLeafCascadeValue', res)
            return res
        },
    }),
    createType({
        type: 'MultiValueCascadeComboBox',
        initialValue: null,
        validation: createValidation({ type: 'object', eachPropIsValid: true, errorMessage: 'This field can not be empty' }),
        convertToKeyValue: ({ event }: AtConvertInterface) => {
            if (!event.target.value)
                return event.target.value

            const result: { [key: string]: any[] } = {}

            for (const key in event.target.value) {
                if (Array.isArray(event.target.value[key]))
                    result[key] = event.target.value[key].map(item => item.id)
                else
                    result[key] = event.target.value[key] ? event.target.value[key].id : null
            }

            return JSON.stringify(result)
        },
        reverseConvertToKeyValue: ({ value, enums }: AtReverseConvertInterface) => {
            if (value === undefined || value === null)
                return null

            const parsedValue = JSON.parse(value)
            const result: { [key: string]: any | null[] } = {}

            for (const key in parsedValue) {
                if (parsedValue[key] === undefined || parsedValue[key] === null) {
                    result[key] = null
                    continue;
                }

                if (Array.isArray(parsedValue[key]))
                    result[key] = parsedValue[key].map(item => ({ id: item, title: getTitleByEnums({ id: key, enums, value: item }) }))
                else
                    result[key] = {
                        id: parsedValue[key],
                        title: getTitleByEnums({ id: key, enums, value: parsedValue[key] })
                    }
            }

            return result
        },
        convertToSemiKeyValue: ({ event }: AtConvertInterface) => {
            if (!event.target.value)
                return event.target.value

            const result: { [key: string]: any[] } = {}

            for (const key in event.target.value) {
                if (Array.isArray(event.target.value[key]))
                    result[key] = event.target.value[key].map(item => item.id)
                else
                    result[key] = event.target.value[key] ? event.target.value[key].id : null
            }

            return result
        },
        reverseConvertToSemiKeyValue: ({ value, enums }: AtReverseConvertInterface) => {
            if (value === undefined || value === null)
                return null

            const parsedValue = value
            const result: { [key: string]: any | null[] } = {}

            for (const key in parsedValue) {
                if (parsedValue[key] === undefined || parsedValue[key] === null) {
                    result[key] = null
                    continue;
                }

                if (Array.isArray(parsedValue[key]))
                    result[key] = parsedValue[key].map(item => ({ id: item, title: getTitleByEnums({ id: key, enums, value: item }) }))
                else
                    result[key] = {
                        id: parsedValue[key],
                        title: getTitleByEnums({ id: key, enums, value: parsedValue[key] })
                    }
            }

            return result
        }
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