export type AtFormRuntimeBinding = {

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

export type AtFormRuntimeBindings = Record<
    string,
    AtFormRuntimeBinding
>;

export type AtFormRuntimeBindingsMap = Record<
    string,
    AtFormRuntimeBindings
>;

export interface AtFormRuntime {

    /*
     * Used before rendering.
     */
    isInitializing: boolean;

    /*
     * Used by ATForm.
     */
    getBindings(
        fieldId: string,
    ): {

        tProps: Record<string, any>;

        uiProps: Record<string, any>;
    };

    /*
     * Used by complex components.
     */
    execute<T = any>(
        fieldId: string,
        bindingKey: string,
        payload?: any,
    ): Promise<T>;

    /*
     * Used by complex components.
     */
    useRuntimeState<T = any>(
        fieldId: string,
        bindingKey: string,
    ): T;
}