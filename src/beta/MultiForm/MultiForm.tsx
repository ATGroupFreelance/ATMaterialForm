import { ATForm, formBuilder } from "@/lib";
import { useMemo } from "react";

const MultiForm = ({ ref, onChange }: any) => {
    const formJSON = useMemo(() => {
        return [
            formBuilder.createTextBox({ id: 'Name' }),                        
        ]
    }, [])

    return <ATForm ref={ref} onChange={onChange}>
        {
            formJSON
        }
    </ATForm>
}

export default MultiForm;