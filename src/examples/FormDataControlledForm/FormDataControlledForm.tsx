import { AtForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from '@/App';
import { useState } from "react";
import { AtFormOnChangeInterface } from "@/lib/types/AtForm.type";

const FormDataControlledForm = ({ ref, onChange }: ExampleComponentInterface) => {
    const [formData, setFormData] = useState<any>()

    const internalOnChange = (props: AtFormOnChangeInterface) => {
        setFormData(props.formData)

        console.log('###ATForm onChange###', props.formDataKeyValue)

        if (onChange)
            onChange(props)
    }

    console.log("FormDataControlledForm Value", formData)

    const setValue = (newValue: any) => {
        if (ref.current.reset) {
            ref.current.reset({ inputDefaultValue: newValue, inputDefaultValueFormat: "FormData" })
        }
    }

    const manualSetValue = (newValue: any) => {
        setFormData((prevValue: any) => {
            
            return {
                ...prevValue,
                ...newValue,
            }
        })
    }

    return (
        <AtForm ref={ref} onChange={internalOnChange} value={formData} valueFormat="FormData">
            {[
                formBuilder.createTextBox({ id: 'TextBox1', size: 6 }),
                formBuilder.createForm({ id: "SecondaryForm", size: 12 }, {
                    formChildren: [
                        formBuilder.createTextBox({ id: 'TextBox2', size: 6 }),
                    ]
                }),
                formBuilder.createButton(
                    { id: "setValue", size: 3 },
                    { onClick: () => setValue({ TextBox1: { value: "I'm set Value" } }) }
                ),
                formBuilder.createButton(
                    { id: "setValue SecondaryForm", size: 3 },
                    { onClick: () => manualSetValue({ SecondaryForm: { value: { TextBox2: { value: "I'm set Value" } } } }) }
                ),
            ]}
        </AtForm>
    )
}

export default FormDataControlledForm;