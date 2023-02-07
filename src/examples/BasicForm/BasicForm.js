import React, { useState } from 'react';
import ATForm, { formBuilder } from '../../lib/component/ATForm/ATForm';
//services
import ServiceManager from 'serviceManager/serviceManager';

const cascadeDesign = [
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
                    {
                        id: 'layerABC2',
                        data: ServiceManager.getData_layerABC2,
                        multiple: true,
                    }
                ]
            },
        ]
    }
]

const BasicForm = React.forwardRef(({ onChange }, forwardRef) => {
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
        <ATForm ref={forwardRef} onChange={onChange} validationDisabled={true}>
            {[
                formBuilder.createAvatar({ id: 'Avatar1', md: 12, size: 128 }),
                formBuilder.createTextBox({ id: 'A', onChange: (event) => setA(event.target.value), value: A }),
                formBuilder.createTextBox({ id: 'B', onChange: (event) => setB(event.target.value), value: B }),
                formBuilder.createTextBox({ id: 'A + B', value: Number(A) + Number(B) }),
                formBuilder.createButton({ id: 'Random A', onClick: () => setA(Math.random() * 10) }),
                formBuilder.createLabel({ id: 'Label', label: 'Hi im a label' }),
                formBuilder.createTextBox({ id: 'Name', validation: { required: true, type: 'string', minLength: 1 }, defaultValue: 'Name' }),
                formBuilder.createPasswordTextBox({ id: 'Password' }),
                formBuilder.createDoublePasswordTextBox({ id: 'Double Password', md: 6 }),
                formBuilder.createAvatar({ id: 'Avatar2' }),
                formBuilder.createComboBox({ id: 'Countries', options: ServiceManager.getCountries, validation: { required: true, type: 'object' }, defaultValue: { ID: 1, Title: 'UK' } }),
                formBuilder.createMultiComboBox({ id: 'CountriesIDVALUE', options: [{ Title: 'UK', ID: 1 }, { Title: 'US', ID: 2 }], validation: { required: true, type: 'array', minItems: 1 } }),
                formBuilder.createDatePicker({ id: 'DatePicker' }),
                formBuilder.createUploadButton({ id: 'UploadButton' }),
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
                formBuilder.createCascadeComboBox({ id: 'CascadeComboBox', design: cascadeDesign }),
                formBuilder.createGrid({
                    id: 'grid01',
                    md: 12,
                }),
                formBuilder.createButton({ id: 'Hide some elements', onClick: onHideSmoeElementsClick }),
                formBuilder.createButton({ id: 'Submit Button', onClick: onSubmitClick, inputType: 'submit' }),
            ]}
        </ATForm>
    )
})

export default BasicForm;