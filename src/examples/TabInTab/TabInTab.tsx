import { ATForm, formBuilder } from '@/lib';
import { ATTabWrapperOnChangeType } from '@/lib/types/ATForm.type';
import { ExampleComponentInterface } from '@/App';

const TabInTab = ({ ref, onChange }: ExampleComponentInterface) => {
    const tabs = [
        {
            label: 'tab1',
            tabs: [
                { label: 'tab1_1' },
                {
                    label: 'tab1_2',
                    tabs: [
                        { label: 'Tab1_2_1' },
                        { label: 'Tab1_2_2' },
                        { label: 'Tab1_2_3' }
                    ]
                }
            ]
        },
        { label: 'tab2' }
    ]

    const onTabChange: ATTabWrapperOnChangeType = (props) => {
        console.log('onTabChange', {
            props
        })
    }

    return (
        // groupDataEnabled={true}
        <ATForm ref={ref} tabs={tabs} onChange={onChange} onTabChange={onTabChange}>
            {[
                formBuilder.createTextBox({ id: 'Tab1', tabIndex: 0 }),
                formBuilder.createTextBox({ id: 'Tab2', tabIndex: 1 }),
                formBuilder.createTextBox({ id: 'Tab1_1', tabIndex: [0, 0] }),
                formBuilder.createTextBox({ id: 'Tab1_2', tabIndex: [0, 1] }),
                formBuilder.createTextBox({ id: 'Tab1_2_1', tabIndex: [0, 1, 0], groupDataID: 'Grouped1' }),
                formBuilder.createTextBox({ id: 'Tab1_2_2', tabIndex: [0, 1, 1], groupDataID: 'Grouped1' }),
                formBuilder.createTextBox({ id: 'Tab1_2_3', tabIndex: [0, 1, 2] }),
            ]}
        </ATForm>
    )
}

export default TabInTab;