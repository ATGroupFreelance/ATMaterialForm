import { ExampleComponentInterface } from '@/App';
import { AtForm, formBuilder } from '@/lib';
import TextBox from '@/lib/component/AtForm/Ui/TextBox/TextBox';
import { createType, createValidation } from '@/lib/component/AtForm/UiTypeUtils/UiTypeUtils';

const ReactAndJsonComponentTogether = ({ ref, onChange }: ExampleComponentInterface) => {
    return (
        <AtForm ref={ref} onChange={onChange}>
            {
                formBuilder.utils.createFieldDefBuilder(
                    [
                        formBuilder.createTextBox({ id: 'TextBox1', size: 4 }),
                        formBuilder.createCustomControlledField(
                            TextBox,
                            {
                                id: 'TextBox2',
                                size: 4,
                                typeInfo: createType({
                                    type: "CustomControlledField",
                                    initialValue: "",
                                    validation: createValidation({ anyOf: [{ type: 'string', minLength: 1 }, { type: 'integer' }] }),
                                })
                            },
                            {
                                label: 'This is from React Component',
                                placeholder: 'This is from React Component',
                            },
                        ),
                        formBuilder.createTextBox({ id: 'TextBox3', size: 4 }),
                    ]
                )
                    .buildAtForm()
            }
        </AtForm>
    )
}

export default ReactAndJsonComponentTogether;