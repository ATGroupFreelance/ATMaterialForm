import useAtForm from "../useAtForm/useAtForm";

export function useRequiredAtFormRuntime() {
    const { runtime } = useAtForm();

    if (!runtime) {
        throw new Error(
            "ATForm runtime is required but was not found. Make sure this component is rendered inside an ATForm with runtime enabled."
        );
    }

    return runtime;
}
