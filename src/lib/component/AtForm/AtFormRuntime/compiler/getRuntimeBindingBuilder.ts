export const runtimeBindingBuilder = {
    createInitialize: <T>(config: {
        target?: "uiProps" | "tProps";
        def: T;
    }) => ({
        strategy: "initialize" as const,
        target: config.target ?? "uiProps",
        ...config,
    }),
    createAction: <T>(config: {
        def: T;
    }) => ({
        strategy: "execute" as const,
        ...config,
    }),
};