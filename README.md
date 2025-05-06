<h1>Introduction ATMaterialForm</h1>
This is a form with production speed at its goal. Having flexibility is not a bad thing, but in most small to medium websites, what we need from forms is very specific. We need to create certain forms with certain elements, and on each page, we repeat this process. This usually requires you to create a lot of JSX elements and handle their on change or use html form and handle its submit, create loading, and many other small details that are required, but almost all the time, these small details are the same, and our goal here is to create a form that handles all that.
<h1> Primary Focus</h1>
Our form will use Material UI to create its ready-to-use elements. We add much-needed features to some of these elements and keep in mind our form's performance. Right now, the form is super fast with very little need for rerendering.
<h1>Main Features</h1>
<b>* The form can use JSON to create elements. It's handy if you want to make a bunch of forms using database columns.
<br>
* The form can handle perfect save and load without any issues.
<br>
* You don't need to lookup Material UI options, all basics are filled, and of course, you can add to them or even overwrite them, but basically, you can say "createTextBox({id: name})" and you are done!
<br>
* Split coding, We use React.Lazy to import material packages when they are used
</b>
<h1>Getting Started</h1>
<h2>How to install using npm</h2>

```

npm install atmaterialform

```

<h2>A simple example of create a textbox!</h2>

```
<ATForm >
        {[
          formBuilder.createTextBox({ id: 'Name'}),            
        ]}
</ATForm>

```
<h2> Here is a full example that shows some of the features</h2>
<br>
After using create-react-app, replace your app.js with this  code and you should see the result
<br>

```
import { useRef, useState } from 'react';
import './App.css';
import { ATForm, formBuilder, Grid } from 'atmaterialform';

function App() {
  const mFormData = useRef(null)
  const formRef = useRef(null)
  const [formDataForView, setFormDataForView] = useState(null)

  const onFormChange = ({ formData, formDataKeyValue, formDataSemiKeyValue }) => {
    mFormData.current = {
      formData: formData,
      formDataKeyValue: formDataKeyValue,
    }

    setFormDataForView(formDataKeyValue)

    console.log('onFormChange', mFormData.current)
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

  console.log('test', formBuilder.createTextBox({ id: 'name' }),)

  return (
    <div className='App'>
      <Grid container spacing={2} >
        <Grid item xs={12}>
          {JSON.stringify(formDataForView)}
        </Grid>
        <ATForm onChange={onFormChange} ref={formRef} >
          {[
            formBuilder.createTextBox({ id: 'Name', validation: { required: true, type: 'string', minLength: 1 } }),
            formBuilder.createComboBox({ id: 'Countries', options: [{ label: 'UK', value: 1 }, { label: 'US', value: 2 }], validation: { required: true, type: 'object' } }),
            formBuilder.createMultiComboBox({ id: 'CountriesIDVALUE', options: [{ label: 'UK', value: 1 }, { label: 'US', value: 2 }], validation: { required: true, type: 'array', minItems: 1 } }),
            formBuilder.createDatePicker({ id: 'DatePicker' }),
            formBuilder.createUploadButton({ id: 'UploadButton' }),
            formBuilder.createButton({ id: 'SetDefaultValue', onClick: onSetDefaultValueClick }),
            formBuilder.createButton({ id: 'SubmitButton', onClick: onSubmitClick }),
          ]}
        </ATForm>
      </Grid>
    </div>
  );
}

export default App;

```
