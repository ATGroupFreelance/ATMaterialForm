const create = ({ id, ...restProps }) => {
    return {
        id,
        ...restProps,
    }
}

export const splitCapitalBySpace = (input) => {
    const result = input.replace(/([A-Z]+)/g, ",$1").replace(/^,/, "");
    return result.split(",").join(' ');
}

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

    map(mapFunction) {
        this.columns = this.columns.map(mapFunction)

        return this
    }

    filter(filterFunction) {
        this.columns = this.columns.filter(filterFunction)

        return this
    }

    remove(arrayOfIDToRemove) {
        this.columns = this.columns.filter((item) => !arrayOfIDToRemove.includes(item.id))

        return this
    }

    /**
     * @example
     * required(['FirstName', 'LastName'])
     * use null to target all the fields
    * @param {idList} idList: Array of id [id1, id2]
    */
    required(idList) {
        this.columns = this.columns.map(item => {
            const conditionalProps = {}

            if (item.validation) {
                conditionalProps['validation'] = {
                    ...item.validation,
                }
            }
            else {
                conditionalProps['validation'] = {}
            }

            if (!idList)
                conditionalProps['validation']['required'] = true
            else if (Array.isArray(idList) && idList.find(id => item.id === id))
                conditionalProps['validation']['required'] = true

            return {
                ...item,
                ...conditionalProps
            }
        })

        return this
    }
}

/**
 * @example
 * formBuilder
    .createColumnBuilder(Columns)
    .remove(['B'])    
    .override(
        {
            A: { onChange: (event) => setA(event.target.value) },            
        }
    )
    .build()
 * @param {columns} columns: Array of {id, label, gridProps, uiProps}
 */
export const createColumnBuilder = (columns) => {
    const columnBuilder = new ColumnBuilder(columns)

    return columnBuilder
}

export const createColumn = ({ id, label, uiProps, gridProps }) => {
    return {
        id,
        label,
        uiProps,
        gridProps
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

export const createUploadImageButton = ({ id, md = 3, ...restProps }) => {
    return create({
        id,
        type: 'UploadImageButton',
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

export const createMultiValueCascadeComboBox = ({ id, md = 12, ...restProps }) => {
    return create({
        id,
        type: 'MultiValueCascadeComboBox',
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
export const createContainerWithTable = ({ id, elements, md = 12, label, addInterface = 'form', addButtonOrigin = 'right', showHeader = true, editOnly = false, resetFormAfterAdd = false, ...restProps }) => {
    return create({
        id,
        type: 'ContainerWithTable',
        md,
        label,
        //How are the fields and elements added to the table, a "form" at the top or by "formDialog" which opens a dialog by clicking on add?
        addInterface,
        addButtonOrigin,
        showHeader,
        //It will remove add button and only allows edit and remove, this is used if you want to load a data inside a table and edit it or maybe even add to it!
        editOnly,
        //This is the children of containerWithTable which is shown inside the add interface, you can use formBuilder to create these elements
        elements,
        //reset the add panel after add is done
        resetFormAfterAdd,
        ...restProps,
    })
}

export const createConditionalInsert = ({ condition, elements }) => {
    if (!condition)
        return []
    else
        return elements
}

export const createMultiSelectTextBox = ({ id, md = 3, label, ...restProps }) => {
    return create({
        id,
        type: 'MultiSelectTextBox',
        md,
        label,
        ...restProps,
    })
}

/**
 * @example
    //You only need to supply the data for the table to show.
    const data = [{a: 10, b: 20}]
    //If you don't supply the columns which is any array of texts, it will use the first object of data to create it.
    const columns = ['a', 'b']
    //You can style the each cell of the columns using "columnCellStyle"
    //You can style the each cell of the row using "cellStyle"
    //You can style the label or title using "labelStyle"
    //Use this component only for showing simple data in a tablur manner and nothing more.
  * @param {id, md = 12, data, columns = null, label = null, cellStyle = null, labelStyle = null, columnCellStyle = null, hideColumns = false}
 */
export const createTable = ({ id, md = 12, data, columns = null, label = null, cellStyle = null, labelStyle = null, columnCellStyle = null, hideColumns = false }) => {
    return create({
        id,
        type: 'Table',
        md,
        data,
        columns,
        label,
        cellStyle,
        labelStyle,
        columnCellStyle,
        hideColumns
    })
}

/**
 * @example
    This is a multi select grid, it can have label or not, it can also have a confirm changes button if you pass onConfirmButtonClick
    If you don't it will change live and updates the form
    You can provide a confirmButtonProps to customize the confirm button
    If you don't provide a uniqueKey it will simply return the index of selected row which is not always reliable
    If you do provide a unique key it will use this key to pick up the value of a row as the unique key, for example uniqueKey="ID"
    Please note you can provide any AgGrid props you like here
  * @param {columnDefs, rowData, uniqueKey = undefined, onConfirmButtonClick = undefined}
 */
export const createMultiSelectGrid = ({ id, md = 12, label, columnDefs, rowData, uniqueKey = undefined, onConfirmButtonClick = undefined, ...restProps }) => {
    return create({
        id,
        type: 'MultiSelectGrid',
        md,
        label,
        columnDefs,
        rowData,
        uniqueKey,
        onConfirmButtonClick,
        ...restProps,
    })
}