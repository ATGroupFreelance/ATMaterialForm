import { ExampleComponentInterface } from "@/App";
import { ATForm, formBuilder } from "@/lib";

const BasicForm2 = (props: ExampleComponentInterface) => {
    return <ATForm {...props}>
        {
            [
                formBuilder.createTextBox({ id: 'MyTextBox1', })
            ]
        }
    </ATForm>
}

export default BasicForm2;