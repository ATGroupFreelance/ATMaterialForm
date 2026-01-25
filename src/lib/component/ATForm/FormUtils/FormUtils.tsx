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
                result[key] = {
                    value: value[key],
                    changeID: undefined,
                }

                continue;
            }

            /**Because typeInfo exists we are sure its a ATFormChildProps */
            const childProps = foundChildProps as ATFormChildProps

            //if a reverseConvertToKeyValue exists, use it if not just put the value unchanged
            if (valueFormat === 'FormDataKeyValue' && typeInfo.reverseConvertToKeyValue)
                result[key] = {
                    value: typeInfo.reverseConvertToKeyValue({ value: value[key], childProps, enums, rtl }),
                    changeID: undefined,
                }
            else if (valueFormat === 'FormDataSemiKeyValue' && typeInfo.reverseConvertToSemiKeyValue)
                result[key] = {
                    value: typeInfo.reverseConvertToSemiKeyValue({ value: value[key], childProps, enums, rtl }),
                    changeID: undefined,
                }
            else {
                result[key] = {
                    value: value[key],
                    changeID: undefined,
                }
            }
        }
        else {
            result[key] = {
                value: value[key],
                changeID: undefined,
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
                result[key] = formData[key]

                continue;
            }

            /**Because typeInfo exists we are sure its a ATFormChildProps */
            const childProps = foundChildProps as ATFormChildProps

            //if a reverseConvertToKeyValue exists, use it if not just put the value unchanged
            if (targetFormat === 'FormDataKeyValue' && typeInfo.convertToKeyValue)
                result[key] = typeInfo.convertToKeyValue({ event: { target: { value: formData[key]?.value } }, childProps, enums })
            else if (targetFormat === 'FormDataSemiKeyValue' && typeInfo.convertToSemiKeyValue)
                result[key] = typeInfo.convertToSemiKeyValue({ event: { target: { value: formData[key]?.value } }, childProps, enums })
            else {
                result[key] = formData[key]?.value
            }
        }
        else {
            result[key] = formData[key]?.value
        }
    }

    return result;
}

export function getTabVisibilityStyle(isTabSelected: boolean | undefined): React.CSSProperties {
    if (isTabSelected === false) {
        return { display: 'none' };
    }

    // if true or undefined, return empty style (visible)
    return {};
}

export function structureCloneFormData(formData: ATFormFormDataType) {
    return JSON.parse(JSON.stringify(formData))
}

export function generateUUID() {
    // Use native crypto.randomUUID if available
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    // Fallback: pure JS UUID v4 generator
    function fallbackUUIDv4() {
        // Generate 16 random bytes
        const bytes = new Uint8Array(16);
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(bytes);
        } else {
            // If crypto.getRandomValues not available, fallback to Math.random (less secure)
            for (let i = 0; i < 16; i++) {
                bytes[i] = Math.floor(Math.random() * 256);
            }
        }

        // Set version and variant bits according to RFC 4122
        bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
        bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant

        // Convert bytes to hex string
        const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'));

        return (
            hex.slice(0, 4).join('') + '-' +
            hex.slice(4, 6).join('') + '-' +
            hex.slice(6, 8).join('') + '-' +
            hex.slice(8, 10).join('') + '-' +
            hex.slice(10, 16).join('')
        );

    }

    return fallbackUUIDv4();
}