/**
 * AtForm runtime allows field values and actions to be resolved dynamically.
 *
 * Fields provide runtime bindings through `tProps.runtimeBindings`.
 * The runtime resolves "initialize" bindings before rendering and exposes their
 * values to AtForm through `getBindings()`. Complex components can use
 * `execute()` for on-demand bindings and `useRuntimeState()` to read a specific
 * resolved runtime value.
 *
 * Runtime field ids are based on the field's `tProps.id` and, when provided,
 * the AtForm `runtimePrefix`.
 */

export type AtFormRuntimeBinding = {
    /*
     * Definition consumed by the runtime implementation when resolving
     * or executing this binding.
     *
     * AtForm itself does not interpret this value.
     */
    def: any;

    /*
     * Where the resolved value should be applied for "initialize" bindings.
     *
     * Example:
     * target: "uiProps" + bindingKey: "disabled"
     * -> uiProps.disabled
     *
     * target: "tProps" + bindingKey: "defaultValue"
     * -> tProps.defaultValue
     */
    target?: "uiProps" | "tProps";

    /*
     * Defines how the binding is consumed.
     *
     * "initialize":
     * Resolved automatically during runtime initialization. The result is
     * stored in runtime state and later provided to AtForm through getBindings().
     *
     * "execute":
     * Resolved only when a component explicitly calls runtime.execute().
     * Useful for reports, queries, APIs, actions, and similar operations.
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
     * True while the runtime is resolving its "initialize" bindings.
     *
     * Forms can use this to wait before rendering fields whose initial
     * runtime values are not ready yet.
     */
    isInitializing: boolean;

    /*
     * Used by AtForm while rendering a field.
     *
     * Returns the runtime-resolved tProps and uiProps for the provided field.
     * AtForm merges these values with the field's existing props, allowing
     * runtime values to override or provide properties such as defaultValue,
     * options, disabled, etc.
     *
     * fieldId is the effective runtime id, which is based on:
     * runtimePrefix + tProps.id.
     */
    getBindings(
        fieldId: string,
    ): {
        tProps: Record<string, any>;

        uiProps: Record<string, any>;
    };

    /*
     * Used by runtime-aware/complex components to explicitly execute a binding.
     *
     * fieldId identifies the component and bindingKey identifies the binding
     * inside its runtimeBindings.
     *
     * An optional payload can be provided to the runtime resolver and the
     * resolved result is returned to the component.
     *
     * Example:
     * runtime.execute(reportId, "data", formData)
     */
    execute<T = any>(
        fieldId: string,
        bindingKey: string,
        payload?: any,
    ): Promise<T>;

    /*
     * Used by runtime-aware/complex components to directly read the current
     * resolved value of one runtime binding.
     *
     * Unlike getBindings(), which returns all resolved props for AtForm's
     * rendering pipeline, this provides convenient access to one specific
     * runtime value.
     *
     * Example:
     * const isDisabled = runtime.useRuntimeState<boolean>(
     *     id,
     *     "disabled",
     * );
     */
    useRuntimeState<T = any>(
        fieldId: string,
        bindingKey: string,
    ): T;

    /*
    * Returns the original configuration of one runtime binding without
    * resolving or executing it.
    *
    * Used by runtime-aware/complex components that need to inspect how a
    * binding was configured, including its def, target, and strategy.
    *
    * Unlike getBindings() and useRuntimeState(), this returns the binding
    * configuration rather than a resolved runtime value.
    *
    * Example:
    * const bindingConfig = runtime.getBindingConfig(
    *     id,
    *     "data",
    * );
    *
    * const dataSource = bindingConfig?.def.value;
    */
    getBindingConfig(
        fieldId: string,
        bindingKey: string,
    ): AtFormRuntimeBinding | undefined;
}