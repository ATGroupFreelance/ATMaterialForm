import moment from 'moment';

export const getTypeInfo = (type) => {
    return types.find(item => item.type === type)
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
    },
    {
        type: 'MultiComboBox',
        initialValue: [],
    },
    {
        type: 'DatePicker',
        initialValue: null,
        convertToKeyValue: (event) => moment(event.target.value).isValid() ? moment(event.target.value).format('YYYY-MM-DD') : null,
        reverseConvertToKeyValue: (value) => new Date(value)
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

            return result
        }
    }
]