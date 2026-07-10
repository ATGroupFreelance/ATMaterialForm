import { useState } from 'react';

import { Columns } from "./Columns";

import { AtFormDialog, formBuilder } from '@/lib';
import { AtFormDialogProps } from '@/lib/types/AtFormDialog.type';

const RecordDialog = ({ defaultValue, onSubmitClick, onClose, ...restProps }: AtFormDialogProps) => {
    const [a, setA] = useState('')
    const [b, setB] = useState('')

    return <AtFormDialog defaultValue={defaultValue} onSubmitClick={onSubmitClick} onClose={onClose} {...restProps}>
        {
            formBuilder.utils
                .createFieldDefBuilder(Columns)
                .remove(['D'])
                .map(item => ({ ...item, size: 6 }))
                .override(
                    {
                        A: { uiProps: { onChange: (event: any) => setA(event.target.value) } },
                        B: { uiProps: { onChange: (event: any) => setB(event.target.value) } },
                        'A + B': { uiProps: { value: a + b } },
                    }
                )
                .buildAtForm()
        }
    </AtFormDialog>
}

export default RecordDialog;