import { ATForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from '@/App';
import { useState } from "react";
import { ATFormOnChangeInterface } from "@/lib/types/ATForm.type";

const FormDataKeyValueControlledForm = ({ ref, onChange }: ExampleComponentInterface) => {
    const [formData, setFormData] = useState<any>()

    const internalOnChange = (props: ATFormOnChangeInterface) => {
        setFormData(props.formDataKeyValue)

        console.log('###ATForm onChange###', props)

        if (onChange)
            onChange(props)
    }

    console.log("FormDataKeyValueControlledForm Value", formData)

    const manualSetValue = (newValue: any) => {
        setFormData((prevValue: any) => {

            return {
                ...prevValue,
                ...newValue,
            }
        })        
    }

    return (
        <ATForm ref={ref} onChange={internalOnChange} value={formData} valueFormat="FormDataKeyValue">
            {[
                formBuilder.createTextBox({ id: 'TextBox1', size: 6 }),
                formBuilder.createButton({ id: "setValue", size: 3 }, { onClick: () => manualSetValue({ TextBox1: "I'm set Value" }) }),
            ]}
        </ATForm>
    )
}

export default FormDataKeyValueControlledForm;