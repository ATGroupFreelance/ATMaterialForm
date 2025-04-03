import { ATForm, formBuilder } from "@/lib";
import { useState } from "react";

const ConditionalRender = ({ ref, onChange }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    return <ATForm ref={ref} onChange={onChange}>
        {
            formBuilder.createColumnBuilder(
                [
                    formBuilder.createTextBox({ id: 'Name', label: 'Name' }),
                    formBuilder.createButton({ id: 'ShowDatePicker', label: 'Show Date Picker', onClick: () => setShowDatePicker(!showDatePicker) }),
                    formBuilder.createButton({ id: 'SetDatePickerValue', label: 'Set Date Picker Value' }),
                ]
            )
                .addIf(showDatePicker, [
                    formBuilder.createDatePicker({ id: 'Date', label: 'Date' }),
                ])
                .build()
        }
    </ATForm>
}

export default ConditionalRender;