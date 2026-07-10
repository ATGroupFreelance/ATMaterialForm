import { AtFormOnClickProps } from '../../../../types/Common.type';
import AtIconButton from '../../../AtForm/Ui/IconButton/IconButton';
import { useCallback } from 'react';
import { AtAgGridIconButtonCellRendererProps } from '../../../../types/at-ag-grid/cell-renderers/AtAgGridCellRendererIconButton.type';
import { useAtCellRenderer } from '../../../../hooks/useAtCellRenderer/useAtCellRenderer';

const IconButton = (props: AtAgGridIconButtonCellRendererProps) => {
    const { cellRendererParams } = useAtCellRenderer(props)

    const { ["onClick"]: cellRendererParamsOnClick, ...restCellRendererParams } = cellRendererParams

    const onInternalClick = useCallback((onClickProps: AtFormOnClickProps) => {
        const latestRow = props.node.data ?? props.data;

        if (props.config?.onClick)
            props.config.onClick({ ...onClickProps, data: latestRow, cellRendererProps: { ...props, data: latestRow } })

        if (cellRendererParamsOnClick)
            cellRendererParamsOnClick({ ...onClickProps, data: props.data, cellRendererProps: { ...props, data: latestRow } })
    }, [cellRendererParamsOnClick, props])

    return <AtIconButton
        onClick={onInternalClick}
        confirmationText={props.config?.confirmationText}
        {...(props.config?.uiProps || {})}
        {...restCellRendererParams}
    />
}

export default IconButton;