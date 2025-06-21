import { ATFormCascadeComboBoxAsyncOptions, ATFormCascadeComboBoxOptionsType } from "@/lib/types/ui/CascadeComboBox.type";

export const capitalizeFirstLetter = (string: any) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const convertToKeyValue = (formData: any) => {
    const result: Record<string, any> = {}

    for (const key in formData) {
        result[key] = formData.value
    }

    return result
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