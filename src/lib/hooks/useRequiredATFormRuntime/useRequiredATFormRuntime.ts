import useATForm from "../useATForm/useATForm";

export function useRequiredATFormRuntime() {
    const { runtime } = useATForm();

    if (!runtime) {
        throw new Error(
            "ATForm runtime is required but was not found. Make sure this component is rendered inside an ATForm with runtime enabled."
        );
    }

    return runtime;
}
