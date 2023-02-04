const create = ({ id, ...restProps }) => {
    return {
        id,
        ...restProps,
    }
}

// export const splitCapitalBySpace = (id) => {
//     return id.match(/[A-Z][a-z]*|[0-9]+/g).join(" ")
// }

// export const splitCapitalBySpace = (id) => {
//     return id.match(/(?:[A-Z]|[a-z])(?:[a-z]+|[A-Z]+)|[0-9]+/g).join(" ")
// }

class ColumnBuilder {
    constructor(columns) {
        this.columns = columns.map((item, index) => {
            return {
                id: item.id,
                label: item.label,
                md: 3,
                ...(item.uiProps ? item.uiProps : item)
            }
        })
    }

    build() {
        return this.columns
    }

    override(columnsOverride) {
        this.columns = this.columns.map(item => {
            const found = columnsOverride[item.id]

            return {
                ...item,
                ...(found || {})
            }
        })

        return this
    }

    overwrite(columnsOverwrite) {
        this.columns = this.columns.map(item => {
            const found = columnsOverwrite[item.id]

            return found ? found : item
        })

        return this
    }

    add(arrayOfObjects) {
        const sortByIndex = arrayOfObjects.sort((a, b) => a.index - b.index)

        sortByIndex.forEach(item => {
            const { index, ...restProps } = item

            if (index === undefined)
                this.columns.push({ ...restProps })
            else
                this.columns.splice(index, 0, { ...restProps })
        })

        return this
    }

    sort(arrayOfID) {
        this.columns.sort((a, b) => {
            const indexA = arrayOfID.indexOf(a.id)
            const indexB = arrayOfID.indexOf(b.id)

            if (indexA !== -1 && indexB !== -1)
                return indexA - indexB
            if (indexA === -1 && indexB !== -1)
                return 1
            else if (indexA !== -1 && indexB === -1)
                return -1
            else if (indexA === -1 && indexB === -1)
                return 0

            return 0
        })

        return this
    }
}

export const createColumnBuilder = (columns) => {
    const columnBuilder = new ColumnBuilder(columns)

    return columnBuilder
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

export const createCheckBox = ({ id, md = 2, ...restProps }) => {
    return create({
        id,
        type: 'CheckBox',
        md,
        labelPlacement: 'end',
        ...restProps,
    })
}

export const createSlider = ({ id, md = 3, ...restProps }) => {
    return create({
        id,
        type: 'Slider',
        md,
        ...restProps,
    })
}

export const createPasswordTextBox = ({ id, md = 3, ...restProps }) => {
    return create({
        id,
        type: 'PasswordTextBox',
        md,
        ...restProps,
    })
}

export const createDoublePasswordTextBox = ({ id, md = 3, ...restProps }) => {
    return create({
        id,
        type: 'DoublePasswordTextBox',
        md,
        ...restProps,
    })
}

export const createAvatar = ({ id, md = 3, size = 42, ...restProps }) => {
    return create({
        id,
        type: 'Avatar',
        md,
        size,
        ...restProps,
    })
}

export const createLabel = ({ id, md = 3, label, ...restProps }) => {
    return create({
        id,
        type: 'Label',
        md,
        label,
        ...restProps,
    })
}

export const createContainerWithTable = ({ id, elements, md = 12, label, addInterface = 'form', addButtonOrigin = 'right', showHeader = true, ...restProps }) => {
    return create({
        id,
        type: 'ContainerWithTable',
        md,
        label,
        addInterface,
        addButtonOrigin,
        showHeader,
        elements,
        ...restProps,
    })
}