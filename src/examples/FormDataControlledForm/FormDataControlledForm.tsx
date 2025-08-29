import { ATForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from '@/App';
import { useState } from "react";
import { ATFormOnChangeInterface } from "@/lib/types/ATForm.type";

const FormDataControlledForm = ({ ref, onChange }: ExampleComponentInterface) => {
    const [formData, setFormData] = useState<any>()

    const internalOnChange = (props: ATFormOnChangeInterface) => {
        setFormData(props.formData)

        console.log('###ATForm onChange###', props)

        if (onChange)
            onChange(props)
    }

    const setValue = (newValue: any) => {
        setFormData(newValue)

        if (onChange)
            onChange({
                formData: newValue,
                formDataKeyValue: { TextBox1: newValue.TextBox1.value },
                formDataSemiKeyValue: { TextBox1: newValue.TextBox1.value },
            })
    }

    console.log("FormDataControlledForm Value", formData)

    return (
        <ATForm ref={ref} onChange={internalOnChange} value={formData} valueFormat="FormData">
            {[
                formBuilder.createTextBox({ id: 'TextBox1', size: 6 }),
                formBuilder.createButton({ id: "setValue", size: 3 }, { onClick: () => setValue({ TextBox1: { value: "I'm set Value" } }) }),
            ]}
        </ATForm>
    )
}

export default FormDataControlledForm;