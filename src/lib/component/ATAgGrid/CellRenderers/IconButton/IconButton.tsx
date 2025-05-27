import { ATFormOnClickProps } from '@/lib/types/Common.type';
import ATIconButton from '../../../ATForm/UI/IconButton/IconButton';
import { useCallback } from 'react';
import { ATAgGridIconButtonCellRendererProps } from '@/lib/types/at-ag-grid/cell-renderers/ATAgGridCellRendererIconButton.type';
import { useATCellRenderer } from '@/lib/hooks/useATCellRenderer/useATCellRenderer';

const IconButton = (props: ATAgGridIconButtonCellRendererProps) => {
    const { cellRendererParams } = useATCellRenderer(props)
    const { onClick, ...restUIProps } = props.config?.uiProps || {}

    let getCellRendererParamsProps: any = {}

    if (props.config?.getCellRendererParams) {
        getCellRendererParamsProps = props.config.getCellRendererParams(props)
    }

    const { ["onClick"]: cellRendererParamsOnClick, ...restCellRendererParams } = cellRendererParams

    const onInternalClick = useCallback((onClickProps: ATFormOnClickProps) => {
        if (onClick)
            onClick({ ...onClickProps, cellRendererProps: props })

        if (cellRendererParamsOnClick)
            cellRendererParamsOnClick({ ...onClickProps, cellRendererProps: props })
    }, [onClick, cellRendererParamsOnClick, props])

    return <ATIconButton
        onClick={onInternalClick}
        {...restUIProps}
        {...restCellRendererParams}
    />
}

export default IconButton;