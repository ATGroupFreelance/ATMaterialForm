import React from 'react';
import ATForm, { formBuilder } from '../../lib/component/ATForm/ATForm';

const TabsInForm = React.forwardRef(({ onChange }, forwardRef) => {
    return (
        <ATForm ref={forwardRef} onChange={onChange} validationDisabled={false} tabs={[{ label: 'Tab Title 1' }, { label: 'Tab Title 2' }]}>
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
})

export default TabsInForm;