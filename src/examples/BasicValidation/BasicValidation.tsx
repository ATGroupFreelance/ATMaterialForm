import { ATForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from '@/App';

const BasicValidation = ({ ref, onChange }: ExampleComponentInterface) => {
    return (
        <ATForm ref={ref} onChange={onChange}>
            {
                [
                    formBuilder.createTextBox({ id: 'Name', validation: { required: true } }),
                ]
            }
        </ATForm>
    )
}

export default BasicValidation;