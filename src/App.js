import { Grid } from '@mui/material';
import { useRef, useState } from 'react';
import './App.css';
import ATForm, { formBuilder } from './lib/component/ATForm/ATForm';
//services
import ServiceManager from 'serviceManager/serviceManager';

function App() {
  const mFormData = useRef(null)
  const formRef = useRef(null)
  const [formDataForView, setFormDataForView] = useState(null)

  const onFormChange = ({ formData, formDataKeyValue }) => {
    mFormData.current = {
      formData: formData,
      formDataKeyValue: formDataKeyValue,
    }

    console.log('mFormData.current', mFormData.current)
    setFormDataForView(formDataKeyValue)
  }

  const onSetDefaultValueClick = (event, { startLoading, stopLoading }) => {
    startLoading()
    formRef.current.reset()
    setTimeout(() => {
      stopLoading()
    }, 300)
  }

  //formData and formDataKeyValue is only filled if validation is used, this is to improve performance
  const onSubmitClick = (event, { formData, formDataKeyValue, startLoading, stopLoading }) => {
    startLoading()

    setTimeout(() => {
      console.log('Submitting...', formData, formDataKeyValue)
      stopLoading()
    }, 1000)
  }

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

  return (
    <div className='App'>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {JSON.stringify(formDataForView)}
        </Grid>
        <ATForm onChange={onFormChange} ref={formRef} serviceManager={ServiceManager} >
          {[
            // formBuilder.createTextBox({ id: 'Name', validation: { required: true, type: 'string', minLength: 1 } }),
            // formBuilder.createComboBox({ id: 'Countries', options: [{ Title: 'UK', ID: 1 }, { Title: 'US', ID: 2 }], validation: { required: true, type: 'object' } }),
            // formBuilder.createMultiComboBox({ id: 'CountriesIDVALUE', options: [{ Title: 'UK', ID: 1 }, { Title: 'US', ID: 2 }], validation: { required: true, type: 'array', minItems: 1 } }),
            // formBuilder.createDatePicker({ id: 'DatePicker' }),
            // formBuilder.createUploadButton({ id: 'UploadButton' }),
            formBuilder.createCascadeComboBox({ id: 'CascadeComboBox', design: cascadeDesign }),
            formBuilder.createGrid({
              id: 'grid01',
              md: 12,
            }),
            formBuilder.createButton({ id: 'SetDefaultValue', onClick: onSetDefaultValueClick }),
            formBuilder.createButton({ id: 'SubmitButton', onClick: onSubmitClick, inputType: 'submit' }),
          ]}
        </ATForm>
      </Grid>
    </div>
  );
}

export default App; 