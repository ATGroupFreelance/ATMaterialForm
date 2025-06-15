import ServiceManager from '@/serviceManager/serviceManager';
import { ATForm, formBuilder, formBuilderUtils } from "@/lib";
import useATFormConfig from '@/lib/hooks/useATFormConfig/useATFormConfig';
import { ExampleComponentInterface } from '@/App';
import { ATFormCascadeComboBoxDesignLayer } from '@/lib/types/ui/CascadeComboBox.type';
import { useEffect, useState } from 'react';

const CascadeComboBoxPlayground = ({ ref, onChange }: ExampleComponentInterface) => {
    const { enums } = useATFormConfig()
    const [optionList, setOptionList] = useState({ layerAOptions: null, layerABOptions: null, layerABC1Options: null })
    console.log('enums', enums)

    useEffect(() => {
        const updateOptionList = async () => {
            const layerAOptions = await ServiceManager.getData_layerA()
            const layerABOptions = await ServiceManager.getData_layerAB({ layerA: "A1_2" })
            const layerABC1Options = await ServiceManager.getData_layerABC1({ layerA: "A1_2", layerAB: "A1_2_AB1_1" })

            setOptionList({
                layerAOptions,
                layerABOptions,
                layerABC1Options
            })
        }

        updateOptionList()
    }, [])

    /**Manual cascade where you define each data and how it must be filtered! */
    const singleLeafCascadeDesign: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'Country',
            enumsKey: 'Countries',
            options: ServiceManager.getCountries,
            children: [
                {
                    id: 'State',
                    enumsKey: 'StateAndCapitals',
                    enumsParentKey: 'Country',
                    options: ({ values }: any) => new Promise((resolve) => {
                        resolve(enums?.StateAndCapitals.filter((item: any) => !item.ParentID && item.Country === values?.Country))
                    }),
                    children: [
                        {
                            id: 'Capital',
                            enumsKey: 'StateAndCapitals',
                            enumsParentKey: 'ParentID',
                            options: ({ values }: any) => new Promise((resolve) => {
                                resolve(enums?.StateAndCapitals.filter((item: any) => item.ParentID === values?.State))
                            }),
                        },
                    ]
                },
            ]
        },
    ]

    const singleLeafCascadeDesign2: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'Country',
            enumsKey: 'Countries',
            children: [
                {
                    id: 'State',
                    enumsKey: 'StateAndCapitals',
                    enumsParentKey: 'Country',
                    children: [
                        {
                            id: 'Capital',
                            enumsKey: 'StateAndCapitals',
                            enumsParentKey: 'ParentID',
                        },
                    ]
                },
            ]
        },
    ]


    const singleLeafCascadeDesign3: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'Country',
            enumsKey: 'Countries',
            children: [
                {
                    id: 'State',
                    enumsKey: 'StateAndCapitals',
                    children: [
                        {
                            id: 'Capital',
                            enumsKey: 'StateAndCapitals',
                            enumsParentKey: 'ParentID',
                        },
                    ]
                },
            ]
        },
    ]


    const singleLeafCascadeDesign4: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'business_id',
            enumsKey: 'business_id',
            children: [
                {
                    id: 'system_id',
                    enumsKey: 'system_id',
                    enumsParentKey: 'business_id',
                },
            ]
        },
    ]

    const singleLeafCascadeDesign5: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'business_id',
            children: [
                {
                    id: 'system_id',
                },
            ]
        },
    ]

    const multiLeafCascadeDesign: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'layerA',
            options: optionList?.layerAOptions,
            children: [
                {
                    id: 'layerAB',
                    options: optionList?.layerABOptions,
                    children: [
                        {
                            id: 'layerABC1',
                            options: optionList?.layerABC1Options,
                        },
                    ]
                },
            ]
        },
    ]

    return (
        <ATForm ref={ref} onChange={onChange}>
            {
                formBuilderUtils.createColumnBuilder(
                    [
                        formBuilder.createCascadeComboBox({ id: 'CountryA' }, { design: singleLeafCascadeDesign }),
                        formBuilder.createCascadeComboBox({ id: 'CountryB' }, { design: singleLeafCascadeDesign2 }),
                        formBuilder.createCascadeComboBox({ id: 'CountryC' }, { design: singleLeafCascadeDesign3 }),
                        formBuilder.createCascadeComboBox({ id: 'cascadeComboBox1' }, { design: singleLeafCascadeDesign4 }),
                        formBuilder.createCascadeComboBox({ id: 'cascadeComboBox2' }, { design: singleLeafCascadeDesign5 }),
                        formBuilder.createMultiValueCascadeComboBox({ id: 'MultiValueCascadeComboBox' }, { design: multiLeafCascadeDesign }),
                    ]
                )
                    .build()
            }
        </ATForm>
    )
}

export default CascadeComboBoxPlayground;