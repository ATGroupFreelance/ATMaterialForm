import React from 'react';
import ATForm, { formBuilder } from '../../lib/component/ATForm/ATForm';

const TabInTab = React.forwardRef(({ onChange }, forwardRef) => {
    return (
        <ATForm ref={forwardRef} onChange={onChange}>
            {[
                formBuilder.createTextBox({ id: 'Tab1', tabIndex: 0 }),
                formBuilder.createTextBox({ id: 'Tab2', tabIndex: 1 }),
                formBuilder.createTextBox({ id: 'Tab1_1', tabIndex: [0, 0] }),
                formBuilder.createTextBox({ id: 'Tab1_2', tabIndex: [0, 1] }),
            ]}
        </ATForm>
    )
})

export default TabInTab;