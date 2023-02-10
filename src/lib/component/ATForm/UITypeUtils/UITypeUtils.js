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
}

export const getTypeInfo = (type) => {
    return types.find(item => item.type === type)
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
export const types = [
    {
        type: 'Button',
    },
    {
        type: 'TextBox',
        initialValue: '',
    },
    {
        type: 'ComboBox',
        initialValue: null,
        convertToKeyValue: (event) => {
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
    },
    {
        type: 'MultiComboBox',
        initialValue: [],
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
        }
    },
    {
        type: 'DatePicker',
        initialValue: null,
        convertToKeyValue: (event) => moment(event.target.value).isValid() ? moment(event.target.value).format('YYYY-MM-DD') : null,
        reverseConvertToKeyValue: ({ value, element, enums }) => {
            if (value === undefined || value === null)
                return null
            else
                return new Date(value)
        }
    },
    {
        type: 'UploadButton',
        initialValue: [],
    },
    {
        type: 'CascadeComboBox',
        initialValue: null,
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
        }
    },
    {
        type: 'CheckBox',
        initialValue: false,
    },
    {
        type: 'Slider',
        initialValue: null,
    },
    {
        type: 'PasswordTextBox',
        initialValue: '',
    },
    {
        type: 'DoublePasswordTextBox',
        initialValue: null,
    },
    {
        type: 'Avatar',
        initialValue: null,
    },
    {
        type: 'Label',
    },
    {
        type: 'ContainerWithTable',
        initialValue: [],
        convertToKeyValue: (event) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value, element, enums }) => {
            if (value === undefined || value === null)
                return []

            return JSON.parse(value)
        }
    },
    {
        type: 'MultiSelectTextBox',
        initialValue: [],
        convertToKeyValue: (event) => {
            return JSON.stringify(event.target.value)
        },
        reverseConvertToKeyValue: ({ value, element, enums }) => {
            if (value === null || value === undefined)
                return []
            else
                return JSON.parse(value)
        },
    },
]