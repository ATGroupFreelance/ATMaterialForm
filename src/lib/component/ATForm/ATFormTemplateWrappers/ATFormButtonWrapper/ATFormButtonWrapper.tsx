import { ATFormButtonWrapperProps } from '@/lib/types/template-wrappers/ButtonWrapper.type'
import Button from '../../UI/Button/Button'
import { Grid } from '@mui/material'
import { useCallback, useState, useMemo } from 'react'
import { ATFormWrapperProvider } from '../ATFormWrapperContext/ATFormWrapperProvider'

const ATFormButtonWrapper = ({ children, childProps, config }: ATFormButtonWrapperProps) => {
    const { size = 12, label = "Open" } = childProps.tProps
    const [listeners] = useState<Set<() => void>>(new Set())

    const activate = useCallback(() => {
        listeners.forEach(fn => fn())
    }, [listeners])

    const register = useCallback((fn: () => void) => {
        listeners.add(fn)

        return () => listeners.delete(fn)
    }, [listeners])

    const contextValue = useMemo(() => ({ register, activate }), [register, activate])

    const onInternalClick = (props: any) => {
        activate()
        config?.onClick?.(props)
    }

    return (
        <ATFormWrapperProvider value={contextValue}>
            <Grid size={size}>
                <Button {...config} onClick={onInternalClick} >
                    {label}
                </Button>
                {children}
            </Grid>
        </ATFormWrapperProvider>
    )
}

export default ATFormButtonWrapper
