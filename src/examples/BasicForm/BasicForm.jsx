import React, { useContext, useState } from 'react';
import ATForm, { formBuilder } from '../../lib/component/ATForm/ATForm';
//services
import ServiceManager from '@/serviceManager/serviceManager';
import ATFormContext from '@/lib/component/ATForm/ATFormContext/ATFormContext';

const multiLeafCascadeDesign = [
    {
        id: 'layerA',
        data: ServiceManager.getData_layerA,
        children: [
            {
                id: 'layerAB',
                data: ServiceManager.getData_layerAB,
                children: [
                    {
                        id: 'layerABC1',
                        data: ServiceManager.getData_layerABC1,
                    },
                ]
            },
        ]
    },
]

const BasicForm = ({ ref, onChange }) => {
    console.log('BasicForm', ref)
    const { enums } = useContext(ATFormContext)

    const singleLeafCascadeDesign = [
        {
            id: 'Country',
            enumKey: 'Countries',
            data: ServiceManager.getCountries,
            children: [
                {
                    id: 'State',
                    enumKey: 'StateAndCapitals',
                    enumParentKey: 'Country',
                    data: ({ keyValue }) => new Promise((resolve) => {
                        resolve(enums?.StateAndCapitals.filter((item) => !item.ParentID && item.Country === keyValue?.Country))
                    }),
                    children: [
                        {
                            id: 'Capital',
                            enumKey: 'StateAndCapitals',
                            enumParentKey: 'ParentID',
                            data: ({ keyValue }) => new Promise((resolve) => {
                                resolve(enums?.StateAndCapitals.filter((item) => item.ParentID === keyValue?.State))
                            }),
                        },
                    ]
                },
            ]
        },
    ]

    const [hideElements, setHideElements] = useState(false)
    const [A, setA] = useState(0)
    const [B, setB] = useState(0)

    const onSubmitClick = (event, { startLoading, stopLoading }) => {
        startLoading()
        setTimeout(() => {
            console.log('form submit')
            stopLoading()
        }, 500)
    }

    const onHideSmoeElementsClick = (event, { startLoading, stopLoading }) => {
        setHideElements(!hideElements)
    }

    return (
        <ATForm ref={ref} onChange={onChange} validationDisabled={false}>
            {
                formBuilder.createColumnBuilder(
                    [
                        formBuilder.createMultiSelectTextBox({ id: 'MultiSelectTextBox' }),
                        formBuilder.createAvatar({ id: 'Avatar1', size: 12, avatarSize: 128 }),
                        formBuilder.createTextBox({ id: 'A', onChange: (event) => setA(event.target.value), value: A }),
                        formBuilder.createTextBox({ id: 'B', onChange: (event) => setB(event.target.value), value: B }),
                        formBuilder.createTextBox({ id: 'A + B', value: Number(A) + Number(B), tabIndex: 1 }),
                        formBuilder.createButton({ id: 'Random A', onClick: () => setA(Math.random() * 10) }),
                        formBuilder.createLabel({ id: 'Label', label: 'Hi im a label' }),
                        formBuilder.createTextBox({ id: 'Name', validation: { required: true } }),
                        formBuilder.createPasswordTextBox({ id: 'Password' }),
                        formBuilder.createDoublePasswordTextBox({ id: 'DoublePassword', size: 6 }),
                        formBuilder.createAvatar({ id: 'Avatar2' }),
                        formBuilder.createComboBox({ id: 'Countries', options: ServiceManager.getCountries, validation: { required: true }, tabIndex: 1 }),
                        formBuilder.createComboBox({ id: 'ComboBoxWithEnumsID', enumsID: 'Countries', options: ServiceManager.getCountries }),
                        formBuilder.createComboBox({ id: 'ComboBoxEnumsless', options: [{ title: 'UK', id: 1 }, { title: 'US', id: 2 }] }),
                        formBuilder.createMultiComboBox({ id: 'CountriesIDVALUE', options: [{ title: 'UK', id: 1 }, { title: 'US', id: 2 }], validation: { required: true } }),
                        formBuilder.createDatePicker({ id: 'DatePicker', }),
                        formBuilder.createUploadButton({ id: 'UploadButtonType1', size: 6, uploadButtonViewType: 1 }),
                        formBuilder.createUploadButton({ id: 'UploadButtonType2', size: 6, uploadButtonViewType: 2 }),
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
                        formBuilder.createCascadeComboBox({ id: 'cascadeComboBox', design: singleLeafCascadeDesign, tabIndex: 1 }),
                        formBuilder.createMultiValueCascadeComboBox({ id: 'MultiValueCascadeComboBox', design: multiLeafCascadeDesign, tabIndex: 1 }),
                        formBuilder.createAdvanceStepper({ id: 'AdvanceStepper', size: 6 }),
                        formBuilder.createGrid({
                            id: 'grid01',
                            size: 12,
                        }),
                        formBuilder.createButton({ id: 'Hide some elements', onClick: onHideSmoeElementsClick }),
                        formBuilder.createButton({ id: 'Submit Button', onClick: onSubmitClick, inputType: 'submit' }),
                        formBuilder.createTextBox({ id: 'Textbox_Text', size: 4 }),
                        formBuilder.createIntegerTextBox({ id: 'Textbox_Integer', size: 4 }),
                        formBuilder.createFloatTextBox({ id: 'Textbox_Float', size: 4 }),
                    ]
                )
                    // .filter(item => ['cascadeComboBox'].includes(item.id))
                    // .required(['Textbox_Text', 'Textbox_Integer', 'Textbox_Float'])
                    .map(item => {
                        return {
                            ...item,
                            tabIndex: item.tabIndex === undefined ? 0 : item.tabIndex,
                            // readOnly: true,
                        }
                    })
                    .build()
            }
        </ATForm>
    )
}

export default BasicForm;