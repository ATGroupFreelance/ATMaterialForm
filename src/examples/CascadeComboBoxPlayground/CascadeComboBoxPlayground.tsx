import ServiceManager from '@/serviceManager/serviceManager';
import ATForm, { formBuilder } from '../../lib/component/ATForm/ATForm';
import useATFormConfig from '@/lib/hooks/useATFormConfig/useATFormConfig';

const CascadeComboBoxPlayground = ({ ref, onChange }: any) => {
    const { enums } = useATFormConfig()

    /**Manual cascade where you define each data and how it must be filtered! */
    const singleLeafCascadeDesign = formBuilder.createCascadeDesign([
        {
            id: 'Country',
            enumKey: 'Countries',
            data: ServiceManager.getCountries,
            children: [
                {
                    id: 'State',
                    enumKey: 'StateAndCapitals',
                    enumParentKey: 'Country',
                    data: ({ keyValue }: any) => new Promise((resolve) => {
                        resolve(enums?.StateAndCapitals.filter((item: any) => !item.ParentID && item.Country === keyValue?.Country))
                    }),
                    children: [
                        {
                            id: 'Capital',
                            enumKey: 'StateAndCapitals',
                            enumParentKey: 'ParentID',
                            data: ({ keyValue }: any) => new Promise((resolve) => {
                                resolve(enums?.StateAndCapitals.filter((item: any) => item.ParentID === keyValue?.State))
                            }),
                        },
                    ]
                },
            ]
        },
    ])

    const singleLeafCascadeDesign2 = formBuilder.createCascadeDesign([
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
    ])


    const singleLeafCascadeDesign3 = formBuilder.createCascadeDesign([
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
    ])


    const singleLeafCascadeDesign4 = formBuilder.createCascadeDesign([
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
    ])

    const singleLeafCascadeDesign5 = formBuilder.createCascadeDesign([
        {
            id: 'business_id',
            children: [
                {
                    id: 'system_id',
                },
            ]
        },
    ])

    return (
        <ATForm ref={ref} onChange={onChange}>
            {
                formBuilder.createColumnBuilder(
                    [
                        formBuilder.createCascadeComboBox({ id: 'CountryA', design: singleLeafCascadeDesign }),
                        formBuilder.createCascadeComboBox({ id: 'CountryB', design: singleLeafCascadeDesign2 }),
                        formBuilder.createCascadeComboBox({ id: 'CountryC', design: singleLeafCascadeDesign3 }),
                        formBuilder.createCascadeComboBox({ id: 'cascadeComboBox1', design: singleLeafCascadeDesign4 }),
                        formBuilder.createCascadeComboBox({ id: 'cascadeComboBox2', design: singleLeafCascadeDesign5 }),
                    ]
                )
                    .build()
            }
        </ATForm>
    )
}

export default CascadeComboBoxPlayground;