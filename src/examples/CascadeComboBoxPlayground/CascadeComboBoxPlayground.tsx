import ServiceManager from '@/serviceManager/serviceManager';
import { ATForm, formBuilder, formBuilderUtils } from "@/lib";
import useATFormConfig from '@/lib/hooks/useATFormConfig/useATFormConfig';
import { ExampleComponentInterface } from '@/App';
import { ATFormCascadeComboBoxDesignLayer } from '@/lib/types/ui/CascadeComboBox.type';

const CascadeComboBoxPlayground = ({ ref, onChange }: ExampleComponentInterface) => {
    const { enums } = useATFormConfig()

    const countryStates = enums?.StateAndCapitals?.filter(item => item.Country)
    const countryCapitals = enums?.StateAndCapitals?.filter(item => !item.Country)

    /**Type 1 : static enums options + custom enumsKeyParentIDField
     * a- You provide an enums key for load or reverseConvertToKeyValue where from a simple id value the form will reach to a full id + title, if u do not provide a 
     *      enumsKey it will defaults to id
     * b- You have to filter each layer's data based on its previous layer manually using a function(): promise or make sure your data containes a field
     *      which determines the parent.
     *      You may use enumsKeyParentIDField which defaults to parent_id to determine what is the name of the field in the option you are providing as parent.\          
     * */
    const singleLeafCascadeDesign1: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'Country',
            enumsKey: 'Countries',
            children: [
                {
                    id: 'State',
                    enumsKey: 'StateAndCapitals',
                    /** The following means inside StateAndCapitals there is a field called "Country" per item*/
                    /** "Country" determines the Country for the current State */
                    /** The value of countryStates[index][enumsKeyParentIDField] is compared to value of the parent of this design layer  */
                    enumsKeyParentIDField: 'Country',
                    options: countryStates,
                    children: [
                        {
                            id: 'Capital',
                            enumsKey: 'StateAndCapitals',
                            /** The following means inside StateAndCapitals there is a field called "ParentID" per item*/
                            /** Parent ID determines the state for the current capital */
                            /** The value of countryStates[index][enumsKeyParentIDField] is compared to value of the parent of this design layer  */
                            enumsKeyParentIDField: 'ParentID',
                            options: countryCapitals
                        },
                    ]
                },
            ]
        },
    ]

    /**Type 2 : static enums options with strict formatting */
    const singleLeafCascadeDesign2: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'Country',
            enumsKey: 'Countries',
            children: [
                {
                    id: 'State',
                    enumsKey: 'StrictFormatState',
                    children: [
                        {
                            id: 'Capital',
                            enumsKey: 'StrictFormatCapital',
                        },
                    ]
                },
            ]
        },
    ]

    /**Type 3 : async options with strict formatting */
    const singleLeafCascadeDesign3: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'Country',
            enumsKey: 'Countries',
            options: ServiceManager.getCountries,
            children: [
                {
                    id: 'State',
                    enumsKey: 'StrictFormatState',
                    options: ServiceManager.getStrictFormatState,
                    children: [
                        {
                            id: 'Capital',
                            enumsKey: 'StrictFormatCapital',
                            options: ServiceManager.getStrictFormatCapital,
                        },
                    ]
                },
            ]
        },
    ]

    /**Type 4 : async options with custom filter */
    const singleLeafCascadeDesign4: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'Country',
            enumsKey: 'Countries',
            options: ServiceManager.getCountries,
            children: [
                {
                    id: 'State',
                    enumsKey: 'StrictFormatState',
                    options: ServiceManager.getStrictFormatState,
                    filterOptions: (params) => params.option.parent_id === params.values?.Country,
                    children: [
                        {
                            id: 'Capital',
                            enumsKey: 'StrictFormatCapital',
                            options: ServiceManager.getStrictFormatCapital,
                            filterOptions: (params) => params.option.parent_id === params.values?.State,
                        },
                    ]
                },
            ]
        },
    ]

    /**Type 5  Static options without strict formatting*/
    const singleLeafCascadeDesign5: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'business_id',
            enumsKey: 'business_id',
            children: [
                {
                    id: 'system_id',
                    enumsKey: 'system_id',
                    enumsKeyParentIDField: 'business_id',
                },
            ]
        },
    ]

    /**Type 6  Ultra simple Static options*/
    const singleLeafCascadeDesign6: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'business_id',
            children: [
                {
                    id: 'system_id',
                    enumsKeyParentIDField: 'business_id',
                },
            ]
        },
    ]

    //Type 7 Multi leaf, custom async options based on values
    const multiLeafCascadeDesign: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'layerA',
            options: ServiceManager.getData_layerA,
            children: [
                {
                    id: 'layerAB',
                    options: ({ values }) => ServiceManager.getData_layerAB({ layerA: values?.layerA }),
                    enumsKeyParentIDField: 'layerA',
                    children: [
                        {
                            id: 'layerABC1',
                            options: ({ values }) => ServiceManager.getData_layerABC1({ layerA: values?.layerA, layerAB: values?.layerAB }),
                            enumsKeyParentIDField: 'layerAB',
                        },
                        {
                            id: 'layerABC2',
                            options: ({ values }) => ServiceManager.getData_layerABC2({ layerA: values?.layerA, layerAB: values?.layerAB }),
                            enumsKeyParentIDField: 'layerAB',
                        },
                    ]
                },
            ]
        },
    ]

    return (
        <ATForm ref={ref} onChange={onChange}>
            {
                formBuilderUtils.createFieldDefinitionBuilder(
                    [
                        formBuilder.createCascadeComboBox({ id: 'Type 1 Country' }, { design: singleLeafCascadeDesign1 }),
                        formBuilder.createCascadeComboBox({ id: 'Type 2 Country' }, { design: singleLeafCascadeDesign2 }),
                        formBuilder.createCascadeComboBox({ id: 'Type 3 Country' }, { design: singleLeafCascadeDesign3 }),
                        formBuilder.createCascadeComboBox({ id: 'Type 4 Country' }, { design: singleLeafCascadeDesign4 }),
                        formBuilder.createCascadeComboBox({ id: 'Type 5 Business' }, { design: singleLeafCascadeDesign5 }),
                        formBuilder.createCascadeComboBox({ id: 'Type 6 Business' }, { design: singleLeafCascadeDesign6 }),
                        formBuilder.createMultiValueCascadeComboBox({ id: 'Type 7 Multi leaf' }, { design: multiLeafCascadeDesign }),
                    ]
                )
                    .buildATForm()
            }
        </ATForm>
    )
}

export default CascadeComboBoxPlayground;