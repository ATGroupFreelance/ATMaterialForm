import { useCallback, useState } from "react";

const useATComponentLoading = ({ loading, disabled }: { loading?: boolean, disabled?: boolean }) => {
    const [internalLoading, setInternalLoading] = useState(loading)

    const startLoading = useCallback(() => {
        setInternalLoading(true)
    }, [])

    const stopLoading = useCallback(() => {
        setInternalLoading(false)
    }, [])

    return {
        loading: internalLoading,
        disabled,
        startLoading,
        stopLoading,
    }
}

export default useATComponentLoading;