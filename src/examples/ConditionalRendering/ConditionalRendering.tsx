import { ATForm, formBuilder, formBuilderUtils } from "@/lib";
import { ExampleComponentInterface } from '@/App';
import { useState } from "react";

const ConditionalRendering = ({ ref, onChange }: ExampleComponentInterface) => {
    const [conditionToggle, setCondition] = useState(false)

    const onToggleClick = () => {
        setCondition((prevState) => !prevState)
    }

    return (
        <ATForm
            ref={ref}
            onChange={onChange}
            defaultValue={{
                Name: "Test",
                Date: "2025-01-01",
            }}
        >
            {
                [
                    formBuilder.createTextBox({ id: 'Name' }),
                    ...formBuilderUtils.insertIf({
                        condition: conditionToggle,
                        elements: [
                            formBuilder.createDatePicker({ id: 'Date' }),
                        ]
                    }),
                    formBuilder.createButton({ id: "Toggle Condition" }, { onClick: onToggleClick })
                ]
            }
        </ATForm>
    )
}

export default ConditionalRendering;