const create = ({ id, label, ...restProps }) => {
    const newLabel = label === undefined ? id : label

    return {
        id,
        label: newLabel,
        ...restProps,
    }
}

export const createTextBox = ({ id, md = 3, ...restProps }) => {
    return create({
        id,
        type: 'TextBox',
        md,
        ...restProps,
    })
}

export const createButton = ({ id, md = 2, onClick, ...restProps }) => {
    return create({
        id,
        type: 'Button',
        md,
        onClick,
        ...restProps,
    })
}

export const createComboBox = ({ id, options, md = 3, ...restProps }) => {
    return create({
        id,
        type: 'ComboBox',
        md,
        options: options,
        ...restProps,
    })
}

export const createMultiComboBox = ({ id, options, md = 3, ...restProps }) => {
    return create({
        id,
        type: 'MultiComboBox',
        md,
        options: options,
        ...restProps,
    })
}

export const createDatePicker = ({ id, md = 3, ...restProps }) => {
    return create({
        id,
        type: 'DatePicker',
        md,
        ...restProps,
    })
}

export const createUploadButton = ({ id, md = 3, ...restProps }) => {
    return create({
        id,
        type: 'UploadButton',
        md,
        ...restProps,
    })
}

export const createCascadeComboBox = ({ id, md = 12, ...restProps }) => {
    return create({
        id,
        type: 'CascadeComboBox',
        md: md,
        gridContainer: true,
        gridSpacing: 2,
        ...restProps,
    })
}

export const createGrid = ({ id, container, spacing, ...restProps }) => {
    return create({
        id,
        type: 'Grid',
        skipRender: true,
        gridSpacing: container,
        gridContainer: container,
        ...restProps,
    })
}

export const createCheckBox = ({ id, md = 3, ...restProps }) => {
    return create({
        id,
        type: 'CheckBox',
        md,
        labelPlacement: 'end',
        ...restProps,
    })
}