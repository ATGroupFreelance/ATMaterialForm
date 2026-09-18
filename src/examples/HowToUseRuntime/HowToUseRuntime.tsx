import { ExampleComponentInterface } from "@/App"
import { AtForm, formBuilder } from "@/lib"
import useCustomRuntimeEngine from "./useCustomRuntimeEngine/useCustomRuntimeEngine"
import { Button, CircularProgress } from "@mui/material"
import { useMemo, useState } from "react"
import { runtimeBindingBuilder } from "@/lib/component/AtForm/AtFormRuntime/compiler/getRuntimeBindingBuilder"

//This is an example on how to use the runetime system.
const HowToUseRuntime = ({ ref, onChange }: ExampleComponentInterface) => {
    const [state, setState] = useState(1)

    const fieldDefs = useMemo(() => {
        return [
            formBuilder.createTextBox({
                id: "Name",
                runtimeBindings: {
                    defaultValue: runtimeBindingBuilder.createInitialize({
                        target: "tProps",
                        def: {
                            type: "static",
                            value: state,
                        },
                    }),
                }
            }),
            // Simple ComboBox: options come directly from the configured enum.
            formBuilder.createComboBox({ id: "Countries" }, { enumsKey: "Countries" }),
            // Data-bound ComboBox: the runtime resolves the API and injects the final option array.
            // ComboBox itself remains synchronous and data-source agnostic.
            formBuilder.createComboBox({
                id: "Countries2",
                runtimeBindings: {
                    options: runtimeBindingBuilder.createInitialize({
                        target: "uiProps",
                        def: {
                            type: "api",
                            apiId: 1,
                        }
                    })
                }
            }),
            {
                tProps: {
                    id: "IAmReportComponent",
                    type: "ReportComponent",
                    runtimeBindings: {
                        disabled: runtimeBindingBuilder.createInitialize({
                            target: "uiProps",
                            def: {
                                type: "api",
                                apiId: 2,
                            },
                        }),
                        rowData: runtimeBindingBuilder.createAction({                            
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
                                defaultValue: runtimeBindingBuilder.createInitialize({
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
                                defaultValue: runtimeBindingBuilder.createInitialize({
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
        <AtForm ref={ref} onChange={onChange} runtime={runtime}>
            {
                fieldDefs
            }
        </AtForm>
        <Button onClick={onChangeRuntimeValue}>
            Change runtime val
        </Button>
    </>
}

export default HowToUseRuntime