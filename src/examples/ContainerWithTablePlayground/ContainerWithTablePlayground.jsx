import React, { useEffect, useRef, useState } from 'react';

import ATForm, { formBuilder } from '../../lib/component/ATForm/ATForm';
import ComboBox from '@/lib/component/ATForm/UI/ComboBox/ComboBox';
import { Grid } from '@mui/material'

const ContainerWithTablePlayground = ({ onChange }) => {
    const formRef = useRef(null)
    const data = useRef({ 1: { ContainerWithTable: [{ Name: '1A' }, { Name: '1B' }] } })
    const [round, setRound] = useState(null)

    useEffect(() => {
        if (formRef && round) {
            formRef.current.reset(data.current[round.id], true, true)
        }
    }, [round])

    const onFormChange = ({ formDataSemiKeyValue }) => {
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
                    <ATForm ref={formRef} onChange={onFormChange}>
                        {[
                            formBuilder.createContainerWithTable({
                                id: 'ContainerWithTable',
                                elements: [
                                    formBuilder.createTextBox({ id: 'Name', size: 9 }),
                                    formBuilder.createUploadButton({ id: 'UploadFiles', size: 3 }),
                                ],
                            }),
                        ]}
                    </ATForm>
                }
            </Grid>
        </>
    )
}

export default ContainerWithTablePlayground;