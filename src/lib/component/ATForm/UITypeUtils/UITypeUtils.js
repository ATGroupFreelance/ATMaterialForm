import moment from 'moment';

export const UITypes = {
    Button: 'Button',
    TextBox: 'TextBox',
    ComboBox: 'ComboBox',
    MultiComboBox: 'MultiComboBox',
    DatePicker: 'DatePicker',
    UploadButton: 'UploadButton',
    CascadeComboBox: 'CascadeComboBox',
    CheckBox: 'CheckBox',
    Slider: 'Slider',
    PasswordTextBox: 'PasswordTextBox',
    DoublePasswordTextBox: 'DoublePasswordTextBox',
    Avatar: 'Avatar',
    Label: 'Label',
    ContainerWithTable: 'ContainerWithTable',
    MultiSelectTextBox: 'MultiSelectTextBox',
    Table: 'Table',
}

export const getTypeInfo = (type) => {
    const found = types.find(item => item.type === type)

    if (!found)
        console.error(`Invalid UI type found!, Can not find type ${type} inside ATMaterialForm UI Types valid types are : ${JSON.stringify(types.map(item => item.type))}`)

    return found
}

export const getTitleByEnums = (enums, id, value) => {
    if (!enums)
        return value

    if (!enums[id])
        return value

    const found = enums[id].find(item => String(item.ID) === String(value))

    return found ? String(found.Title) : value
}

//Facts:
//1- Because values are controlled, Initial value CAN NOT BE UNDEFINED
//2- If initialValue is not inside an object it means the object is uncontrolled
//3- If you want to set the initialValue to null please set "isNullValueValid" to true

const createType = ({ type, initialValue, isNullValueValid, convertToKeyValue, reverseConvertToKeyValue, convertToSemiKeyValue, reverseConvertToSemiKeyValue, validation }) => {
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
    }
}

const types = [
    createType({
        type: 'Button',
    }),
    createType({
        type: 'TextBox',
        initialValue: '',
        validation: { anyOf: [{ type: 'string', minLength: 1 }, { type: 'integer' }] },
    }),
    createType({
        type: 'ComboBox',
        initialValue: null,
        validation: { type: 'integer' },
        convertToKeyValue: (event) => {
            console.log('event.target.value', event.target.value)
            if (!event.target.value)
                return event.target.value

            return event.target.value.ID
        },
        reverseConvertToKeyValue: ({ value, element, enums }) => {
            if (value === null || value === undefined)
                return null
            else
                return {
                    ID: value,
                    Title: String(getTitleByEnums(enums, element.id, value))
                }
        },
    }),
    createType({
        type: 'MultiComboBox',
        initialValue: [],
        validation: { type: 'array', minItems: 1 },
        convertToKeyValue: (event) => {
            return event.target.value.map(item => item.ID).join(',')
        },
        reverseConvertToKeyValue: ({ value, element, enums }) => {
            if (!value)
                return []
            else {
                const valueArray = value.split(',')

                return valueArray.map(item => {
                    return {
                        ID: item,
                        Title: String(getTitleByEnums(enums, element.id, item))
                    }
                })
            }
        },
        convertToSemiKeyValue: (event) => {
            return event.target.value.map(item => item.ID)
        },
        reverseConvertToSemiKeyValue: ({ value, element, enums }) => {
            if (!value)
                return []
            else {
                return value.map(item => {
                    return {
                        ID: item,
                        Title: String(getTitleByEnums(enums, element.id, item))
                    }
                })
            }
        }
    }),
    createType({
        type: 'DatePicker',
        initialValue: null,
        validation: { type: 'string', minLength: 1 },
        convertToKeyValue: (event) => moment(event.target.value).isValid() ? moment(event.target.value).format('YYYY-MM-DD') : null,
        reverseConvertToKeyValue: ({ value, element, enums }) => {
            if (value === undefined || value === null)
                return null
            else
                return new Date(value)
        }
    }),
    createType({
        type: 'UploadButton',
        initialValue: [],
        validation: { type: 'array', minItems: 1 },
        convertToKeyValue: (event) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value, element, enums }) => {
            if (value === undefined || value === null)
                return []

            return JSON.parse(value)
        },
        convertToSemiKeyValue: (event) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value, element, enums }) => {
            if (value === undefined || value === null)
                return []

            return value
        },
    }),
    createType({
        type: 'CascadeComboBox',
        initialValue: null,
        validation: { type: 'object' },
        convertToKeyValue: (event) => {
            if (!event.target.value)
                return event.target.value

            const result = {}

            for (let key in event.target.value) {
                if (Array.isArray(event.target.value[key]))
                    result[key] = event.target.value[key].map(item => item.ID)
                else
                    result[key] = event.target.value[key] ? event.target.value[key].ID : null
            }

            return JSON.stringify(result)
        },
        reverseConvertToKeyValue: ({ value, element, enums }) => {
            if (value === undefined || value === null)
                return null

            const parsedValue = JSON.parse(value)
            const result = {}

            for (let key in parsedValue) {
                if (parsedValue[key] === undefined || parsedValue[key] === null) {
                    result[key] = null
                    continue;
                }

                if (Array.isArray(parsedValue[key]))
                    result[key] = parsedValue[key].map(item => ({ ID: item, Title: String(getTitleByEnums(enums, key, item)) }))
                else
                    result[key] = {
                        ID: parsedValue[key],
                        Title: String(getTitleByEnums(enums, key, parsedValue[key]))
                    }
            }

            return result
        },
        convertToSemiKeyValue: (event) => {
            if (!event.target.value)
                return event.target.value

            const result = {}

            for (let key in event.target.value) {
                if (Array.isArray(event.target.value[key]))
                    result[key] = event.target.value[key].map(item => item.ID)
                else
                    result[key] = event.target.value[key] ? event.target.value[key].ID : null
            }

            return result
        },
        reverseConvertToSemiKeyValue: ({ value, element, enums }) => {
            if (value === undefined || value === null)
                return null

            const parsedValue = value
            const result = {}

            for (let key in parsedValue) {
                if (parsedValue[key] === undefined || parsedValue[key] === null) {
                    result[key] = null
                    continue;
                }

                if (Array.isArray(parsedValue[key]))
                    result[key] = parsedValue[key].map(item => ({ ID: item, Title: String(getTitleByEnums(enums, key, item)) }))
                else
                    result[key] = {
                        ID: parsedValue[key],
                        Title: String(getTitleByEnums(enums, key, parsedValue[key]))
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
        validation: { type: 'string', minLength: 1 },
    }),
    createType({
        type: 'DoublePasswordTextBox',
        initialValue: null,
        validation: { type: 'string', minLength: 1 },
    }),
    createType({
        type: 'Avatar',
        initialValue: null,
        validation: { type: 'string', minLength: 1 },
    }),
    createType({
        type: 'Label',
    }),
    createType({
        type: 'ContainerWithTable',
        initialValue: [],
        validation: { type: 'array', minItems: 1 },
        convertToKeyValue: (event) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value, element, enums }) => {
            if (value === undefined || value === null)
                return []

            return JSON.parse(value)
        },
        convertToSemiKeyValue: (event) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value, element, enums }) => {
            if (value === undefined || value === null)
                return []

            return value
        },
    }),
    createType({
        type: 'MultiSelectTextBox',
        initialValue: [],
        validation: { type: 'array', minItems: 1 },
        convertToKeyValue: (event) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value, element, enums }) => {
            if (value === null || value === undefined)
                return []
            else
                return JSON.parse(value)
        },
        convertToSemiKeyValue: (event) => {
            return event.target.value
        },
        reverseConvertToSemiKeyValue: ({ value, element, enums }) => {
            if (value === null || value === undefined)
                return []
            else
                return value
        },
    }),
    createType({
        type: 'Table',
    }),
    createType({
        type: 'Grid',
    })
]