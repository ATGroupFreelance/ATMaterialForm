export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const convertToKeyValue = (formData) => {
    const result = {}

    for (let key in formData) {
        result[key] = formData.value
    }

    return result
}

export const getFlexGrid = (props) => {
    const { xs, md, lg, xl, gridContainer = false, gridSpacing = 0, flexGridProps } = (props || {})
    const newXS = xs === undefined ? 12 : xs
    const newMD = md
    const newLG = lg
    const newXL = xl

    const result = {
        size: {
            xs: newXS,
            md: newMD,
            lg: newLG,
            xl: newXL
        },
        ...(flexGridProps || {}),
    }

    if (gridContainer)
        result.container = gridContainer
    if (gridContainer && gridSpacing)
        result.spacing = gridSpacing

    return result
}

export const isLiteralObject = (a) => {
    return (!!a) && (a.constructor === Object);
};

export const groupKeyValueAsTableData = (formDataKeyValue, groupID, idList) => {
    const result = {}
    const groupedValues = {}

    let counter = 0


    for (let key in formDataKeyValue) {
        const found = idList.find(item => item === key)

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

export const reverseGroupKeyValueAsTableData = (formDataKeyValue, groupID) => {
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
export const isFunction = (obj) => {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

export const convertNoneEnglishNumbers = (str) => {
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

export const getFlatChildren = (children) => {
    let arrayChildren = []
    if (children) {
        if (Array.isArray(children))
            arrayChildren = children
        else
            arrayChildren.push(children)
    }

    return arrayChildren.flat(1)
}