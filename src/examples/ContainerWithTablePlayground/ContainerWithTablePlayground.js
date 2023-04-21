import React, { useEffect, useRef, useState } from 'react';

import ATForm, { formBuilder } from '../../lib/component/ATForm/ATForm';
import ComboBox from 'lib/component/ATForm/UI/ComboBox/ComboBox';
import { Grid } from '@mui/material'

const ContainerWithTablePlayground = ({ onChange }) => {
    const formRef = useRef(null)
    const data = useRef({ 1: { ContainerWithTable: [{ Name: '1A' }, { Name: '1B' }] } })
    const [round, setRound] = useState(null)

    useEffect(() => {
        if (formRef && round) {
            console.log('data.current[round]', data.current[round.ID])
            formRef.current.reset(data.current[round.ID], true, true)
        }
    }, [round])

    const onFormChange = ({ formDataSemiKeyValue }) => {
        // console.log('round onFormChange', round)
        // if (round) 
        //     data.current[round.ID] = {
        //         ...formDataSemiKeyValue,
        //     }

        // if (onChange) {
        //     onChange({ formDataKeyValue: { ...data } })
        // }
    }

    return (
        <>
            <Grid container item>
                <ComboBox options={[{ Title: '1', ID: 1 }, { Title: '2', ID: 2 }]} onChange={(event) => setRound(event.target.value)} />
            </Grid>
            <Grid container item >
                {
                    round
                    &&
                    <ATForm ref={formRef} onChange={onFormChange}>
                        {[
                            formBuilder.createContainerWithTable({
                                id: 'ContainerWithTable',
                                elements: [
                                    formBuilder.createTextBox({ id: 'Name' }),
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