import { ATForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from '@/App';

const WrapperRendererTemplates = ({ ref, onChange }: ExampleComponentInterface) => {
    return (
        <ATForm ref={ref} onChange={onChange} validationDisabled={false}>
            {
                formBuilder.utils.createFieldDefBuilder(
                    [
                        formBuilder.createTextBox({ id: "Text1", wrapperRenderer: { renderer: "Collapse", props: { defaultOpen: true } } }),
                        formBuilder.createButton({ id: "Button" }),
                        formBuilder.createTextBox({ id: "Text2", wrapperRenderer: { renderer: "ButtonDialog" } }),
                        formBuilder.createTextBox({ id: "Text3" }),
                        formBuilder.createTextBox({ id: "Text4" }),
                    ]
                )
                    .buildATForm()
            }
        </ATForm>
    )
}

export default WrapperRendererTemplates;