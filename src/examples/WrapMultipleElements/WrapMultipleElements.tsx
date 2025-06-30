import { ExampleComponentInterface } from '@/App';
import { ATForm, formBuilder } from '@/lib';

const WrapMultipleElements = ({ ref, onChange }: ExampleComponentInterface) => {
    return (
        <ATForm ref={ref} onChange={onChange}>
            {
                formBuilder.utils.createFieldDefBuilder(
                    [
                        formBuilder.createForm({ id: 'FormA', size: 6, wrapperRenderer: "Collapse" },
                            {
                                elements: [
                                    formBuilder.createTextBox({ id: 'TextBox1', size: 6 }),
                                    formBuilder.createTextBox({ id: 'TextBox2', size: 6 }),
                                ]
                            }
                        ),
                        formBuilder.createTextBox({ id: 'TextBox3', size: 6 }),
                        formBuilder.createForm({ id: 'Formb', size: 6 },
                            {
                                elements: [
                                    formBuilder.createTextBox({ id: 'TextBox1', size: 6 }),
                                    formBuilder.createTextBox({ id: 'TextBox2', size: 6 }),
                                ]
                            }
                        ),
                        formBuilder.createTextBox({ id: 'TextBox4', size: 6 }),
                        formBuilder.createForm({ id: 'FormC', size: 6, wrapperRenderer: 'Grid' },
                            {
                                elements: [
                                    formBuilder.createTextBox({ id: 'TextBox1', size: 6 }),
                                    formBuilder.createTextBox({ id: 'TextBox2', size: 6 }),
                                ]
                            }
                        ),
                    ]
                )
                    .buildATForm()
            }
        </ATForm>
    )
}

export default WrapMultipleElements;