import { ExampleComponentInterface } from '@/App';
import { ATForm, formBuilder, formBuilderUtils } from '@/lib';

const TabsInForm = ({ ref, onChange }: ExampleComponentInterface) => {
    return (
        <ATForm ref={ref} onChange={onChange} validationDisabled={false} tabs={[{ label: 'Tab Title 1' }, { label: 'Tab Title 2' }]}>
            {
                formBuilderUtils.createColumnBuilder(
                    [
                        formBuilder.createTextBox({ id: 'imInTab2', tabPath: 1 }),
                        formBuilder.createTextBox({ id: 'imInTab1', tabPath: 0 }),
                    ]
                )
                    .build()
            }
        </ATForm>
    )
}

export default TabsInForm;