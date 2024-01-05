import React, { useEffect, useRef, useState } from 'react';

import './App.css';
import { Button, Grid } from '@mui/material';
//UI Utils
import * as UITypeUtils from 'lib/component/ATForm/UITypeUtils/UITypeUtils';
//Context
import { ATFormContextProvider } from './lib/component/ATForm/ATFormContext/ATFormContext';
//services
import ServiceManager from 'serviceManager/serviceManager';
//DatePicker Provider
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
//CustomComponents
import MyTextField from 'CustomComponents/MyTextField/MyTextField';
//Notistack
//Notistack custom variations
import AreYouSure from 'lib/component/Notistack/CustomVariations/AreYouSure/AreYouSure';
//Notistack ClasslessSnackbar Snackbar
import { SnackbarUtilsConfigurator } from 'lib/component/Notistack/ClasslessSnackbar/ClasslessSnackbar';
//Notistack Provider
import { SnackbarProvider } from 'notistack';
//MUI Theme provider
import { createTheme, ThemeProvider } from '@mui/material/styles';
//Examples
import BasicForm from 'examples/BasicForm/BasicForm';
import ExternalComponentIntegration from 'examples/ExternalComponentIntegration/ExternalComponentIntegration';
import FormDialog from 'examples/FormDialog/FormDialog';
import HowToUseContainerWithTable from 'examples/HowToUseContainerWithTable/HowToUseContainerWithTable';
import ContainerWithTablePlayground from 'examples/ContainerWithTablePlayground/ContainerWithTablePlayground';
import UserManager from 'examples/UserManager/UserManager';
import BasicValidation from 'examples/BasicValidation/BasicValidation';
import Table from 'examples/Table/Table';
import TabsInForm from 'examples/TabsInForm/TabsInForm';
import FormInForm from 'examples/FormInForm/FormInForm';
import TabInTab from 'examples/TabInTab/TabInTab';

const RTL = true

const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained'
      }
    }
  }
});

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

  const onFormChange = ({ formData, formDataKeyValue, formDataSemiKeyValue }) => {
    mFormData.current = {
      formData: formData,
      formDataKeyValue: formDataKeyValue,
      formDataSemiKeyValue: formDataSemiKeyValue,
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
        console.log('Submitting...', {
          ...(mFormData.current || {}),
        })
        setSavedFormData(mFormData.current.formDataKeyValue)
      }, 1000)
    })
  }

  const activeExample = 'TabInTab'

  const atFormLocalText = {
    'Add': 'Local text Add',
    'This field can not be empty': 'Custom (This field can not be empty)'
  }

  const agGridLocalText = {
    'filter': 'Local text Filter'
  }

  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <ATFormContextProvider value={{
          rtl: RTL,
          enums: enums,
          uploadFilesToServer: ServiceManager.uploadFilesToServer,
          localText: atFormLocalText,
          agGridLocalText: agGridLocalText,
          customComponents: [
            {
              component: MyTextField,
              typeInfo: UITypeUtils.createType({
                type: 'MyTextField',
                initialValue: '',
                validation: UITypeUtils.createValidation({ anyOf: [{ type: 'string', minLength: 1 }, { type: 'integer' }] }),
              })
            }
          ]
        }}>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            Components={{
              areYouSure: AreYouSure
            }}
          >
            <LocalizationProvider dateAdapter={RTL ? AdapterDateFnsJalali : AdapterMoment} >
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
                {activeExample === 'ContainerWithTablePlayground' && <ContainerWithTablePlayground onChange={onFormChange} />}
                {activeExample === 'UserManager' && <UserManager />}
                {activeExample === 'BasicValidation' && <BasicValidation />}
                {activeExample === 'Table' && <Table />}
                {activeExample === 'TabsInForm' && <TabsInForm ref={formRef} onChange={onFormChange} />}
                {activeExample === 'FormInForm' && <FormInForm ref={formRef} onChange={onFormChange} />}
                {activeExample === 'TabInTab' && <TabInTab ref={formRef} onChange={onFormChange} />}
                <Grid item xs={12}>
                  <Button onClick={onLoadLastSubmitClick}>load last submit</Button>
                  <Button onClick={onSetDefaultValueClick}>set default value </Button>
                  <Button onClick={onSubmitClick}>Submit from outside the form</  Button>
                </Grid>
              </Grid>
            </LocalizationProvider>
          </SnackbarProvider>
        </ATFormContextProvider>
      </ThemeProvider>
    </div>
  );
}

export default App; 