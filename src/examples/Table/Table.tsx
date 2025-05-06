import React from 'react';

import { ATForm, formBuilder } from '@/lib';

const Table = ({ ref, onChange }) => {
    return (
        <ATForm ref={ref} onChange={onChange} validationDisabled={true}>
            {[
                formBuilder.createTable({ id: 'Table', label: 'Documents', data: [{ a: '10', b: '2000', c: '5000' }] }),
            ]}
        </ATForm>
    )
}

export default Table;