import { ATForm, formBuilder } from '@/lib';
import { ExampleComponentInterface } from '@/App';
import { ATFormTabsOnChangeType } from '@/lib/types/ATFormTabsManager.type';

const TabInTab = ({ ref, onChange }: ExampleComponentInterface) => {
    const tabs = [
        {
            label: 'tab0',
            tabs: [
                { label: 'tab0_0' },
                {
                    label: 'tab0_1',
                    tabs: [
                        { label: 'Tab0_1_0' },
                        { label: 'Tab0_1_1' },
                        { label: 'Tab0_1_2' }
                    ]
                }
            ]
        },
        { label: 'tab1' },
        { label: 'tab2' },
        { label: 'tab3' },
        { label: 'tab4' }
    ]

    const onTabChange: ATFormTabsOnChangeType = (props) => {
        console.log('onTabChange', {
            props
        })
    }

    return (
        // groupDataEnabled={true}
        <ATForm
            ref={ref}
            tabs={tabs}
            onChange={onChange}
            onTabChange={onTabChange}
            defaultSelectedTabPaths={[[0, 1, 0], [0, 1, 2], [4]]}
        >
            {[
                formBuilder.createTextBox({ id: 'NoTab_0', }),
                formBuilder.createTextBox({ id: 'NoTab_1' }),
                formBuilder.createTextBox({ id: 'Tab_0', tabPath: 0 }),
                formBuilder.createTextBox({ id: 'NoTab_2' }),
                formBuilder.createTextBox({ id: 'Tab_1', tabPath: 1 }),
                formBuilder.createTextBox({ id: 'Taba_0', tabPath: 0 }),
                formBuilder.createTextBox({ id: 'Taba_1', tabPath: 0 }),
                formBuilder.createTextBox({ id: 'NoTab_3' }),
                formBuilder.createTextBox({ id: 'Taba_2', tabPath: 2 }),
                formBuilder.createTextBox({ id: 'Tabb_2', tabPath: 2 }),
                formBuilder.createTextBox({ id: 'Taba_3', tabPath: 3 }),
                formBuilder.createTextBox({ id: 'Tabb_3', tabPath: 3 }),
                formBuilder.createTextBox({ id: 'Taba_4', tabPath: 4 }),
                formBuilder.createTextBox({ id: 'Tabb_4', tabPath: 4 }),
                formBuilder.createTextBox({ id: 'Tab_0_0', tabPath: [0, 0] }),
                formBuilder.createTextBox({ id: 'Tab_0_1', tabPath: [0, 1] }),
                formBuilder.createTextBox({ id: 'Tab_0_1_00', tabPath: [0, 1, 0], groupDataID: 'Grouped1' }),
                formBuilder.createTextBox({ id: 'Tab_0_1_1', tabPath: [0, 1, 1], groupDataID: 'Grouped1' }),
                formBuilder.createTextBox({ id: 'Tab_0_1_2', tabPath: [0, 1, 2] }),
                formBuilder.createTextBox({ id: 'NoTab_5' }),
                formBuilder.createTextBox({ id: 'Tabb_0', tabPath: 0 }),
            ]}
        </ATForm>
    )
}

export default TabInTab;