import { useEffect, useRef, useState } from 'react';

import './App.css';
import { Button, Divider, Grid, Tab, Tabs } from '@mui/material';
//UI Utils
import * as UITypeUtils from '@/lib/component/ATForm/UITypeUtils/UITypeUtils';
//Context
import { ATFormConfigProvider } from './lib/component/ATForm/ATFormConfigContext/ATFormConfigContext';
//services
import ServiceManager from '@/serviceManager/serviceManager';
//DatePicker Provider
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
//CustomComponents
import MyTextField from '@/CustomComponents/MyTextField/MyTextField';
//MUI Theme provider
import { createTheme, ThemeProvider } from '@mui/material/styles';
//Examples
import BasicForm from '@/examples/BasicForm/BasicForm';
import ExternalComponentIntegration from '@/examples/ExternalComponentIntegration/ExternalComponentIntegration';
import FormDialog from '@/examples/FormDialog/FormDialog';
import HowToUseContainerWithTable from '@/examples/HowToUseContainerWithTable/HowToUseContainerWithTable';
import ContainerWithTablePlayground from '@/examples/ContainerWithTablePlayground/ContainerWithTablePlayground';
import UserManager from '@/examples/UserManager/UserManager';
import BasicValidation from '@/examples/BasicValidation/BasicValidation';
import Table from '@/examples/Table/Table';
import TabsInForm from '@/examples/TabsInForm/TabsInForm';
import FormInForm from '@/examples/FormInForm/FormInForm';
import TabInTab from '@/examples/TabInTab/TabInTab';
import ComponentPlayground from '@/examples/ComponentPlayground/ComponentPlayground';
import Playground from '@/examples/Playground/Playground';
import CustomWrappers from './examples/CustomWrappers/CustomWrappers';
import ATToastContainer from './lib/component/ATToast/ATToastContainer/ATToastContainer';
import ToastPlayground from './examples/ToastPlayground/ToastPlayground';
import AgGridCellRendererTemplates from './examples/AgGridCellRendererTemplates/AgGridCellRendererTemplates';
import CascadeComboBoxPlayground from './examples/CascadeComboBoxPlayground/CascadeComboBoxPlayground';
import ATToast from './lib/component/ATToast/ATToast';
//Beta Components
import ConditionalRender from './beta/ConditionalRender/ConditionalRender';
import MultiForm from './beta/MultiForm/MultiForm';
import { ATFormOnChangeInterface, ATFormRefInterface } from './lib/types/ATForm.type';
import { StringKeyedObject } from './lib/types/Common.type';
import BasicForm2 from './examples/BasicForm2/BasicForm2';
import ConditionalRendering from './examples/ConditionalRendering/ConditionalRendering';
import WrapMultipleElements from './examples/WrapMultipleElements/WrapMultipleElements';
import ControlledForm from './examples/ControlledForm/ControlledForm';

export interface ExampleComponentInterface {
  ref?: any,
  onChange?: any,
}

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

const ACTIVE_EXAMPLE = 'ControlledForm'

function App() {
  const formRef = useRef<ATFormRefInterface>(null)
  const mFormData = useRef<ATFormOnChangeInterface>(null)
  const [savedFormData, setSavedFormData] = useState<StringKeyedObject | null | undefined>(null)
  const [realTimeFormData, setRealtimeFormData] = useState<StringKeyedObject | null | undefined>(null)
  const [enums, setEnums] = useState(null)
  const [selectedTab, setSelectedTab] = useState(ACTIVE_EXAMPLE)

  useEffect(() => {
    ServiceManager.getEnums()
      .then(res => {
        setEnums(res)
      })
  }, [])

  const onFormChange = ({ formData, formDataKeyValue, formDataSemiKeyValue }: ATFormOnChangeInterface) => {
    mFormData.current = {
      formData: formData,
      formDataKeyValue: formDataKeyValue,
      formDataSemiKeyValue: formDataSemiKeyValue,
    }

    setRealtimeFormData(formDataKeyValue)
  }

  const onSetDefaultValueClick = () => {
    if (formRef.current)
      formRef.current.reset()
  }

  const onLoadLastSubmitClick = () => {
    console.log('savedFormData', savedFormData)
    if (savedFormData && formRef.current)
      formRef.current.reset({ inputDefaultValue: savedFormData, inputDefaultValueFormat: "FormDataKeyValue" })
  }

  const onSubmitClick = () => {
    console.log('on External Submit')
    if (formRef.current)
      formRef.current.checkValidation(
        () => {
          setTimeout(() => {
            console.log('Submitting...', {
              ...(mFormData.current || {}),
            })

            setSavedFormData(mFormData.current?.formDataKeyValue)
            ATToast.success('Formdata submitted successfully!')
          }, 500)
        })
  }

  const onTabChange = (_event: any, newTab: any) => {
    setSelectedTab(newTab)
  }

  const atFormLocalText = {
    'Add': 'Local text Add',
    'This field can not be empty': 'Custom (This field can not be empty)'
  }

  const agGridLocalText = {
    'filter': 'Local text Filter'
  }

  const exampleList = [
    {
      id: 'BasicForm',
      component: BasicForm,
      refEnabled: true,
      onChangeEnabled: true,
    },
    {
      id: 'BasicForm2',
      component: BasicForm2,
      refEnabled: true,
      onChangeEnabled: true,
    },
    {
      id: 'ExternalComponentIntegration',
      component: ExternalComponentIntegration,
      refEnabled: true,
      onChangeEnabled: true,
    },
    {
      id: 'FormDialog',
      component: FormDialog,
    },
    {
      id: 'HowToUseContainerWithTable',
      component: HowToUseContainerWithTable,
      refEnabled: true,
      onChangeEnabled: true,
    },
    {
      id: 'ContainerWithTablePlayground',
      component: ContainerWithTablePlayground,
      refEnabled: false,
      onChangeEnabled: true,
    },
    {
      id: 'UserManager',
      component: UserManager,
    },
    {
      id: 'BasicValidation',
      component: BasicValidation,
    },
    {
      id: 'Table',
      component: Table,
    },
    {
      id: 'TabsInForm',
      component: TabsInForm,
      refEnabled: true,
      onChangeEnabled: true,
    },
    {
      id: 'FormInForm',
      component: FormInForm,
      refEnabled: true,
      onChangeEnabled: true,
    },
    {
      id: 'TabInTab',
      component: TabInTab,
      refEnabled: true,
      onChangeEnabled: true,
    },
    {
      id: 'ComponentPlayground',
      component: ComponentPlayground,
      refEnabled: true,
      onChangeEnabled: true,
    },
    {
      id: 'Playground',
      component: Playground,
    },
    {
      id: 'CustomWrappers',
      component: CustomWrappers,
      refEnabled: true,
      onChangeEnabled: true,
    },
    {
      id: 'ToastPlayground',
      component: ToastPlayground,
    },
    {
      id: 'AgGridCellRendererTemplates',
      component: AgGridCellRendererTemplates
    },
    {
      id: 'CascadeComboBoxPlayground',
      component: CascadeComboBoxPlayground,
      refEnabled: true,
      onChangeEnabled: true,
    },
    {
      id: 'ConditionalRender',
      component: ConditionalRender,
      refEnabled: true,
      onChangeEnabled: true,
    },
    {
      id: 'MultiForm',
      component: MultiForm,
      refEnabled: true,
      onChangeEnabled: true,
    },
    {
      id: 'ConditionalRendering',
      component: ConditionalRendering,
      refEnabled: true,
      onChangeEnabled: true,
    },
    {
      id: 'WrapMultipleElements',
      component: WrapMultipleElements,
      refEnabled: true,
      onChangeEnabled: true,
    },
    {
      id: 'ControlledForm',
      component: ControlledForm,
      refEnabled: true,
      onChangeEnabled: true,
    },
  ]

  console.log('App Renderer')
  return (
    <div className='App'>
      <ATToastContainer />
      <ThemeProvider theme={theme}>
        <ATFormConfigProvider
          value={{
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
          }}
        >
          <LocalizationProvider dateAdapter={(RTL ? AdapterDateFnsJalali : AdapterMoment) as any} >
            <Tabs
              value={selectedTab}
              onChange={onTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              slotProps={{
                scrollButtons: {
                  sx: {
                    width: 'auto',
                    minWidth: 0,
                    height: '100%',
                  },
                }
              }}
              sx={{
                '& .MuiTabs-scrollButtons': {
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                },
                '& .MuiTabs-scrollButtons.Mui-disabled': {
                  opacity: 0.3,
                },
              }}
            >
              {exampleList.map(item => (
                <Tab
                  key={item.id}
                  label={item.id.replace(/([A-Z])/g, ' $1').trim()}
                  value={item.id}
                  sx={{
                    fontSize: '14px',
                    textTransform: 'none',
                  }}
                />
              ))}
            </Tabs>
            <Grid container spacing={3}>
              <Grid size={12}>
                <div>
                  Form data key value :
                </div>
                {JSON.stringify(realTimeFormData || {})}
              </Grid>
              <Grid size={4}>
                <Button onClick={onLoadLastSubmitClick}>load last submit</Button>
              </Grid>
              <Grid size={4}>
                <Button onClick={onSetDefaultValueClick}>set default value </Button>
              </Grid>
              <Grid size={4}>
                <Button onClick={onSubmitClick}>Submit from outside the form</  Button>
              </Grid>
              <Grid size={12}>
                <Divider />
              </Grid>
              <Grid container size={12} spacing={2}>
                {
                  exampleList.filter(item => item.id === selectedTab).map(item => {
                    return <item.component key={item.id} ref={item.refEnabled ? formRef : null} onChange={item.onChangeEnabled ? onFormChange : null} />
                  })
                }
              </Grid>
            </Grid>
          </LocalizationProvider>
        </ATFormConfigProvider>
      </ThemeProvider>
    </div>
  );
}

export default App; 