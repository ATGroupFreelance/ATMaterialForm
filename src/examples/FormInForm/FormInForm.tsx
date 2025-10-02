import { ATForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from '@/App';
import ServiceManager from "@/serviceManager/serviceManager";

const FormInForm = ({ ref, onChange }: ExampleComponentInterface) => {
    return (
        <ATForm ref={ref} onChange={onChange} tabs={[{ label: 'FormA' }, { label: 'FormB' }]}>
            {[
                formBuilder.createTextBox({ id: '1' }),
                formBuilder.createForm(
                    {
                        id: 'FormA',
                        // tabPath: 0,
                    },
                    {
                        formChildren: [
                            formBuilder.createTextBox({ id: 'A1' }),
                            formBuilder.createTextBox({ id: 'A2' }),
                            formBuilder.createTextBox({ id: 'A3' }),
                            formBuilder.createComboBox({ id: "ComboA1" }, { options: ServiceManager.getCountries, enumsKey: "Countries" })
                        ]
                    }
                ),
                formBuilder.createForm(
                    {
                        id: 'FormB',
                        tabPath: 1,
                    },
                    {
                        formChildren: [
                            formBuilder.createTextBox({ id: 'B1' }),
                            formBuilder.createTextBox({ id: 'B2' }),
                            formBuilder.createTextBox({ id: 'B3' }),
                        ]
                    }
                ),
            ]}
        </ATForm>
    )
}

export default FormInForm;