#Introduction 
This is a JSON based form where instead of JSX elements you can pass built in JSON functions, The goal is to make a super easy to use form that doesn't use <form/> and manages everything manually.
Right now the form uses MaterialUI for the UI and AJV for the validation.
A few features:
+The form controlls the elements inside their own component.
+Changes in the elements doesn't trigger rerender of the form to increase performance.
+The form uses split coding to dynamiclly load the elements.
I have just began this repostory and I intend to add more features and more specific UIs as time goes on to really understand why this package is fast to use you should see the examples.

#Getting Started 
```
import { Grid } from '@mui/material';
import { useRef, useState } from 'react';
import './App.css';
import { ATForm, formBuilder } from 'materialatform';
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
```