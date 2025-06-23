import { ATForm, formBuilder, formBuilderUtils } from "@/lib";
import { useState } from "react";

const ConditionalRender = ({ ref, onChange }: any) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    return <ATForm ref={ref} onChange={onChange}>
        {
            formBuilderUtils.createFieldDefinitionBuilder(
                [
                    formBuilder.createTextBox({ id: 'Name', label: 'Name' }),
                    formBuilder.createButton({ id: 'ShowDatePicker', label: 'Show Date Picker' }, { onClick: () => setShowDatePicker(!showDatePicker) }),
                    formBuilder.createButton({ id: 'SetDatePickerValue', label: 'Set Date Picker Value' }, { onClick: () => ref.current.reset({ Date: '2025-03-21' }) }),
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