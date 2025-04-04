import { ATForm, formBuilder } from "@/lib";
// import TextBox from "@/lib/component/ATForm/UI/TextBox/TextBox";
// import { Grid } from "@mui/material";
import { useMemo } from "react";

const MultiForm = ({ ref, onChange }) => {
    const formJSON = useMemo(() => {
        return [
            formBuilder.createTextBox({ id: 'Name', label: 'Name' }),
            // <TextBox key={'name2'} id={'Name2'} label={'Name2'} />,

            // <Grid key='name3grid'>
            //     {
            //         [
            //             formBuilder.createTextBox({id: 'Name3', label: 'Name3' }),
            //         ]
            //     }    
            // </Grid>
        ]
    }, [])

    return <ATForm ref={ref} onChange={onChange}>
        {/* <Grid skipForm={true}>
                    Test
                </Grid> */}
        {

            formJSON
        }
    </ATForm>
}

export default MultiForm;