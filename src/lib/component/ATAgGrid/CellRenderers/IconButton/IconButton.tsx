import { ATFormOnClickProps } from '@/lib/types/Common.type';
import ATIconButton from '../../../ATForm/UI/IconButton/IconButton';
import { useCallback } from 'react';
import { ATAgGridIconButtonCellRendererProps } from '@/lib/types/at-ag-grid/cell-renderers/ATAgGridCellRendererIconButton.type';
import { useATCellRenderer } from '@/lib/hooks/useATCellRenderer/useATCellRenderer';

const IconButton = (props: ATAgGridIconButtonCellRendererProps) => {
    const { cellRendererParams } = useATCellRenderer(props)
    
    const { ["onClick"]: cellRendererParamsOnClick, ...restCellRendererParams } = cellRendererParams

    const onInternalClick = useCallback((onClickProps: ATFormOnClickProps) => {
        if (props.config?.onClick)
            props.config.onClick({ ...onClickProps, data: props.data, cellRendererProps: props })

        if (cellRendererParamsOnClick)
            cellRendererParamsOnClick({ ...onClickProps, data: props.data, cellRendererProps: props })
    }, [cellRendererParamsOnClick, props])

    return <ATIconButton
        onClick={onInternalClick}
        {...(props.config?.uiProps || {})}
        {...restCellRendererParams}
    />
}

export default IconButton;