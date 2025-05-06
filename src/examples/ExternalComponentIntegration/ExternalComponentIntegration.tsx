import { ATForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from '@/App';

const ExternalComponentIntegration = ({ ref, onChange }: ExampleComponentInterface) => {
    return (
        <ATForm onChange={onChange} ref={ref}>
            {
                [
                    formBuilder.createTextBox({ id: 'Form Text Box' }),
                    {
                        tProps: {
                            id: 'CustomComponentTextField',
                            type: 'MyTextField',
                            size: 3,
                        },
                        uiProps: {
                            label: 'CustomComponentTextField'
                        }
                    }
                ]
            }
        </ATForm>
    )
}

export default ExternalComponentIntegration;