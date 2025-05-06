import ServiceManager from '@/serviceManager/serviceManager';
import { ATForm, formBuilder, formBuilderUtils } from "@/lib";
import useATFormConfig from '@/lib/hooks/useATFormConfig/useATFormConfig';
import { ExampleComponentInterface } from '@/App';
import { ATFormCascadeComboBoxDesignLayer } from '@/lib/types/ui/CascadeComboBox.type';

const CascadeComboBoxPlayground = ({ ref, onChange }: ExampleComponentInterface) => {
    const { enums } = useATFormConfig()

    /**Manual cascade where you define each data and how it must be filtered! */
    const singleLeafCascadeDesign: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'Country',
            enumKey: 'Countries',
            options: ServiceManager.getCountries,
            children: [
                {
                    id: 'State',
                    enumKey: 'StateAndCapitals',
                    enumParentKey: 'Country',
                    options: ({ keyValue }: any) => new Promise((resolve) => {
                        resolve(enums?.StateAndCapitals.filter((item: any) => !item.ParentID && item.Country === keyValue?.Country))
                    }),
                    children: [
                        {
                            id: 'Capital',
                            enumKey: 'StateAndCapitals',
                            enumParentKey: 'ParentID',
                            options: ({ keyValue }: any) => new Promise((resolve) => {
                                resolve(enums?.StateAndCapitals.filter((item: any) => item.ParentID === keyValue?.State))
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
            enumKey: 'Countries',
            children: [
                {
                    id: 'State',
                    enumKey: 'StateAndCapitals',
                    enumParentKey: 'Country',
                    children: [
                        {
                            id: 'Capital',
                            enumKey: 'StateAndCapitals',
                            enumParentKey: 'ParentID',
                        },
                    ]
                },
            ]
        },
    ]


    const singleLeafCascadeDesign3: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'Country',
            enumKey: 'Countries',
            children: [
                {
                    id: 'State',
                    enumKey: 'StateAndCapitals',
                    children: [
                        {
                            id: 'Capital',
                            enumKey: 'StateAndCapitals',
                            enumParentKey: 'ParentID',
                        },
                    ]
                },
            ]
        },
    ]


    const singleLeafCascadeDesign4: ATFormCascadeComboBoxDesignLayer[] = [
        {
            id: 'business_id',
            enumKey: 'business_id',
            children: [
                {
                    id: 'system_id',
                    enumKey: 'system_id',
                    enumParentKey: 'business_id',
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
                    ]
                )
                    .build()
            }
        </ATForm>
    )
}

export default CascadeComboBoxPlayground;