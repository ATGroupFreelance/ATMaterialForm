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
    const { xs, md, lg, xl, gridContainer = false, gridSpacing = 0 } = (props || {})
    const newXS = xs === undefined ? 12 : xs
    const newMD = md
    const newLG = lg
    const newXL = xl

    const result = {
        xs: newXS,
        md: newMD,
        lg: newLG,
        xl: newXL,
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