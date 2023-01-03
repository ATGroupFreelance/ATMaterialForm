import React, { useRef, useState } from 'react';

import './App.css';
import { Button, Grid } from '@mui/material';
//Context
import ATFormContext from './lib/component/ATForm/ATFormContext/ATFormContext';
//services
import ServiceManager from 'serviceManager/serviceManager';
//DatePicker Provider
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import AdapterJalali from '@date-io/date-fns-jalali';
//CustomComponents
import MyTextField from 'CustomComponents/MyTextField/MyTextField';
//Examples
import BasicForm from 'examples/BasicForm/BasicForm';
import ExternalComponentIntegration from 'examples/ExternalComponentIntegration/ExternalComponentIntegration';

const RTL = true

function App() {
  const formRef = useRef(null)
  const mFormData = useRef(null)
  const [savedFormData, setSavedFormData] = useState(null)
  const [realTimeFormData, setRealtimeFormData] = useState(null)

  const onFormChange = ({ formData, formDataKeyValue }) => {
    mFormData.current = {
      formData: formData,
      formDataKeyValue: formDataKeyValue,
    }

    setRealtimeFormData(formDataKeyValue)
  }

  const onSetDefaultValueClick = (event) => {
    formRef.current.reset()
  }

  const onLoadLastSubmitClick = (event) => {
    console.log('savedFormData', savedFormData)
    if (savedFormData)
      formRef.current.reset(savedFormData)
  }

  const onSubmitClick = (event) => {
    console.log('on External Submit')
    formRef.current.checkValidation(() => {
      setTimeout(() => {
        console.log('Submitting...', mFormData.current.formData, mFormData.current.formDataKeyValue)
        setSavedFormData(mFormData.current.formDataKeyValue)
      }, 1000)
    })
  }

  const activeExample = 'ExternalComponentIntegration'

  return (
    <div className='App'>
      <ATFormContext.Provider value={{ rtl: true, getEnums: ServiceManager.getEnums, uploadFilesToServer: ServiceManager.uploadFilesToServer, customComponents: [{ component: MyTextField, typeInfo: { type: 'MyTextField', initialValue: '' } }] }}>
        <LocalizationProvider dateAdapter={RTL ? AdapterJalali : AdapterMoment}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div>
                Form data key value :
              </div>
              {JSON.stringify(realTimeFormData || {})}
            </Grid>
            {activeExample === 'BasicForm' && <BasicForm ref={formRef} onChange={onFormChange} />}
            {activeExample === 'ExternalComponentIntegration' && <ExternalComponentIntegration ref={formRef} onChange={onFormChange} />}
            <Grid item xs={12}>
              <Button onClick={onLoadLastSubmitClick}>load last submit</Button>
              <Button onClick={onSetDefaultValueClick}>set default value </Button>
              <Button onClick={onSubmitClick}>Submit from outside the form</  Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </ATFormContext.Provider>
    </div>
  );
}

export default App; 