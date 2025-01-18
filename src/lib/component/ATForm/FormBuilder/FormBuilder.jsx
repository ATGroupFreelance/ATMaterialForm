export const create = ({ id, ...restProps }) => {
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
                size: 3,
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

export const createTextBox = ({ id, size = 3, ...restProps }) => {
    return create({
        id,
        type: 'TextBox',
        size,
        ...restProps,
    })
}

export const createIntegerTextBox = ({ id, size = 3, ...restProps }) => {
    return create({
        id,
        type: 'IntegerTextBox',
        size,
        ...restProps,
    })
}

export const createFloatTextBox = ({ id, size = 3, ...restProps }) => {
    return create({
        id,
        type: 'FloatTextBox',
        size,
        ...restProps,
    })
}

export const createButton = ({ id, size = 2, onClick, ...restProps }) => {
    return create({
        id,
        type: 'Button',
        size,
        onClick,
        ...restProps,
    })
}

export const createComboBox = ({ id, options, size = 3, ...restProps }) => {
    return create({
        id,
        type: 'ComboBox',
        size,
        options: options,
        ...restProps,
    })
}

export const createMultiComboBox = ({ id, options, size = 3, ...restProps }) => {
    return create({
        id,
        type: 'MultiComboBox',
        size,
        options: options,
        ...restProps,
    })
}

export const createDatePicker = ({ id, size = 3, ...restProps }) => {
    return create({
        id,
        type: 'DatePicker',
        size,
        ...restProps,
    })
}

/**
 * @example
 * formBuilder.createUploadButton({ id: 'UploadButtonType1', size: 6, uploadButtonViewType: 1 }),
   formBuilder.createUploadButton({ id: 'UploadButtonType2', size: 6, uploadButtonViewType: 2 }),
 * @param {uploadButtonViewType} uploadButtonViewType: This button has 2 views, you can switch between them by passing a viewType number, the acceptable values are 1 and 2
 */

export const createUploadButton = ({ id, size = 3, uploadButtonViewType = 2, ...restProps }) => {
    return create({
        id,
        type: 'UploadButton',
        uploadButtonViewType,
        size,
        ...restProps,
    })
}

export const createUploadImageButton = ({ id, size = 3, ...restProps }) => {
    return create({
        id,
        type: 'UploadImageButton',
        size,
        ...restProps,
    })
}

export const createFileViewer = ({ id, size = 12, fileWidth = 150, fileHeight = 128, ...restProps }) => {
    return create({
        id,
        type: 'FileViewer',
        size,
        fileWidth,
        fileHeight,
        ...restProps,
    })
}

export const createCascadeDesign = (nodes, parentKey = null) => {
    return nodes.map(({ id, enumKey, enumParentKey, children, ...restProps }) => {

        const newNode = {
            id: id,
            enumKey: enumKey || id,
            enumParentKey: enumParentKey || parentKey,
            children: children ?
                createCascadeDesign(children, id)
                :
                undefined,
            ...restProps,
        }

        return newNode;
    });
};

export const createCascadeComboBox = ({ id, size = 12, design, wrapperRendererProps = {}, ...restProps }) => {
    return create({
        id,
        type: 'CascadeComboBox',
        size,
        design,
        wrapperRendererProps: {
            container: true,
            spacing: 2,
            ...wrapperRendererProps,
        },
        ...restProps,
    })
}

export const createMultiValueCascadeComboBox = ({ id, size = 12, wrapperRendererProps = {}, ...restProps }) => {
    return create({
        id,
        type: 'MultiValueCascadeComboBox',
        size,
        wrapperRendererProps: {
            container: true,
            spacing: 2,
            ...wrapperRendererProps,
        },
        ...restProps,
    })
}

export const createGrid = ({ id, size, container, spacing, wrapperRendererProps = {}, ...restProps }) => {
    return create({
        id,
        type: 'Grid',
        skipRender: true,
        size,
        wrapperRendererProps: {
            container,
            spacing,
            ...wrapperRendererProps
        },
        ...restProps,
    })
}

export const createCheckBox = ({ id, size = 2, ...restProps }) => {
    return create({
        id,
        type: 'CheckBox',
        size,
        labelPlacement: 'end',
        ...restProps,
    })
}

export const createSlider = ({ id, size = 3, ...restProps }) => {
    return create({
        id,
        type: 'Slider',
        size,
        ...restProps,
    })
}

export const createPasswordTextBox = ({ id, size = 3, ...restProps }) => {
    return create({
        id,
        type: 'PasswordTextBox',
        size,
        ...restProps,
    })
}

export const createDoublePasswordTextBox = ({ id, size = 3, ...restProps }) => {
    return create({
        id,
        type: 'DoublePasswordTextBox',
        size,
        ...restProps,
    })
}

export const createAvatar = ({ id, size = 3, avatarSize = 42, ...restProps }) => {
    return create({
        id,
        type: 'Avatar',
        size,
        avatarSize,
        ...restProps,
    })
}

export const createLabel = ({ id, size = 3, label, ...restProps }) => {
    return create({
        id,
        type: 'Label',
        size,
        label,
        ...restProps,
    })
}
export const createContainerWithTable = ({ id, elements, size = 12, label, addInterface = 'form', addButtonOrigin = 'right', showHeader = true, editOnly = false, resetFormAfterAdd = false, ...restProps }) => {
    return create({
        id,
        type: 'ContainerWithTable',
        size,
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

export const createMultiSelectTextBox = ({ id, size = 3, label, ...restProps }) => {
    return create({
        id,
        type: 'MultiSelectTextBox',
        size,
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
  * @param {id, size = 12, data, columns = null, label = null, cellStyle = null, labelStyle = null, columnCellStyle = null, hideColumns = false}
 */
export const createTable = ({ id, size = 12, data, columns = null, label = null, cellStyle = null, labelStyle = null, columnCellStyle = null, hideColumns = false }) => {
    return create({
        id,
        type: 'Table',
        size,
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
export const createMultiSelectGrid = ({ id, size = 12, label, columnDefs, rowData, uniqueKey = undefined, onConfirmButtonClick = undefined, ...restProps }) => {
    return create({
        id,
        type: 'MultiSelectGrid',
        size,
        label,
        columnDefs,
        rowData,
        uniqueKey,
        onConfirmButtonClick,
        ...restProps,
    })
}

export const createImageSelect = ({ id, size = 12, label, imageWidth, imageHeight, multiple = false, ...restProps }) => {
    return create({
        id,
        type: 'ImageSelect',
        size,
        label,
        imageWidth,
        imageHeight,
        multiple,
        ...restProps,
    })
}

export const createAdvanceStepper = ({ id, size = 12, ...restProps }) => {
    return create({
        id,
        type: 'AdvanceStepper',
        size,
        ...restProps,
    })
}

export const createForm = ({ id, elements, size = 12, ...restProps }) => {
    return create({
        id,
        type: 'Form',
        size,
        elements,
        ...restProps,
    })
}

export const createColorTextBox = ({ id, size = 3, ...restProps }) => {
    return create({
        id,
        type: 'ColorTextBox',
        size,
        ...restProps,
    })
}

export const createColumnDefsByRowData = (rowData) => {
    const result = []

    if (rowData && Array.isArray(rowData) && rowData.length > 0) {
        const firstSlot = rowData[0]

        for (let key in firstSlot) {
            result.push({
                field: key,
            })
        }
    }

    return result
}

export const createForsizeata = (data) => {
    return {
        formData: {
            ...(data || {}),
        },
        formDataKeyValue: {
            ...(data || {}),
        },
        formDataSemiKeyValue: {
            ...(data || {}),
        },
    }
}