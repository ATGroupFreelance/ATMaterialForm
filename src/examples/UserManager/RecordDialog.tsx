import { useState } from 'react';

import { Columns } from "./Columns";

import { ATFormDialog, formBuilderUtils } from '@/lib';
import { ATFormDialogProps } from '@/lib/types/ATFormDialog.type';

const RecordDialog = ({ defaultValue, onSubmitClick, onClose, ...restProps }: ATFormDialogProps) => {
    const [a, setA] = useState('')
    const [b, setB] = useState('')

    return <ATFormDialog defaultValue={defaultValue} onSubmitClick={onSubmitClick} onClose={onClose} {...restProps}>
        {
            formBuilderUtils
                .createColumnBuilder(Columns)
                .remove(['D'])
                .map(item => ({ ...item, size: 6 }))
                .override(
                    {
                        A: { uiProps: { onChange: (event: any) => setA(event.target.value) } },
                        B: { uiProps: { onChange: (event: any) => setB(event.target.value) } },
                        'A + B': { uiProps: { value: a + b } },
                    }
                )
                .build()
        }
    </ATFormDialog>
}

export default RecordDialog;