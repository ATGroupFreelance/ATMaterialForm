import { ATFieldDefinitionInterface } from "@/lib/types/FieldDefinitionBuilder.type";
import { formBuilder } from "../FormBuilder";

class FieldDefinitionBuilder {
    private fieldDefinitions: ATFieldDefinitionInterface[];

    constructor(fieldDefinitions: ATFieldDefinitionInterface[]) {
        this.fieldDefinitions = fieldDefinitions.map((item: ATFieldDefinitionInterface) => {

            const createFunction = formBuilder[`create${item.tProps.type}` as keyof typeof formBuilder];
            if (typeof createFunction === 'function') {
                return createFunction(item.tProps, item.uiProps as any);
            }

            throw new Error(`Invalid type: ${item.tProps.type}`);
        })
    }

    buildATForm() {
        return this.fieldDefinitions
    }

    override(fieldDefinitionsOverride: Record<string, Partial<ATFieldDefinitionInterface>>): this {
        this.fieldDefinitions = this.fieldDefinitions.map(item => {
            const found = fieldDefinitionsOverride[item.tProps.id]

            if (!found) {
                console.warn('Error in ATForm FieldDefinitionBuilder, can not find a match for', item.tProps.id, item)
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

    overwrite(fieldDefinitionsOverwrite: Record<string, ATFieldDefinitionInterface>): this {
        this.fieldDefinitions = this.fieldDefinitions.map(item => {
            const found = fieldDefinitionsOverwrite[item.tProps.id]

            return found ? found : item
        })

        return this
    }

    add(arrayOfColumns: (ATFieldDefinitionInterface & { index?: number })[]): this {
        const withIndex = arrayOfColumns.filter(item => item.index !== undefined)
        const withoutIndex = arrayOfColumns.filter(item => item.index === undefined)

        withIndex.sort((a, b) => (a.index! - b.index!))

        withIndex.forEach(item => {
            const { index, ...restProps } = item
            this.fieldDefinitions.splice(index!, 0, { ...restProps })
        })

        withoutIndex.forEach(item => {
            const { index, ...restProps } = item
            void index;
            
            this.fieldDefinitions.push({ ...restProps })
        })

        return this
    }

    addIf(condition: boolean, arrayOfObjects: (ATFieldDefinitionInterface & { index?: number })[]): this {
        if (condition) {
            return this.add(arrayOfObjects)
        }
        else
            return this
    }

    sort(arrayOfID: string[]): this {
        this.fieldDefinitions.sort((a, b) => {
            const indexA = arrayOfID.indexOf(a.tProps.id);
            const indexB = arrayOfID.indexOf(b.tProps.id);
            return indexA - indexB;
        });

        return this;
    }

    map(mapFunction: (fieldDefinition: ATFieldDefinitionInterface, index: number, array: ATFieldDefinitionInterface[]) => ATFieldDefinitionInterface): this {
        this.fieldDefinitions = this.fieldDefinitions.map(mapFunction)
        return this
    }

    filter(filterFunction: (fieldDefinition: ATFieldDefinitionInterface, index: number, array: ATFieldDefinitionInterface[]) => boolean): this {
        this.fieldDefinitions = this.fieldDefinitions.filter(filterFunction)
        return this
    }

    remove(arrayOfIDToRemove: string[]): this {
        this.fieldDefinitions = this.fieldDefinitions.filter((item) => !arrayOfIDToRemove.includes(item.tProps.id))
        return this
    }

    /**
     * @example
     * required(['FirstName', 'LastName'])
     * use null to target all the fields
    * @param {arrayOfID} arrayOfID: Array of id [id1, id2]
    */
    required(arrayOfID: string[]) {
        this.fieldDefinitions = this.fieldDefinitions.map(item => {
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

export default FieldDefinitionBuilder;