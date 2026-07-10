import { useEffect, useRef, useState } from 'react';

import { AtForm, formBuilder } from "@/lib";
import ComboBox from '@/lib/component/AtForm/Ui/ComboBox/ComboBox';
import { Grid } from '@mui/material'
import { ExampleComponentInterface } from '@/App';
import { AtFormOnChangeInterface, AtFormRefInterface } from '@/lib/types/AtForm.type';

const ContainerWithTablePlayground = (props: ExampleComponentInterface) => {
    void props
    
    const formRef = useRef<AtFormRefInterface | null>(null)
    const data = useRef<any>({ 1: { ContainerWithTable: [{ Name: '1A' }, { Name: '1B' }] } })
    const [round, setRound] = useState<{ id: number; title: string } | null>(null)

    useEffect(() => {
        if (formRef?.current && round) {
            formRef.current.reset({ inputDefaultValue: data.current[round.id] })
        }
    }, [round])

    const onFormChange = ({ formDataSemiKeyValue }: AtFormOnChangeInterface) => {
        console.log('onFormChange formDataSemiKeyValue', formDataSemiKeyValue)
        // console.log('round onFormChange', round)
        // if (round) 
        //     data.current[round.id] = {
        //         ...formDataSemiKeyValue,
        //     }

        // if (onChange) {
        //     onChange({ formDataKeyValue: { ...data } })
        // }
    }

    return (
        <>
            <Grid container>
                <ComboBox options={[{ title: '1', id: 1 }, { title: '2', id: 2 }]} onChange={(event) => setRound(event.target.value)} />
            </Grid>
            <Grid container>
                {
                    round
                    &&
                    <AtForm ref={formRef} onChange={onFormChange}>
                        {[
                            formBuilder.createContainerWithTable(
                                {
                                    id: 'ContainerWithTable',
                                }
                                ,
                                {
                                    formChildren: [
                                        formBuilder.createTextBox({ id: 'Name', size: 9 }),
                                        formBuilder.createUploadButton({ id: 'UploadFiles', size: 3 }),
                                    ],
                                }
                            ),
                        ]}
                    </AtForm>
                }
            </Grid>
        </>
    )
}

export default ContainerWithTablePlayground;