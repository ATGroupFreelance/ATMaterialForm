import { AtForm, formBuilder } from "@/lib";
import { useMemo } from "react";

const MultiForm = ({ ref, onChange }: any) => {
    const formJson = useMemo(() => {
        return [
            formBuilder.createTextBox({ id: 'Name' }),                        
        ]
    }, [])

    return <AtForm ref={ref} onChange={onChange}>
        {
            formJson
        }
    </AtForm>
}

export default MultiForm;