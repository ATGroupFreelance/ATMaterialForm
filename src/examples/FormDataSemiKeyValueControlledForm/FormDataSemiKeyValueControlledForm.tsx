import { ATForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from '@/App';
import { useState } from "react";
import { ATFormOnChangeInterface } from "@/lib/types/ATForm.type";

const FormDataSemiKeyValueControlledForm = ({ ref, onChange }: ExampleComponentInterface) => {
    const [formData, setFormData] = useState<any>()

    const internalOnChange = (props: ATFormOnChangeInterface) => {
        setFormData(props.formDataSemiKeyValue)

        console.log('###ATForm onChange###', props)

        if (onChange)
            onChange(props)
    }

    console.log("FormDataSemiKeyValueControlledForm Value", formData)

    return (
        <ATForm ref={ref} onChange={internalOnChange} value={formData} valueFormat="FormDataSemiKeyValue">
            {[
                formBuilder.createTextBox({ id: 'TextBox1', size: 6 }),
                formBuilder.createButton({ id: "setValue", size: 3 }, { onClick: () => setFormData({ TextBox1: "I'm set Value" }) }),
            ]}
        </ATForm>
    )
}

export default FormDataSemiKeyValueControlledForm;