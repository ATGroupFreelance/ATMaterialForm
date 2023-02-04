import { useState } from 'react';

import { Columns } from "./Columns";

const { ATFormDialog, formBuilder } = require("lib")

const RecordDialog = ({ defaultValue, onSubmitClick, onClose }) => {
    const [a, setA] = useState('')
    const [b, setB] = useState('')

    return <ATFormDialog defaultValue={defaultValue} onSubmitClick={onSubmitClick} onClose={onClose}>
        {
            formBuilder
                .createColumnBuilder(Columns)
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