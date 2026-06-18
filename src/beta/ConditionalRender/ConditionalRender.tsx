import { ATForm, formBuilder } from "@/lib";
import { useState } from "react";

const ConditionalRender = ({ ref, onChange }: any) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onSetDatePickerValueClick = () => {
        ref.current.reset({ Date: '2025-03-21' })
    }

    return <ATForm ref={ref} onChange={onChange}>
        {
            formBuilder.utils.createFieldDefBuilder(
                [
                    formBuilder.createTextBox({ id: 'Name', label: 'Name' }),
                    formBuilder.createButton({ id: 'ShowDatePicker', label: 'Show Date Picker' }, { onClick: () => setShowDatePicker(!showDatePicker) }),
                    formBuilder.createButton({ id: 'SetDatePickerValue', label: 'Set Date Picker Value' }, { onClick: onSetDatePickerValueClick }),
                ]
            )
                .addIf(showDatePicker, [
                    formBuilder.createDatePicker({ id: 'Date', label: 'Date' }),
                ])
                .buildATForm()
        }
    </ATForm>
}

export default ConditionalRender;