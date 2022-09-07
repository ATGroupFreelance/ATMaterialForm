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

    setFormDataForView(formDataKeyValue)
  }

  const onSetDefaultValueClick = (event, { startLoading, stopLoading }) => {
    startLoading()
    formRef.current.reset({
      'Name': null,
      'Countries': null,
    })
    setTimeout(() => {
      stopLoading()
    }, 300)
  }

  const onSubmitClick = (event, { formData, startLoading, stopLoading }) => {
    startLoading()

    setTimeout(() => {
      console.log('Submitting...', formData)
      stopLoading()
    }, 1000)
  }

  return (
    <div className='App'>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {JSON.stringify(formDataForView)}
        </Grid>
        <ATForm onChange={onFormChange} ref={formRef} serviceManager={ServiceManager} >
          {[
            formBuilder.createTextBox({ id: 'Name', validation: { required: true, type: 'string', minLength: 1 } }),
            formBuilder.createComboBox({ id: 'Countries', options: [{ label: 'UK', value: 1 }, { label: 'US', value: 2 }], validation: { required: true, type: 'object' } }),
            formBuilder.createMultiComboBox({ id: 'CountriesIDVALUE', options: [{ label: 'UK', value: 1 }, { label: 'US', value: 2 }], validation: { required: true, type: 'array', minItems: 1 } }),
            formBuilder.createDatePicker({ id: 'DatePicker' }),
            formBuilder.createUploadButton({ id: 'UploadButton' }),
            formBuilder.createButton({ id: 'SetDefaultValue', onClick: onSetDefaultValueClick }),
            formBuilder.createButton({ id: 'SubmitButton', onClick: onSubmitClick, inputType: 'submit' }),
          ]}
        </ATForm>
      </Grid>
    </div>
  );
}

export default App;