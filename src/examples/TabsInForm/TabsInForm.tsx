import { ExampleComponentInterface } from '@/App';
import { AtForm, formBuilder} from '@/lib';

const TabsInForm = ({ ref, onChange }: ExampleComponentInterface) => {
    return (
        <AtForm ref={ref} onChange={onChange} validationDisabled={false} tabs={[{ label: 'Tab Title 1' }, { label: 'Tab Title 2' }]}>
            {
                formBuilder.utils.createFieldDefBuilder(
                    [
                        formBuilder.createTextBox({ id: 'imInTab2', tabPath: 1 }),
                        formBuilder.createTextBox({ id: 'imInTab1', tabPath: 0 }),
                    ]
                )
                    .buildAtForm()
            }
        </AtForm>
    )
}

export default TabsInForm;