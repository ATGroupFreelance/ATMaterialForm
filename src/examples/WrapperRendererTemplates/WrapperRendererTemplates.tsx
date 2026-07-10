import { AtForm, formBuilder } from "@/lib";
import { ExampleComponentInterface } from '@/App';

const WrapperRendererTemplates = ({ ref, onChange }: ExampleComponentInterface) => {
    return (
        <AtForm ref={ref} onChange={onChange} validationDisabled={false}>
            {
                formBuilder.utils.createFieldDefBuilder(
                    [
                        formBuilder.createTextBox({ id: "Text1", wrapperRenderer: { renderer: "Collapse", config: { defaultOpen: true } } }),
                        formBuilder.createButton({ id: "Button" }),
                        formBuilder.createTextBox({ id: "Text2", wrapperRenderer: { renderer: "ButtonDialog" } }),
                        formBuilder.createTextBox({ id: "Text3" }),
                        formBuilder.createTextBox({ id: "Text4" }),
                    ]
                )
                    .buildAtForm()
            }
        </AtForm>
    )
}

export default WrapperRendererTemplates;