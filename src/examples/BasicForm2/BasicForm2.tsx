import { ExampleComponentInterface } from "@/App";
import { ATForm, formBuilder } from "@/lib";
import { ATFormComponentRefInterface } from "@/lib/types/ATForm.type";
import ServiceManager from "@/serviceManager/serviceManager";
import { useRef } from "react";

const BasicForm2 = (props: ExampleComponentInterface) => {
    const mTPropsRef = useRef<ATFormComponentRefInterface>(null)
    const mUIPropsRef = useRef(null)

    console.log('BasicForm2', {
        tPropsRef: mTPropsRef.current,
        uiPropsRef: mUIPropsRef.current,
    })

    const onButton1Click = () => {
        if (mTPropsRef.current?.reset)
            mTPropsRef.current?.reset()
    }

    return <ATForm {...props}>
        {
            [
                formBuilder.createCascadeComboBox(
                    {
                        id: 'CascadeComboBox1'
                    },
                    {
                        design: [
                            {
                                id: 'Layer1',
                                options: ServiceManager.getCountries,
                                enumsKey: 'Countries',
                            }
                        ]
                    }
                ),
                formBuilder.createCascadeComboBox(
                    {
                        id: 'CascadeComboBox2'
                    },
                    {
                        design: [
                            {
                                id: 'Layer1',
                                options: ServiceManager.getData_layerA,
                                enumsKey: 'layerA',
                                children: [
                                    {
                                        id: 'Layer2',
                                        options: ({ values }) => {
                                            return ServiceManager.getData_layerAB({ layerA: values?.Layer1 })
                                        },
                                        enumsKey: 'layerAB',
                                        enumsParentKey: "layerA"
                                    }
                                ]
                            }
                        ]
                    }
                ),
                formBuilder.createComboBox({ id: 'ComboBox1' }, { options: ServiceManager.getCountries, enumsKey: 'Countries' }),
                // formBuilder.createTextBox({ id: 'MyTextBox1', ref: mTPropsRef }, { ref: mUIPropsRef }),
                formBuilder.createButton({ id: 'MyButton1', label: 'Click Me!' }, { onClick: onButton1Click }),
            ]
        }
    </ATForm>
}

export default BasicForm2;