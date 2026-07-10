import { AtFieldDefInterface } from "../../../../types/FieldDefBuilder.type";
import { formBuilder } from "../FormBuilder";
import { AtFormFieldDefInterface } from "../../../../types/AtForm.type";

const createFunction = (key: string) => {
    if (key === 'utils') return undefined;
    const fn = formBuilder[key as keyof typeof formBuilder];
    return typeof fn === 'function' ? fn : undefined;
}

const isAtFormFieldDefs = (fieldDefs: AtFieldDefInterface[] | AtFormFieldDefInterface[]): fieldDefs is AtFormFieldDefInterface[] => {
    return (
        Array.isArray(fieldDefs) &&
        fieldDefs.length > 0 &&
        !('id' in fieldDefs[0])
    );
};

class FieldDefBuilder {
    private fieldDefs: AtFieldDefInterface[];

    constructor(fieldDefs: AtFieldDefInterface[] | AtFormFieldDefInterface[]) {
        if (isAtFormFieldDefs(fieldDefs)) {
            this.fieldDefs = fieldDefs.map(item => {
                return {
                    ...item,
                    id: item.tProps.id,
                }
            });
        }
        else {
            this.fieldDefs = [
                ...fieldDefs
            ]
        }
    }

    buildAtForm() {
        return this.fieldDefs.map(item => {
            const key = `create${item.tProps.type}`;
            const createFn = createFunction(key);

            if (!createFn) {
                console.warn(`Can not find a create function for type: ${item.tProps.type}`)
                return item
            }

            // Special-cases where it does not use two arg factory, The following expects (component, tProps, uiProps?)
            if (item.tProps.type === 'CustomControlledField' || item.tProps.type === 'CustomUncontrolledField') {
                const { component, ...uiWithoutComponent } = item.uiProps;

                const typedCreateFn = createFn as (
                    component: React.ComponentType<any>,
                    tProps: typeof item.tProps,
                    uiProps?: typeof uiWithoutComponent,
                ) => any;

                return typedCreateFn(component, { id: item.id, ...item.tProps }, uiWithoutComponent);
            }

            // Default: two-arg factories
            const typedTwoArg = createFn as (tProps: typeof item.tProps, uiProps?: any) => any;

            return typedTwoArg({ id: item.id, ...item.tProps }, item.uiProps as any);
        })
    }

    buildColumnDefs() {
        return this.fieldDefs.map(item => {
            return {
                field: item.id,
            }
        })
    }

    override(fieldDefsOverride: Record<string, Partial<AtFieldDefInterface>>): this {
        this.fieldDefs = this.fieldDefs.map(item => {
            const found = fieldDefsOverride[item.id]

            if (!found) {
                console.warn('Error in ATForm FieldDefBuilder, can not find a match for', item.id, item)
                return item
            }

            return {
                ...item,
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

    overwrite(fieldDefsOverwrite: Record<string, AtFieldDefInterface>): this {
        this.fieldDefs = this.fieldDefs.map(item => {
            const found = fieldDefsOverwrite[item.id]

            return found ? found : item
        })

        return this
    }

    add(arrayOfColumns: (AtFieldDefInterface & { index?: number })[]): this {
        const withIndex = arrayOfColumns.filter(item => item.index !== undefined)
        const withoutIndex = arrayOfColumns.filter(item => item.index === undefined)

        withIndex.sort((a, b) => (a.index! - b.index!))

        withIndex.forEach(item => {
            const { index, ...restProps } = item
            this.fieldDefs.splice(index!, 0, { ...restProps })
        })

        withoutIndex.forEach(item => {
            const { index, ...restProps } = item
            void index;

            this.fieldDefs.push({ ...restProps })
        })

        return this
    }

    addIf(condition: boolean, arrayOfObjects: (AtFieldDefInterface & { index?: number })[]): this {
        if (condition) {
            return this.add(arrayOfObjects)
        }
        else
            return this
    }

    sort(arrayOfId: string[]): this {
        this.fieldDefs.sort((a, b) => {
            const indexA = arrayOfId.indexOf(a.id);
            const indexB = arrayOfId.indexOf(b.id);
            return indexA - indexB;
        });

        return this;
    }

    map(mapFunction: (fieldDef: AtFieldDefInterface, index: number, array: AtFieldDefInterface[]) => AtFieldDefInterface): this {
        this.fieldDefs = this.fieldDefs.map(mapFunction)
        return this
    }

    filter(filterFunction: (fieldDef: AtFieldDefInterface, index: number, array: AtFieldDefInterface[]) => boolean): this {
        this.fieldDefs = this.fieldDefs.filter(filterFunction)
        return this
    }

    remove(arrayOfIdToRemove: string[]): this {
        this.fieldDefs = this.fieldDefs.filter((item) => !arrayOfIdToRemove.includes(item.id))
        return this
    }

    /**
     * @example
     * required(['FirstName', 'LastName'])
     * use null to target all the fields
    * @param {arrayOfID} arrayOfID: Array of id [id1, id2]
    */
    required(arrayOfId: string[]) {
        this.fieldDefs = this.fieldDefs.map(item => {
            const conditionalProps: Record<string, any> = {}

            // Make sure validation is defined
            const validation = item.tProps.validation || {};

            if (!arrayOfId) {
                conditionalProps['validation'] = {
                    ...validation,
                    required: true,
                }
            } else if (Array.isArray(arrayOfId) && arrayOfId.find((id: string) => item.tProps.id === id)) {
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

export default FieldDefBuilder;