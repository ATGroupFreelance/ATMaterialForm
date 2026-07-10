import React from 'react';

import { AtForm, formBuilder } from '@/lib';

const Table = ({ ref, onChange }) => {
    return (
        <AtForm ref={ref} onChange={onChange} validationDisabled={true}>
            {[
                formBuilder.createTable({ id: 'Table', label: 'Documents', data: [{ a: '10', b: '2000', c: '5000' }] }),
            ]}
        </AtForm>
    )
}

export default Table;