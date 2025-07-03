import { ATFormAnyToFormDataInterface, ATFormChildProps, ATFormFormDataToAnyInterface } from "@/lib/types/ATForm.type";
import { ATFormFormDataType } from "@/lib/types/ATFormFormData.type";
import { ATFormCascadeComboBoxAsyncOptions, ATFormCascadeComboBoxOptionsType } from "@/lib/types/ui/CascadeComboBox.type";

export const capitalizeFirstLetter = (string: any) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const isLiteralObject = (a: any) => {
    return (!!a) && (a.constructor === Object);
};

export const groupKeyValueAsTableData = (formDataKeyValue: any, groupID: any, idList: any) => {
    const result: Record<string, any> = {}
    const groupedValues: Record<string, any> = {}

    let counter = 0


    for (const key in formDataKeyValue) {
        const found = idList.find((item: any) => item === key)

        if (found) {
            counter = counter + 1
            groupedValues[key] = formDataKeyValue[key]
        }
        else {
            result[key] = formDataKeyValue[key]
        }
    }

    if (counter !== 0)
        result[groupID] = JSON.stringify([groupedValues])

    return result
}

export const reverseGroupKeyValueAsTableData = (formDataKeyValue: any, groupID: any) => {
    const { [groupID]: groupObject, ...rest } = formDataKeyValue

    let parsedGroupObject = []
    if (groupObject) {
        parsedGroupObject = JSON.parse(groupObject)
    }

    return {
        ...rest,
        ...(parsedGroupObject.length ? parsedGroupObject[0] : {}),
    }
}

//Used for knowing if option or data is function or a real data!
export const isFunction = (obj: any) => {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

export const convertNoneEnglishNumbers = (str: any) => {
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]

    if (typeof str === 'string') {
        for (let i = 0; i < 10; i++) {
            str = str.replaceAll(persianNumbers[i], i).replaceAll(arabicNumbers[i], i);
            console.log('str', str)
        }
    }

    return str;
}

export const getFlatChildren = (children: any) => {
    let arrayChildren = []
    if (children) {
        if (Array.isArray(children))
            arrayChildren = children
        else
            arrayChildren.push(children)
    }

    return arrayChildren.flat(1)
}

export function isAsyncOptions(options: ATFormCascadeComboBoxOptionsType): options is ATFormCascadeComboBoxAsyncOptions {
    return typeof options === 'function';
}

//Convert any format type to formData format type
export function anyToFormData({ value, valueFormat, flatChildrenProps, enums, rtl }: ATFormAnyToFormDataInterface): ATFormFormDataType {
    if (!value)
        return {};

    if (valueFormat === "FormData")
        return value;

    const result: ATFormFormDataType = {}

    for (const key in value) {
        //Find the elemenet of the value using id match
        const foundChildProps = flatChildrenProps.find((item: any) => String(item.tProps?.id) === String(key))

        //TODO HANDLE CONDITIONAL INSERT:
        //If you have used conditional insertion, in some cases, such as datepicker, this "found" variable will be null on the first run.
        //This means that the date is not reverse converted to a value, and after the condition is met, 
        //it will throw an error because the element is initialized with a value that was not reversed.
        //One easy solution is to initialize your insertion condition using a default value.
        if (foundChildProps) {

            //Find the element's type inside types which is inisde UITypeUtils, using this type we can do a reverseConvertToKeyValue
            const typeInfo = (foundChildProps as ATFormChildProps)?.typeInfo

            if (!typeInfo) {
                console.warn('Type not found, child props is for an unknown child', { foundChildProps, id: key })
                return result[key] = {
                    value: value[key]
                }
            }

            /**Because typeInfo exists we are sure its a ATFormChildProps */
            const childProps = foundChildProps as ATFormChildProps

            //if a reverseConvertToKeyValue exists, use it if not just put the value unchanged
            if (valueFormat === 'FormDataKeyValue' && typeInfo.reverseConvertToKeyValue)
                result[key] = {
                    value: typeInfo.reverseConvertToKeyValue({ value: value[key], childProps, enums, rtl })
                }
            else if (valueFormat === 'FormDataSemiKeyValue' && typeInfo.reverseConvertToSemiKeyValue)
                result[key] = {
                    value: typeInfo.reverseConvertToSemiKeyValue({ value: value[key], childProps, enums, rtl })
                }
            else {
                result[key] = {
                    value: value[key]
                }
            }
        }
        else {
            result[key] = {
                value: value[key]
            }
        }
    }

    return result;
}

export function formDataToAny({ formData, targetFormat, flatChildrenProps, enums }: ATFormFormDataToAnyInterface) {
    if (!formData)
        return {}

    if (targetFormat === 'FormData')
        return formData

    const result: Record<string, any> = {}

    for (const key in formData) {
        //Find the elemenet of the value using id match
        const foundChildProps = flatChildrenProps.find((item: any) => String(item.tProps?.id) === String(key))

        //TODO HANDLE CONDITIONAL INSERT:
        //If you have used conditional insertion, in some cases, such as datepicker, this "found" variable will be null on the first run.
        //This means that the date is not reverse converted to a value, and after the condition is met, 
        //it will throw an error because the element is initialized with a value that was not reversed.
        //One easy solution is to initialize your insertion condition using a default value.
        if (foundChildProps) {

            //Find the element's type inside types which is inisde UITypeUtils, using this type we can do a reverseConvertToKeyValue
            const typeInfo = (foundChildProps as ATFormChildProps)?.typeInfo

            if (!typeInfo) {
                console.warn('Type not found, child props is for an uknown child', { foundChildProps, id: key })
                return result[key] = formData[key]
            }

            /**Because typeInfo exists we are sure its a ATFormChildProps */
            const childProps = foundChildProps as ATFormChildProps

            //if a reverseConvertToKeyValue exists, use it if not just put the value unchanged
            if (targetFormat === 'FormDataKeyValue' && typeInfo.convertToKeyValue)
                result[key] = typeInfo.convertToKeyValue({ event: { target: { value: formData[key]?.value } }, childProps, enums })
            else if (targetFormat === 'FormDataSemiKeyValue' && typeInfo.reverseConvertToSemiKeyValue)
                result[key] = typeInfo.convertToSemiKeyValue({ event: { target: { value: formData[key]?.value } }, childProps, enums })
            else {
                result[key] = formData[key]?.value
            }
        }
        else {
            result[key] = formData[key]?.value
        }
    }

    console.log('formDataToAny', {
        formData,
        result,
        targetFormat
    })

    return result;
}