import React from 'react';
import { ATForm, formBuilder } from '@/lib';

const TabsInForm = ({ ref, onChange }) => {
    return (
        <ATForm ref={ref} onChange={onChange} validationDisabled={false} tabs={[{ label: 'Tab Title 1' }, { label: 'Tab Title 2' }]}>
            {
                formBuilder.createColumnBuilder(
                    [
                        formBuilder.createTextBox({ id: 'imInTab2', tabIndex: 1 }),
                        formBuilder.createTextBox({ id: 'imInTab1', tabIndex: 0 }),
                    ]
                )
                    .build()
            }
        </ATForm>
    )
}

export default TabsInForm;