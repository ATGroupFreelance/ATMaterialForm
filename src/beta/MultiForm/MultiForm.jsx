import { ATForm, formBuilder } from "@/lib";
import TextBox from "@/lib/component/ATForm/UI/TextBox/TextBox";
import { Grid } from "@mui/material";

const MultiForm = ({ ref, onChange }) => {
    return <ATForm ref={ref} onChange={onChange}>
                <Grid skipForm={true}>
                    Test
                </Grid>
        {
            
            [
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
        }
    </ATForm>
}

export default MultiForm;