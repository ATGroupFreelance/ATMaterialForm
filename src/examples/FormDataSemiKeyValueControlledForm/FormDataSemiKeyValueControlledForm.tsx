import { AtForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from '@/App';
import { useState } from "react";
import { AtFormOnChangeInterface } from "@/lib/types/AtForm.type";

const FormDataSemiKeyValueControlledForm = ({ ref, onChange }: ExampleComponentInterface) => {
    const [formData, setFormData] = useState<any>()

    const internalOnChange = (props: AtFormOnChangeInterface) => {
        setFormData(props.formDataSemiKeyValue)

        console.log('###ATForm onChange###', props)

        if (onChange)
            onChange(props)
    }

    console.log("FormDataSemiKeyValueControlledForm Value", formData)

    return (
        <AtForm ref={ref} onChange={internalOnChange} value={formData} valueFormat="FormDataSemiKeyValue">
            {[
                formBuilder.createTextBox({ id: 'TextBox1', size: 6 }),
                formBuilder.createButton({ id: "setValue", size: 3 }, { onClick: () => setFormData({ TextBox1: "I'm set Value" }) }),
            ]}
        </AtForm>
    )
}

export default FormDataSemiKeyValueControlledForm;