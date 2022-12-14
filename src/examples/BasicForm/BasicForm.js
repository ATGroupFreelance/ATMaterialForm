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
                formBuilder.createTextBox({ id: 'Name', validation: { required: true, type: 'string', minLength: 1 } }),
                formBuilder.createComboBox({ id: 'Countries', options: ServiceManager.getCountries, validation: { required: true, type: 'object' } }),
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