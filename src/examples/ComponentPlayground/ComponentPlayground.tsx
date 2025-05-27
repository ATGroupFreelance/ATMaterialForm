import { ATForm, formBuilder, formBuilderUtils } from "@/lib";
import { ExampleComponentInterface } from '@/App';

const ComponentPlayground = ({ ref, onChange }: ExampleComponentInterface) => {
    const extraFiles = []
    for (let i = 0; i < 20; i++) {
        extraFiles.push({
            id: '10004912232' + i.toString(),
            name: `image${i}.jpg`,
            size: 17456 + i,
        })
    }
    const defaultValue = {
        FileViewer: [
            {
                id: '10004912230',
                name: 'Test.pdf',
                size: 17856,
            },
            {
                id: '10004912232',
                name: 'image.jpg',
                size: 17456,
            },
            ...extraFiles,
        ],
        FileViewer2: [
            {
                id: '10004912230',
                name: 'Test.pdf',
                size: 17856,
            },
            {
                id: '10004912232',
                name: 'image.jpg',
                size: 17456,
            },
            ...extraFiles,
        ]
    }

    return (
        <ATForm ref={ref} onChange={onChange} validationDisabled={false} defaultValue={defaultValue} >
            {
                formBuilderUtils.createColumnBuilder(
                    [
                        formBuilder.createTextBox({ id: 'Textbox_Text', size: 4 }),
                        formBuilder.createTextBox({ id: 'Textbox_Text2', size: 4 }),
                        formBuilder.createTextBox({ id: 'Textbox_Text3', size: 4 }),
                        formBuilder.createFileViewer({
                            id: 'FileViewer',
                            size: 12,
                        }),
                        formBuilder.createTextBox({ id: 'Textbox_Text4', size: 4 }),
                        formBuilder.createTextBox({ id: 'Textbox_Text5', size: 4 }),
                        formBuilder.createFileViewer({
                            id: 'FileViewer2',
                            size: 4,
                        }),
                        formBuilder.createFileViewer({
                            id: 'FileViewer3',
                            size: 4,
                        }),
                        formBuilder.createTextBox({ id: 'Textbox_Text6', size: 4 }),
                        formBuilder.createTextBox({ id: 'Textbox_Text7', size: 4 }),
                        formBuilder.createTextBox({ id: 'Textbox_Text8', size: 4 }),
                    ]
                )
                    .build()
            }
        </ATForm>
    )
}

export default ComponentPlayground;