import { useCallback, useMemo, useState } from 'react';
//services
import ServiceManager from '@/serviceManager/serviceManager';
import { ATForm, formBuilder, formBuilderUtils } from "@/lib";
import { ExampleComponentInterface } from '@/App';
import useATFormConfig from '@/lib/hooks/useATFormConfig/useATFormConfig';
import { ATFormOnClickProps } from '@/lib/types/Common.type';
import { ATFormCascadeComboBoxDesignLayer } from '@/lib/types/ui/CascadeComboBox.type';

const multiLeafCascadeDesign: ATFormCascadeComboBoxDesignLayer[] = [
    {
        id: 'layerA',
        options: ServiceManager.getData_layerA,
        children: [
            {
                id: 'layerAB',
                options: () => ServiceManager.getData_layerAB(),
                children: [
                    {
                        id: 'layerABC1',
                        options: () => ServiceManager.getData_layerABC1(),
                    },
                ]
            },
        ]
    },
]

const BasicForm = ({ ref, onChange }: ExampleComponentInterface) => {
    console.log('BasicForm', ref)
    const { enums } = useATFormConfig()

    const singleLeafCascadeDesign: ATFormCascadeComboBoxDesignLayer[] = useMemo(() => {
        return [
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
                            resolve(enums?.StateAndCapitals.filter((item) => !item.ParentID && item.Country === keyValue?.Country))
                        }),
                        children: [
                            {
                                id: 'Capital',
                                enumKey: 'StateAndCapitals',
                                enumParentKey: 'ParentID',
                                options: ({ keyValue }: any) => new Promise((resolve) => {
                                    resolve(enums?.StateAndCapitals.filter((item) => item.ParentID === keyValue?.State))
                                }),
                            },
                        ]
                    },
                ]
            },
        ]

    }, [enums?.StateAndCapitals])

    const [hideElements, setHideElements] = useState(false)
    const [A, setA] = useState(0)
    const [B, setB] = useState(0)

    const onSubmitClick = ({ startLoading, stopLoading }: ATFormOnClickProps) => {
        startLoading()
        setTimeout(() => {
            console.log('form submit')
            stopLoading()
        }, 500)
    }

    const onHideSomeElementClick = useCallback(() => {
        setHideElements(!hideElements)
    }, [hideElements])

    const formJSON = useMemo(() => {
        return formBuilderUtils.createColumnBuilder(
            [
                formBuilder.createMultiSelectTextBox({ id: 'MultiSelectTextBox' }),
                formBuilder.createAvatar({ id: 'Avatar1', size: 12 }, { avatarSize: 128 }),
                formBuilder.createTextBox({ id: 'A' }, { onChange: (event) => setA(event.target.value), value: A }),
                formBuilder.createTextBox({ id: 'B' }, { onChange: (event) => setB(event.target.value), value: B }),
                formBuilder.createTextBox({ id: 'A + B', tabIndex: 1 }, { value: Number(A) + Number(B) }),
                formBuilder.createButton({ id: 'Random A' }, { onClick: () => setA(Math.random() * 10) }),
                formBuilder.createLabel({ id: 'Label', label: 'Hi im a label' }),
                formBuilder.createTextBox({ id: 'Name', validation: { required: true } }),
                formBuilder.createPasswordTextBox({ id: 'Password' }),
                formBuilder.createDoublePasswordTextBox({ id: 'DoublePassword', size: 6 }),
                formBuilder.createAvatar({ id: 'Avatar2' }),
                formBuilder.createComboBox({ id: 'Countries', validation: { required: true }, tabIndex: 1 }, { options: ServiceManager.getCountries }),
                formBuilder.createComboBox({ id: 'ComboBoxWithEnumsID', }, { options: ServiceManager.getCountries }),
                formBuilder.createComboBox({ id: 'ComboBoxEnumsless' }, { options: [{ title: 'UK', id: 1 }, { title: 'US', id: 2 }] }),
                formBuilder.createMultiComboBox({ id: 'CountriesIDVALUE', validation: { required: true } }, { options: [{ title: 'UK', id: 1 }, { title: 'US', id: 2 }] }),
                formBuilder.createDatePicker({ id: 'DatePicker', }),
                formBuilder.createUploadButton({ id: 'UploadButtonType1', size: 6 }, { uploadButtonViewType: 1 }),
                formBuilder.createUploadButton({ id: 'UploadButtonType2', size: 6 }, { uploadButtonViewType: 2 }),
                formBuilder.createUploadImageButton({ id: 'UploadImageButton', validation: { required: true } }),
                formBuilder.createCheckBox({ id: 'CheckBox' }),
                ...(
                    !hideElements
                        ?
                        [
                            formBuilder.createSlider({ id: 'Slider' }),
                        ]
                        :
                        []
                ),
                formBuilder.createCascadeComboBox({ id: 'cascadeComboBox', tabIndex: 1 }, { design: singleLeafCascadeDesign }),
                formBuilder.createMultiValueCascadeComboBox({ id: 'MultiValueCascadeComboBox', tabIndex: 1 }, { design: multiLeafCascadeDesign }),
                formBuilder.createAdvanceStepper({ id: 'AdvanceStepper', size: 6 }),
                formBuilder.createGrid({
                    id: 'grid01',
                    size: 12,
                }),
                formBuilder.createButton({ id: 'Hide some elements' }, { onClick: onHideSomeElementClick }),
                formBuilder.createButton({ id: 'Submit Button' }, { onClick: onSubmitClick, inputType: 'submit' }),
                formBuilder.createTextBox({ id: 'Textbox_Text', size: 4 }),
                formBuilder.createIntegerTextBox({ id: 'Textbox_Integer', size: 4 }),
                formBuilder.createFloatTextBox({ id: 'Textbox_Float', size: 4 }),
            ]
        )
            // .filter(item => ['cascadeComboBox'].includes(item.id))
            // .required(['Textbox_Text', 'Textbox_Integer', 'Textbox_Float'])
            .map((item: any) => {
                return {
                    ...item,
                    tabIndex: item.tabIndex === undefined ? 0 : item.tabIndex,
                    // readOnly: true,
                }
            })
            .build()
    }, [A, B, hideElements, onHideSomeElementClick, singleLeafCascadeDesign])

    return (
        <ATForm ref={ref} onChange={onChange} validationDisabled={false}>
            {
                formJSON
            }
        </ATForm>
    )
}

export default BasicForm;