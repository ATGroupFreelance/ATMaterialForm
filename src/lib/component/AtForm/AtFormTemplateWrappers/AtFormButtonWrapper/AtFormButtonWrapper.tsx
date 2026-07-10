import { AtFormButtonWrapperProps } from '../../../../types/template-wrappers/ButtonWrapper.type'
import Button from '../../Ui/Button/Button'
import { Grid } from '@mui/material'
import { useCallback, useState, useMemo } from 'react'
import { AtFormWrapperProvider } from '../AtFormWrapperContext/AtFormWrapperProvider'

const AtFormButtonWrapper = ({ children, childProps, config }: AtFormButtonWrapperProps) => {
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
        <AtFormWrapperProvider value={contextValue}>
            <Grid size={size}>
                <Button {...config} onClick={onInternalClick} >
                    {label}
                </Button>
                {children}
            </Grid>
        </AtFormWrapperProvider>
    )
}

export default AtFormButtonWrapper
