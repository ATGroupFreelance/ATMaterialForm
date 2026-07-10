import { ATFormOnClickProps } from '../../../../types/Common.type';
import ATIconButton from '../../../ATForm/UI/IconButton/IconButton';
import { useCallback } from 'react';
import { ATAgGridIconButtonCellRendererProps } from '../../../../types/at-ag-grid/cell-renderers/ATAgGridCellRendererIconButton.type';
import { useATCellRenderer } from '../../../../hooks/useATCellRenderer/useATCellRenderer';

const IconButton = (props: ATAgGridIconButtonCellRendererProps) => {
    const { cellRendererParams } = useATCellRenderer(props)

    const { ["onClick"]: cellRendererParamsOnClick, ...restCellRendererParams } = cellRendererParams

    const onInternalClick = useCallback((onClickProps: ATFormOnClickProps) => {
        const latestRow = props.node.data ?? props.data;

        if (props.config?.onClick)
            props.config.onClick({ ...onClickProps, data: latestRow, cellRendererProps: { ...props, data: latestRow } })

        if (cellRendererParamsOnClick)
            cellRendererParamsOnClick({ ...onClickProps, data: props.data, cellRendererProps: { ...props, data: latestRow } })
    }, [cellRendererParamsOnClick, props])

    return <ATIconButton
        onClick={onInternalClick}
        confirmationText={props.config?.confirmationText}
        {...(props.config?.uiProps || {})}
        {...restCellRendererParams}
    />
}

export default IconButton;