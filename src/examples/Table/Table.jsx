import React from 'react';

import ATForm, { formBuilder } from '../../lib/component/ATForm/ATForm';

const Table = React.forwardRef(({ onChange }, forwardedRef) => {
    return (
        <ATForm ref={forwardedRef} onChange={onChange} validationDisabled={true}>
            {[
                formBuilder.createTable({ id: 'Table', label: 'Documents', data: [{ a: '10', b: '2000', c: '5000' }] }),
            ]}
        </ATForm>
    )
})

export default Table;