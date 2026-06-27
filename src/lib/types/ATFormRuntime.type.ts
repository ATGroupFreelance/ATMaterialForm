export type ATFormRuntimeBinding = {

    /*
     * What runtime should do.
     */
    def: any;

    /*
     * Where should the result go.
     */
    target?: "uiProps" | "tProps";

    /*
     * How is this consumed.
     */
    strategy:
    | "initialize"
    | "execute";
};

export type ATFormRuntimeBindings = Record<
    string,
    ATFormRuntimeBinding
>;

export type ATFormRuntimeBindingsMap = Record<
    string,
    ATFormRuntimeBindings
>;

export interface ATFormRuntime {

    /*
     * Used before rendering.
     */
    isInitializing: boolean;

    /*
     * Used by ATForm.
     */
    getBindings(
        fieldID: string,
    ): {

        tProps: Record<string, any>;

        uiProps: Record<string, any>;
    };

    /*
     * Used by complex components.
     */
    execute<T = any>(
        fieldID: string,
        bindingKey: string,
        payload?: any,
    ): Promise<T>;

    /*
     * Used by complex components.
     */
    useRuntimeState<T = any>(
        fieldID: string,
        bindingKey: string,
    ): T;
}