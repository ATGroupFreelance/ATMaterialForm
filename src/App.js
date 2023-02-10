import React, { useEffect, useRef, useState } from 'react';

import './App.css';
import { Button, Grid } from '@mui/material';
//Context
import { ATFormContextProvider } from './lib/component/ATForm/ATFormContext/ATFormContext';
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
import FormDialog from 'examples/FormDialog/FormDialog';
import HowToUseContainerWithTable from 'examples/HowToUseContainerWithTable/HowToUseContainerWithTable';
import UserManager from 'examples/UserManager/UserManager';
//Notistack
//Notistack custom variations
import AreYouSure from 'lib/component/Notistack/CustomVariations/AreYouSure/AreYouSure';
//Notistack ClasslessSnackbar Snackbar
import { SnackbarUtilsConfigurator } from 'lib/component/Notistack/ClasslessSnackbar/ClasslessSnackbar';
//Notistack Provider
import { SnackbarProvider } from 'notistack';

const RTL = false

function App() {
  const formRef = useRef(null)
  const mFormData = useRef(null)
  const [savedFormData, setSavedFormData] = useState(null)
  const [realTimeFormData, setRealtimeFormData] = useState(null)
  const [enums, setEnums] = useState(null)

  useEffect(() => {
    ServiceManager.getEnums()
      .then(res => {
        setEnums(res)
      })
  }, [])

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

  const activeExample = 'FormDialog'

  const atFormLocalText = {
    'Add': 'Local text Add'
  }

  const agGridLocalText = {
    'filter': 'Local text Filter'
  }

  return (
    <div className='App'>
      <ATFormContextProvider value={{ rtl: RTL, enums: enums, uploadFilesToServer: ServiceManager.uploadFilesToServer, localText: atFormLocalText, agGridLocalText: agGridLocalText, customComponents: [{ component: MyTextField, typeInfo: { type: 'MyTextField', initialValue: '' } }] }}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          Components={{
            areYouSure: AreYouSure
          }}
        >
          <LocalizationProvider dateAdapter={RTL ? AdapterJalali : AdapterMoment}>
            <SnackbarUtilsConfigurator />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div>
                  Form data key value :
                </div>
                {JSON.stringify(realTimeFormData || {})}
              </Grid>
              {activeExample === 'BasicForm' && <BasicForm ref={formRef} onChange={onFormChange} />}
              {activeExample === 'ExternalComponentIntegration' && <ExternalComponentIntegration ref={formRef} onChange={onFormChange} />}
              {activeExample === 'FormDialog' && <FormDialog />}
              {activeExample === 'HowToUseContainerWithTable' && <HowToUseContainerWithTable ref={formRef} onChange={onFormChange} />}
              {activeExample === 'UserManager' && <UserManager />}
              <Grid item xs={12}>
                <Button onClick={onLoadLastSubmitClick}>load last submit</Button>
                <Button onClick={onSetDefaultValueClick}>set default value </Button>
                <Button onClick={onSubmitClick}>Submit from outside the form</  Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </SnackbarProvider>
      </ATFormContextProvider>
    </div>
  );
}

export default App; 