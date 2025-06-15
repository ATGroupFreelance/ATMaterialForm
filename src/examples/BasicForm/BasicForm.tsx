import { useCallback, useEffect, useMemo, useState } from 'react';
//services
import ServiceManager from '@/serviceManager/serviceManager';
import { ATForm, formBuilder, formBuilderUtils } from "@/lib";
import { ExampleComponentInterface } from '@/App';
import useATFormConfig from '@/lib/hooks/useATFormConfig/useATFormConfig';
import { ATFormOnClickProps } from '@/lib/types/Common.type';
import { ATFormCascadeComboBoxDesignLayer } from '@/lib/types/ui/CascadeComboBox.type';

const BasicForm = ({ ref, onChange }: ExampleComponentInterface) => {
    const { enums } = useATFormConfig()
    const [optionList, setOptionList] = useState({ layerAOptions: null, layerABOptions: null, layerABC1Options: null })

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

    console.log('multiLeafCascadeDesign', optionList, multiLeafCascadeDesign)

    const singleLeafCascadeDesign: ATFormCascadeComboBoxDesignLayer[] = useMemo(() => {
        return [
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
                            resolve(enums?.StateAndCapitals.filter((item) => !item.ParentID && item.Country === values?.Country))
                        }),
                        children: [
                            {
                                id: 'Capital',
                                enumsKey: 'StateAndCapitals',
                                enumsParentKey: 'ParentID',
                                options: ({ values }: any) => new Promise((resolve) => {
                                    resolve(enums?.StateAndCapitals.filter((item) => item.ParentID === values?.State))
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
                formBuilder.createTextBox({ id: 'A + B', tabPath: 1 }, { value: Number(A) + Number(B) }),
                formBuilder.createButton({ id: 'Random A' }, { onClick: () => setA(Math.random() * 10) }),
                formBuilder.createLabel({ id: 'Label', label: 'Hi im a label' }),
                formBuilder.createTextBox({ id: 'Name', validation: { required: true } }),
                formBuilder.createPasswordTextBox({ id: 'Password' }),
                formBuilder.createDoublePasswordTextBox({ id: 'DoublePassword', size: 6 }),
                formBuilder.createAvatar({ id: 'Avatar2' }),
                formBuilder.createComboBox({ id: 'Countries', validation: { required: true }, tabPath: 1 }, { options: ServiceManager.getCountries, enumsKey: 'Countries' }),
                formBuilder.createComboBox({ id: 'ComboBoxWithEnumsID', }, { options: ServiceManager.getCountries, enumsKey: 'Countries' }),
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
                formBuilder.createCascadeComboBox({ id: 'cascadeComboBox', tabPath: 1 }, { design: singleLeafCascadeDesign }),
                formBuilder.createMultiValueCascadeComboBox({ id: 'MultiValueCascadeComboBox', tabPath: 1 }, { design: multiLeafCascadeDesign }),
                formBuilder.createAdvanceStepper({ id: 'AdvanceStepper', size: 6 }),
                formBuilder.createGrid({
                    id: 'grid01',
                    size: 12,
                }),
                formBuilder.createButton({ id: 'Hide some elements' }, { onClick: onHideSomeElementClick }),
                formBuilder.createButton({ id: 'Submit Button' }, { onClick: onSubmitClick }),
                formBuilder.createTextBox({ id: 'Textbox_Text', size: 4 }),
                formBuilder.createIntegerTextBox({ id: 'Textbox_Integer', size: 4 }),
                formBuilder.createFloatTextBox({ id: 'Textbox_Float', size: 4 }),
            ]
        )
            // .filter(item => ['MultiValueCascadeComboBox'].includes(item.tProps.id))
            // .required(['Textbox_Text', 'Textbox_Integer', 'Textbox_Float'])
            .map((item: any) => {
                return {
                    ...item,
                    tabPath: item.tabPath === undefined ? 0 : item.tabPath,
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