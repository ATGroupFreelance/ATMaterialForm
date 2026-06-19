import { ExampleComponentInterface } from "@/App"
import { ATForm, formBuilder } from "@/lib"
import ServiceManager from "@/serviceManager/serviceManager"
import useCustomRuntimeEngine from "./useCustomRuntimeEngine/useCustomRuntimeEngine"
import { Button, CircularProgress } from "@mui/material"
import { useMemo, useState } from "react"
import { getRuntimeBindingBuilder } from "@/lib/component/ATForm/ATFormRuntime/compiler/getRuntimeBindingBuilder"

//This is an example on how to use the runetime system.
const HowToUseRuntime = ({ ref, onChange }: ExampleComponentInterface) => {
    const [state, setState] = useState(1)

    const fieldDefs = useMemo(() => {
        return [
            formBuilder.createTextBox({
                id: "Name",
                runtimeBindings: {
                    defaultValue: getRuntimeBindingBuilder.createInitialize({
                        target: "tProps",
                        def: {
                            type: "static",
                            value: state,
                        },
                    }),
                }
            }),
            formBuilder.createComboBox({ id: "Countries" }, { options: () => ServiceManager.getCountries(), enumsKey: "Countries" }),
            formBuilder.createComboBox({
                id: "Countries2",
                runtimeBindings: {
                    options: getRuntimeBindingBuilder.createInitialize({
                        target: "uiProps",
                        def: {
                            type: "api",
                            apiID: 1,
                        }
                    })
                }
            }),
            {
                tProps: {
                    id: "IAmReportComponent",
                    type: "ReportComponent",
                    runtimeBindings: {
                        disabled: getRuntimeBindingBuilder.createInitialize({
                            target: "uiProps",
                            def: {
                                type: "api",
                                apiID: 2,
                            },
                        }),
                        rowData: getRuntimeBindingBuilder.createAction({                            
                            def: {
                                type: "database",
                            },
                        }),
                    }
                },
                uiProps: {
                    formChildren: [
                        formBuilder.createTextBox({
                            id: "Name",
                            runtimeBindings: {
                                defaultValue: getRuntimeBindingBuilder.createInitialize({
                                    target: "tProps",
                                    def: {
                                        type: "static",
                                        value: "collision test",
                                    },
                                })
                            }
                        }),
                        formBuilder.createTextBox({
                            id: "I am Report input",
                            runtimeBindings: {
                                defaultValue: getRuntimeBindingBuilder.createInitialize({
                                    target: "tProps",
                                    def: {
                                        type: "static",
                                        value: "report test",
                                    },
                                })
                            }
                        }),
                    ]
                }
            }
        ]
    }, [state])


    const runtime = useCustomRuntimeEngine(fieldDefs)
    console.log('runtime', runtime)

    const onChangeRuntimeValue = () => {
        setState((prevValue =>
            prevValue + 1
        ))
    }

    if (runtime.isInitializing)
        return <CircularProgress />

    return <>
        <ATForm ref={ref} onChange={onChange} runtime={runtime}>
            {
                fieldDefs
            }
        </ATForm>
        <Button onClick={onChangeRuntimeValue}>
            Change runtime val
        </Button>
    </>
}

export default HowToUseRuntime