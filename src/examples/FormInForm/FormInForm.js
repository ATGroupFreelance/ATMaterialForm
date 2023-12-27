import React from 'react';
import ATForm, { formBuilder } from '../../lib/component/ATForm/ATForm';

const FormInForm = React.forwardRef(({ onChange }, forwardRef) => {
    return (
        <ATForm ref={forwardRef} onChange={onChange} tabs={[{label: 'FormA'}, {label: 'FormB'}]}>
            {[
                formBuilder.createForm({
                    id: 'FormA',
                    tabIndex: 0,
                    elements: [
                        formBuilder.createTextBox({ id: 'A1' }),
                        formBuilder.createTextBox({ id: 'A2' }),
                        formBuilder.createTextBox({ id: 'A3' }),
                    ]
                }),
                formBuilder.createForm({
                    id: 'FormB',
                    tabIndex: 1,
                    elements: [
                        formBuilder.createTextBox({ id: 'B1' }),
                        formBuilder.createTextBox({ id: 'B2' }),
                        formBuilder.createTextBox({ id: 'B3' }),
                    ]
                }),
            ]}
        </ATForm>
    )
})

export default FormInForm;