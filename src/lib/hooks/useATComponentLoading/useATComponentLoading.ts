import { useCallback, useState } from "react";

const useATComponentLoading = ({ loading }: { loading?: boolean }) => {
    const [internalLoading, setInternalLoading] = useState(false)

    const startLoading = useCallback(() => {
        setInternalLoading(true)
    }, [])

    const stopLoading = useCallback(() => {
        setInternalLoading(false)
    }, [])

    return {
        loading: loading ?? internalLoading,
        startLoading,
        stopLoading,
    }
}

export default useATComponentLoading;