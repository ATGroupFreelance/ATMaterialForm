import { ExampleComponentInterface } from '@/App';
import { ATForm, formBuilder } from '@/lib';
import Button from '@/lib/component/ATForm/UI/Button/Button';
import { ATFormOnChangeInterface } from '@/lib/types/ATForm.type';
import { Grid } from '@mui/material';
import { useState } from 'react';

const MyForm = ({ ref, onChange, value }: any) => {
    return <ATForm ref={ref} onChange={onChange} value={value}>
        {
            formBuilder.utils.createFieldDefBuilder(
                [
                    // formBuilder.createTextBox({ id: 'TextBox1', size: 6 }),
                    // formBuilder.createForm({ id: 'FormA', size: 6, wrapperRenderer: "Collapse" },
                    //     {
                    //         elements: [
                    //             formBuilder.createTextBox({ id: 'ATextBox1', size: 6 }),
                    //             formBuilder.createTextBox({ id: 'ATextBox2', size: 6 }),
                    //         ]
                    //     }
                    // ),
                    // formBuilder.createTextBox({ id: 'TextBox3', size: 6 }),
                    // formBuilder.createForm({ id: 'Formb', size: 6 },
                    //     {
                    //         elements: [
                    //             formBuilder.createTextBox({ id: 'BTextBox1', size: 6 }),
                    //             formBuilder.createTextBox({ id: 'BTextBox2', size: 6 }),
                    //         ]
                    //     }
                    // ),
                    // formBuilder.createTextBox({ id: 'TextBox4', size: 6 }),
                    // formBuilder.createForm({ id: 'FormC', size: 6, wrapperRenderer: 'Grid' },
                    //     {
                    //         elements: [
                    //             formBuilder.createTextBox({ id: 'CTextBox1', size: 6 }),
                    //             formBuilder.createTextBox({ id: 'CTextBox2', size: 6 }),
                    //         ]
                    //     }
                    // ),
                    formBuilder.createCheckBox({ id: 'CheckBox' }),
                ]
            )
                .buildATForm()
        }
    </ATForm>
}

const ControlledForm = ({ ref, onChange }: ExampleComponentInterface) => {
    const [value, setValue] = useState<Record<string, any>>({})

    const onInternalChange = ({ formData, formDataKeyValue, formDataSemiKeyValue }: ATFormOnChangeInterface) => {
        console.log('setValue change', {
            formDataSemiKeyValue,
        })
        setValue(formDataSemiKeyValue)

        onChange({ formData, formDataKeyValue, formDataSemiKeyValue, })
    }

    const onFormSetValueClick = () => {
        setValue({
            // "TextBox1": "im TextBox1 outside of the form",
            // Formb: {
            //     BTextBox1: "FormB TextBox1",
            //     BTextBox2: "FormB TextBox2",
            // }
            CheckBox: true,
        })
    }

    console.log('setValue value', {
        value   
    })

    return (
        <Grid size={12} container spacing={2}>
            <Grid size={2}>
                <Button onClick={onFormSetValueClick}>Form Set Value</Button>
            </Grid>
            <Grid size={12} container spacing={2}>
                <MyForm ref={ref} onChange={onInternalChange} value={value} />
            </Grid>
        </Grid>
    )
}

export default ControlledForm;