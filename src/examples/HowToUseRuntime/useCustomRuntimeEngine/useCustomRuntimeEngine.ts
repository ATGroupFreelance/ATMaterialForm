import { useCallback, useEffect, useMemo, useState } from "react";
import { ATFormFieldDefInterface } from "@/lib/types/ATForm.type";
import ServiceManager from "@/serviceManager/serviceManager";
import { extractRuntimeBindings } from "@/lib/component/ATForm/ATFormRuntime/compiler/extractRuntimeBindings";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const useCustomRuntimeEngine = (
    fieldDefs: ATFormFieldDefInterface[]
) => {

    const [isInitializing, setIsInitializing] = useState(true);

    /**
     * {
     *   fieldID: {
     *      bindingKey: value
     *   }
     * }
     */
    const [runtimeState, setRuntimeState] = useState<any>({});
    console.log('#runtimeEngine',
        runtimeState
    )

    const runtimeBindings = useMemo(() => {
        return extractRuntimeBindings(fieldDefs)
    }, [fieldDefs]);

    const resolveDefinition = async (
        def: any,
        params?: any,
    ) => {

        await sleep(500);

        switch (def?.type) {

            case "static":
                return def.value;

            case "api":
                return def.apiID === 1 ? await ServiceManager.getCountries() : false

            case "database":
                return [
                    {
                        id: 1,
                        name: "Iran",
                    },
                    {
                        id: 2,
                        name: "Germany",
                    },
                ];

            default:
                return null;
        }
    };

    useEffect(() => {

        let disposed = false;

        const initialize = async () => {

            const newState: any = {};

            for (const fieldID in runtimeBindings) {

                const bindings =
                    runtimeBindings[fieldID];

                for (const bindingKey in bindings) {

                    const binding =
                        bindings[bindingKey];

                    if (
                        binding?.strategy !==
                        "initialize"
                    ) {
                        continue;
                    }

                    const value =
                        await resolveDefinition(
                            binding.def
                        );

                    newState[fieldID] ??= {};

                    newState[fieldID][bindingKey] =
                        value;
                }
            }

            if (disposed) {
                return;
            }

            setRuntimeState(newState);

            setIsInitializing(false);
        };

        initialize();

        return () => {
            disposed = true;
        };

    }, [runtimeBindings]);

    const bindingsMap = useMemo(() => {

        const result: any = {};

        Object.entries(runtimeBindings).forEach(
            ([fieldID, bindings]) => {

                const tProps: any = {};
                const uiProps: any = {};

                Object.entries(bindings as any).forEach(
                    ([bindingKey, binding]: any) => {

                        if (
                            binding.strategy !==
                            "initialize"
                        ) {
                            return;
                        }

                        const value =
                            runtimeState?.[
                            fieldID
                            ]?.[
                            bindingKey
                            ];

                        if (value === undefined) {
                            return;
                        }

                        if (
                            binding.target ===
                            "tProps"
                        ) {
                            tProps[bindingKey] =
                                value;
                        }
                        else {
                            uiProps[bindingKey] =
                                value;
                        }
                    }
                );

                result[fieldID] = {
                    tProps,
                    uiProps,
                };
            }
        );

        return result;

    }, [
        runtimeBindings,
        runtimeState,
    ]);

    const getBindings = useCallback(
        (fieldID: string) => {

            return (
                bindingsMap[fieldID]
                ?? {
                    tProps: {},
                    uiProps: {},
                }
            );

        },
        [bindingsMap],
    );

    const execute = async (
        fieldID: string,
        bindingKey: string,
        params?: any,
    ) => {

        const binding =
            runtimeBindings?.[
            fieldID
            ]?.[
            bindingKey
            ];

        if (!binding) {
            return null;
        }

        const result =
            await resolveDefinition(
                binding.def,
                params,
            );

        setRuntimeState((prev: any) => ({
            ...prev,

            [fieldID]: {
                ...prev[fieldID],

                [bindingKey]: result,
            },
        }));

        return result;
    };

    const useRuntimeState = (
        fieldID: string,
        bindingKey: string,
    ) => {

        return runtimeState?.[
            fieldID
        ]?.[
            bindingKey
        ];
    };

    return {
        isInitializing,

        getBindings,

        execute,

        useRuntimeState,
    };
};

export default useCustomRuntimeEngine;