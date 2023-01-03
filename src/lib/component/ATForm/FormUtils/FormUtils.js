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