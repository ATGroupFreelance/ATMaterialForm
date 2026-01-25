import { ExampleComponentInterface } from "@/App";
import { ATForm, formBuilder } from "@/lib";
import { ATFormChildRefInterface } from "@/lib/types/ATForm.type";
import ServiceManager from "@/serviceManager/serviceManager";
import { useRef } from "react";

const BasicForm2 = (props: ExampleComponentInterface) => {
    const mTPropsRef = useRef<ATFormChildRefInterface>(null)
    const mUIPropsRef = useRef(null)

    console.log('BasicForm2', {
        tPropsRef: mTPropsRef.current,
        uiPropsRef: mUIPropsRef.current,
    })

    const onButton1Click = () => {
        if (mTPropsRef.current?.reset) {
            console.log('calling onButton1Click')
            mTPropsRef.current?.reset()
        }
    }

    return <ATForm {...props} defaultValue={{ MyTextBox1: "Test" }}>
        {
            [
                formBuilder.createCascadeComboBox(
                    {
                        id: 'CascadeComboBox1',
                        size: 3,
                    },
                    {
                        design: [
                            {
                                id: 'Layer1',
                                options: ServiceManager.getCountries,
                                enumsKey: 'Countries',
                                size: 12
                            }
                        ]
                    }
                ),
                formBuilder.createCascadeComboBox(
                    {
                        id: 'CascadeComboBox2',
                        size: 6,
                    },
                    {
                        design: [
                            {
                                id: 'Layer1',
                                options: ServiceManager.getData_layerA,
                                enumsKey: 'layerA',
                                size: 6,
                                children: [
                                    {
                                        id: 'Layer2',
                                        options: ({ values }) => {
                                            return ServiceManager.getData_layerAB({ layerA: values?.Layer1 })
                                        },
                                        enumsKey: 'layerAB',
                                        enumsKeyParentIDField: "layerA",
                                        size: 6
                                    }
                                ]
                            }
                        ]
                    }
                ),
                 formBuilder.createContainerWithTable(
                    {
                        id: 'ContainerWithTable',
                        size: 6
                    },
                    {
                        formChildren: [
                            formBuilder.createTextBox({ id: "Test" }),
                        ]
                    }
                ),
                formBuilder.createGrid({id: "break" , size: 6}),
                formBuilder.createComboBox({ id: 'ComboBox1', size: 3 }, { options: ServiceManager.getCountries, enumsKey: 'Countries' }),
                formBuilder.createTextBox({ id: 'MyTextBox1', ref: mTPropsRef }, { ref: mUIPropsRef }),
                formBuilder.createButton({ id: 'MyButton1', label: 'Click Me to reset MyTextBox1!' }, { onClick: onButton1Click }),
                formBuilder.createMultiSelectTextBox({ id: 'MultiSelectTextBox', size: 6 }, { valueType: "number" }),                
            ]
                // .filter(item => item.tProps.id === "MultiSelectTextBox")
        }
    </ATForm>
}

export default BasicForm2;