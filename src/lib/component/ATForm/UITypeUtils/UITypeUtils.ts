import moment from 'moment';
//Cell Renderers
import UploadButtonCellRenderer from '../UI/UploadButton/UploadButtonCellRenderer/UploadButtonCellRenderer';
import { ATConvertInterface, ATGetTitleByEnumsInterface, ATReverseConvertInterface, ATFormTypeInfoInterface } from '../../../types/UITypeUtils.type';
import { ATFormComboBoxProps } from '@/lib/types/ui/ComboBox.type';
import { ATFormMultiComboBoxProps } from '@/lib/types/ui/MultiComboBox.type';
import { ATFormCascadeComboBoxProps } from '@/lib/types/ui/CascadeComboBox.type';
import { ATFormMultiSelectTextBoxOption } from '@/lib/types/ui/MultiSelectTextBox.type';
import { ATFormFormProps } from '@/lib/types/ui/Form.type';

export const UITypes = {
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
}

export const getTypeInfo = (type: string, customTypes?: ATFormTypeInfoInterface[] | null): ATFormTypeInfoInterface | undefined => {
    const newTypes: ATFormTypeInfoInterface[] = [
        ...types,
        ...(customTypes || [])
    ]

    const found = newTypes.find(item => item.type === type)

    if (!found) {
        console.error(`Invalid UI type found!, Can not find type ${type} inside ATMaterialForm UI Types valid types are : ${JSON.stringify(newTypes.map(item => item.type))}`)
    }

    return found
}

export const getTitleByEnums = ({ id, enumsKey, options, enums, value }: ATGetTitleByEnumsInterface) => {
    if (value === null || value === undefined)
        return ''

    const searchID = enumsKey || id
    const stringValue = String(value)
    let result = stringValue

    if (options && Array.isArray(options)) {
        const found = options.find(item => String(item.id) === stringValue)
        if (found)
            result = String(found.title)
    }
    else if (enums && enums[searchID]) {
        const found = enums[searchID].find((item: any) => String(item.id) === stringValue)
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

export const createType = ({ type, initialValue, isNullValueValid, convertToKeyValue, reverseConvertToKeyValue, convertToSemiKeyValue, reverseConvertToSemiKeyValue, validation, getAgGridColumnDef }: ATFormTypeInfoInterface) => {
    return {
        type,
        initialValue,
        isNullValueValid: isNullValueValid === undefined ? (initialValue === null) : isNullValueValid,
        isControlledUI: initialValue !== undefined,
        convertToKeyValue,
        reverseConvertToKeyValue,
        convertToSemiKeyValue: convertToSemiKeyValue ? convertToSemiKeyValue : convertToKeyValue,
        reverseConvertToSemiKeyValue: reverseConvertToSemiKeyValue ? reverseConvertToSemiKeyValue : reverseConvertToKeyValue,
        validation,
        getAgGridColumnDef
    }
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
        reverseConvertToKeyValue: ({ value }: ATReverseConvertInterface) => {
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
        reverseConvertToKeyValue: ({ value }: ATReverseConvertInterface) => {
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
        convertToKeyValue: ({ event }: ATConvertInterface) => {
            if (!event.target.value)
                return event.target.value

            return event.target.value.id
        },
        reverseConvertToKeyValue: ({ value, childProps, enums }: ATReverseConvertInterface<{ uiProps?: ATFormComboBoxProps }>): null | { id: number | string, title: string } => {
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
        convertToKeyValue: ({ event }: ATConvertInterface) => {
            return event.target.value.map((item: any) => item.id).join(',')
        },
        reverseConvertToKeyValue: ({ value, childProps, enums }: ATReverseConvertInterface<{ uiProps?: ATFormMultiComboBoxProps }>) => {
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
        convertToSemiKeyValue: ({ event }: ATConvertInterface) => {
            return event.target.value.map((item: any) => item.id)
        },
        reverseConvertToSemiKeyValue: ({ value, childProps, enums }: ATReverseConvertInterface<{ uiProps?: ATFormMultiComboBoxProps }>) => {
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
        convertToKeyValue: ({ event }: ATConvertInterface) => moment(event.target.value).isValid() ? moment(event.target.value).format('YYYY-MM-DD') : null,
        reverseConvertToKeyValue: ({ value, rtl }: ATReverseConvertInterface) => {
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
        convertToKeyValue: ({ event }: ATConvertInterface) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: ATReverseConvertInterface) => {
            if (!value)
                return []

            return JSON.parse(value)
        },
        convertToSemiKeyValue: ({ event }: ATConvertInterface) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: ATReverseConvertInterface) => {
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
        convertToKeyValue: ({ event }: ATConvertInterface) => {
            return event.target.value
        },
        reverseConvertToKeyValue: ({ value }: ATReverseConvertInterface) => {
            return value
        },
    }),
    createType({
        type: 'FileViewer',
        initialValue: [],
        validation: createValidation({ type: 'array', minItems: 1 }),
        convertToKeyValue: ({ event }: ATConvertInterface) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: ATReverseConvertInterface) => {
            if (!value)
                return []

            return JSON.parse(value)
        },
        convertToSemiKeyValue: ({ event }: ATConvertInterface) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: ATReverseConvertInterface) => {
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
        convertToKeyValue: ({ event, childProps }: ATConvertInterface<{ uiProps?: ATFormCascadeComboBoxProps }>) => {
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
        reverseConvertToKeyValue: ({ value, childProps, enums }: ATReverseConvertInterface<{ uiProps?: ATFormCascadeComboBoxProps }>) => {
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

                const enumsKeyParentIDField = leaf.enumsKeyParentIDField === undefined ? 'parent_id' : leaf.enumsKeyParentIDField
                const parentID = found?.[enumsKeyParentIDField]

                if (enumsKeyParentIDField && parentID) {
                    const parentValueResult = getLeafCascadeValue(getParentNode(childProps.uiProps?.design, leaf), parentID)
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
        convertToKeyValue: ({ event }: ATConvertInterface) => {
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
        reverseConvertToKeyValue: ({ value, enums }: ATReverseConvertInterface) => {
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
        convertToSemiKeyValue: ({ event }: ATConvertInterface) => {
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
        reverseConvertToSemiKeyValue: ({ value, enums }: ATReverseConvertInterface) => {
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
        convertToKeyValue: ({ event }: ATConvertInterface) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: ATReverseConvertInterface) => {
            if (!value)
                return []

            return JSON.parse(value)
        },
        convertToSemiKeyValue: ({ event }: ATConvertInterface) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: ATReverseConvertInterface) => {
            if (!value)
                return []

            return value
        },
    }),
    createType({
        type: 'MultiSelectTextBox',
        initialValue: [],
        validation: createValidation({ type: 'array', minItems: 1 }),
        convertToKeyValue: ({ event }: ATConvertInterface) => {
            return JSON.stringify(event.target.value.map((item: ATFormMultiSelectTextBoxOption) => {
                return item.value
            }))
        },
        reverseConvertToKeyValue: ({ value }: ATReverseConvertInterface) => {
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
        convertToSemiKeyValue: ({ event }: ATConvertInterface) => {
            return event.target.value.map((item: ATFormMultiSelectTextBoxOption) => {
                return item.value
            })
        },
        reverseConvertToSemiKeyValue: ({ value }: ATReverseConvertInterface) => {
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
        convertToKeyValue: ({ event }: ATConvertInterface) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: ATReverseConvertInterface) => {
            if (!value)
                return []
            else
                return JSON.parse(value)
        },
        convertToSemiKeyValue: ({ event }: ATConvertInterface) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: ATReverseConvertInterface) => {
            if (!value)
                return []
            else
                return value
        },
    }),
    createType({
        type: 'ImageSelect',
        initialValue: [],
        convertToKeyValue: ({ event }: ATConvertInterface) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: ATReverseConvertInterface) => {
            if (!value)
                return []

            return JSON.parse(value)
        },
        convertToSemiKeyValue: ({ event }: ATConvertInterface) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: ATReverseConvertInterface) => {
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
        convertToKeyValue: ({ event }: ATConvertInterface) => {
            if (!event.target.value)
                return null

            const result: Record<string, any> = {}

            for (const key in event.target.value) {
                result[key] = event.target.value[key].value
            }

            return JSON.stringify(result)
        },
        reverseConvertToKeyValue: ({ value, childProps }: ATReverseConvertInterface<{ uiProps?: ATFormFormProps }>) => {
            if (!value)
                return null

            const parsedValue = JSON.parse(value)

            const result: Record<string, any> = {}

            for (const key in parsedValue) {
                const found = childProps?.uiProps?.elements?.find((item: any) => item.tProps.id === key)

                result[key] = {
                    value: parsedValue[key],
                    type: found?.tProps?.type || null,
                    //We are passing undefined so the form uses its field changeID that is in its memory.
                    changeID: undefined,
                }
            }

            return result
        },
        convertToSemiKeyValue: ({ event }: ATConvertInterface) => {
            if (!event.target.value)
                return null

            const result: Record<string, any> = {}

            for (const key in event.target.value) {
                result[key] = event.target.value[key].value
            }

            return result
        },
        reverseConvertToSemiKeyValue: ({ value, childProps }: ATReverseConvertInterface<{ uiProps?: ATFormFormProps }>) => {
            if (!value)
                return null

            const result: Record<string, any> = {}

            for (const key in value) {
                const found = childProps?.uiProps?.elements?.find((item: any) => item.tProps.id === key)

                result[key] = {
                    value: value[key],
                    type: found?.tProps?.type || null,
                    changeID: undefined,
                }
            }

            return result
        },
    }),
    createType({
        type: 'FormDialog',
        initialValue: null,
        convertToKeyValue: ({ event }: ATConvertInterface) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value }: ATReverseConvertInterface) => {
            if (!value)
                return null

            return JSON.parse(value)
        },
        convertToSemiKeyValue: ({ event }: ATConvertInterface) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value }: ATReverseConvertInterface) => {
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
]