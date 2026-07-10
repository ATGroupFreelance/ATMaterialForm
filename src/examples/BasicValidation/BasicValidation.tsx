import { AtForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from '@/App';

const BasicValidation = ({ ref, onChange }: ExampleComponentInterface) => {
    return (
        <AtForm ref={ref} onChange={onChange}>
            {
                [
                    formBuilder.createTextBox({ id: 'Name', validation: { required: true } }),
                ]
            }
        </AtForm>
    )
}

export default BasicValidation;