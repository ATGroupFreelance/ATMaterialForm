import { ATFormBuilerColumnInterface } from "@/lib/types/FormBuilder.type"
import { formBuilder } from "../FormBuilder";

class ColumnBuilder {
    private columns: ATFormBuilerColumnInterface[];

    constructor(columns: ATFormBuilerColumnInterface[]) {
        this.columns = columns.map((item: ATFormBuilerColumnInterface) => {

            const createFunction = formBuilder[`create${item.tProps.type}` as keyof typeof formBuilder];
            if (typeof createFunction === 'function') {
                return createFunction(item.tProps, item.uiProps);
            }

            throw new Error(`Invalid type: ${item.tProps.type}`);
        })
    }

    build() {
        return this.columns
    }

    override(columnsOverride: Record<string, Partial<ATFormBuilerColumnInterface>>): this {
        this.columns = this.columns.map(item => {
            const found = columnsOverride[item.tProps.id]

            if (!found) {
                console.warn('Error in ATForm ColumnBuilder, can not find a match for', item.tProps.id, item)
                return item
            }

            return {
                tProps: {
                    ...item.tProps,
                    ...(found.tProps || {})
                },
                uiProps: (item.uiProps || found.uiProps) ?
                    {
                        ...(item.uiProps || {}),
                        ...(found.uiProps || {})
                    }
                    :
                    {}
            }
        })

        return this
    }

    overwrite(columnsOverwrite: Record<string, ATFormBuilerColumnInterface>): this {
        this.columns = this.columns.map(item => {
            const found = columnsOverwrite[item.tProps.id]

            return found ? found : item
        })

        return this
    }

    add(arrayOfColumns: (ATFormBuilerColumnInterface & { index?: number })[]): this {
        const withIndex = arrayOfColumns.filter(item => item.index !== undefined)
        const withoutIndex = arrayOfColumns.filter(item => item.index === undefined)

        withIndex.sort((a, b) => (a.index! - b.index!))

        withIndex.forEach(item => {
            const { index, ...restProps } = item
            this.columns.splice(index!, 0, { ...restProps })
        })

        withoutIndex.forEach(item => {
            const { index, ...restProps } = item
            this.columns.push({ ...restProps })
        })

        return this
    }

    addIf(condition: boolean, arrayOfObjects: (ATFormBuilerColumnInterface & { index?: number })[]): this {
        if (condition) {
            return this.add(arrayOfObjects)
        }
        else
            return this
    }

    sort(arrayOfID: string[]): this {
        this.columns.sort((a, b) => {
            const indexA = arrayOfID.indexOf(a.tProps.id);
            const indexB = arrayOfID.indexOf(b.tProps.id);
            return indexA - indexB;
        });

        return this;
    }

    map(mapFunction: (column: ATFormBuilerColumnInterface, index: number, array: ATFormBuilerColumnInterface[]) => ATFormBuilerColumnInterface): this {
        this.columns = this.columns.map(mapFunction)
        return this
    }

    filter(filterFunction: (column: ATFormBuilerColumnInterface, index: number, array: ATFormBuilerColumnInterface[]) => boolean): this {
        this.columns = this.columns.filter(filterFunction)
        return this
    }

    remove(arrayOfIDToRemove: string[]): this {
        this.columns = this.columns.filter((item) => !arrayOfIDToRemove.includes(item.tProps.id))
        return this
    }

    /**
     * @example
     * required(['FirstName', 'LastName'])
     * use null to target all the fields
    * @param {arrayOfID} arrayOfID: Array of id [id1, id2]
    */
    required(arrayOfID: string[]) {
        this.columns = this.columns.map(item => {
            const conditionalProps: Record<string, any> = {}

            // Make sure validation is defined
            const validation = item.tProps.validation || {};

            if (!arrayOfID) {
                conditionalProps['validation'] = {
                    ...validation,
                    required: true,
                }
            } else if (Array.isArray(arrayOfID) && arrayOfID.find((id: string) => item.tProps.id === id)) {
                conditionalProps['validation'] = {
                    ...validation,
                    required: true,
                }
            }

            return {
                ...item,
                tProps: {
                    ...item.tProps,
                    ...conditionalProps
                }
            }
        })

        return this
    }
}

export default ColumnBuilder;