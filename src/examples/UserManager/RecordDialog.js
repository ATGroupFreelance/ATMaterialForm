import { useState } from 'react';

import { Columns } from "./Columns";

import { ATFormDialog, formBuilder } from 'lib';

const RecordDialog = ({ defaultValue, onSubmitClick, onClose }) => {
    const [a, setA] = useState('')
    const [b, setB] = useState('')

    return <ATFormDialog defaultValue={defaultValue} onSubmitClick={onSubmitClick} onClose={onClose}>
        {
            formBuilder
                .createColumnBuilder(Columns)
                .remove(['D'])
                .map(item => ({ ...item, md: 6 }))
                .override(
                    {
                        A: { onChange: (event) => setA(event.target.value) },
                        B: { onChange: (event) => setB(event.target.value) },
                        'A + B': { value: a + b },
                    }
                )
                .build()
        }
    </ATFormDialog>
}

export default RecordDialog;