import { ExampleComponentInterface } from '@/App';
import { ATForm, formBuilder } from '@/lib';

const WrapMultipleElements = ({ ref, onChange }: ExampleComponentInterface) => {
    return (
        <ATForm ref={ref} onChange={onChange}>
            {
                formBuilder.utils.createFieldDefBuilder(
                    [
                        formBuilder.createForm({ id: 'FormA' },
                            {
                                elements: [
                                    formBuilder.createTextBox({ id: 'TextBox1' }),
                                    formBuilder.createTextBox({ id: 'TextBox2' }),
                                ]
                            }
                        ),                        
                        formBuilder.createTextBox({ id: 'TextBox3' }),
                        formBuilder.createTextBox({ id: 'TextBox4' }),
                    ]
                )
                    .buildATForm()
            }
        </ATForm>
    )
}

export default WrapMultipleElements;