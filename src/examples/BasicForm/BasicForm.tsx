import { useCallback, useMemo, useState } from 'react';
//services
import ServiceManager from '@/serviceManager/serviceManager';
import { ATForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from '@/App';
import { ATFormOnClickProps } from '@/lib/types/Common.type';

const BasicForm = ({ ref, onChange }: ExampleComponentInterface) => {
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
        return formBuilder.utils.createFieldDefBuilder(
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
                formBuilder.createCascadeComboBox(
                    {
                        id: 'cascadeComboBox',
                        tabPath: 1
                    },
                    {
                        design: [
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
                    }
                ),
                formBuilder.createMultiValueCascadeComboBox(
                    {
                        id: 'MultiValueCascadeComboBox', tabPath: 1
                    },
                    {
                        design: [
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
                                        ]
                                    },
                                ]
                            },
                        ]
                    }
                ),
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
            .buildATForm()
    }, [A, B, hideElements, onHideSomeElementClick])

    return (
        <ATForm ref={ref} onChange={onChange} validationDisabled={false}>
            {
                formJSON
            }
        </ATForm>
    )
}

export default BasicForm;