import { AtForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from '@/App';

const FormInForm = ({ ref, onChange }: ExampleComponentInterface) => {
    return (
        <AtForm ref={ref} onChange={onChange} tabs={[{ label: 'FormA' }, { label: 'FormB' }]}>
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
                            formBuilder.createComboBox({ id: "ComboA1" }, { enumsKey: "Countries" })
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
        </AtForm>
    )
}

export default FormInForm;