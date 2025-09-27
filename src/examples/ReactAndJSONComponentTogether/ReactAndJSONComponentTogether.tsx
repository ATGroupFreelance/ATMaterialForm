import { ExampleComponentInterface } from '@/App';
import { ATForm, formBuilder } from '@/lib';
import TextBox from '@/lib/component/ATForm/UI/TextBox/TextBox';

const ReactAndJSONComponentTogether = ({ ref, onChange }: ExampleComponentInterface) => {
    return (
        <ATForm ref={ref} onChange={onChange}>
            {
                formBuilder.utils.createFieldDefBuilder(
                    [
                        formBuilder.createTextBox({ id: 'TextBox1', size: 4 }),
                        formBuilder.createCustomControlledField(
                            TextBox,
                            {
                                id: 'TextBox2',
                                size: 4,
                            },
                            {
                                label: 'This is from React Component',
                                placeholder: 'This is from React Component',
                            },
                        ),
                        formBuilder.createTextBox({ id: 'TextBox3', size: 4 }),
                    ]
                )
                    .buildATForm()
            }
        </ATForm>
    )
}

export default ReactAndJSONComponentTogether;