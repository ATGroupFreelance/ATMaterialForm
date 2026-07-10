import AtButton from "../../../AtForm/Ui/Button/Button";
import { AtAgGridButtonCellRendererProps } from "../../../../types/at-ag-grid/cell-renderers/AtAgGridCellRendererButton.type";
import { useAtCellRenderer } from "../../../../hooks/useAtCellRenderer/useAtCellRenderer";
import { useCallback } from "react";
import { AtFormOnClickProps } from "../../../../types/Common.type";

const Button = (props: AtAgGridButtonCellRendererProps) => {
    const { label, cellRendererParams } = useAtCellRenderer(props)

    const { ["onClick"]: cellRendererParamsOnClick, ...restCellRendererParams } = cellRendererParams

    const onInternalClick = useCallback((onClickProps: AtFormOnClickProps) => {
        const latestRow = props.node.data ?? props.data;

        if (props.config?.onClick)
            props.config.onClick({ ...onClickProps, data: latestRow, cellRendererProps: { ...props, data: latestRow } })

        if (cellRendererParamsOnClick)
            cellRendererParamsOnClick({ ...onClickProps, cellRendererProps: { ...props, data: latestRow } })
    }, [cellRendererParamsOnClick, props])

    return <AtButton
        onClick={onInternalClick}
        {...(props.config?.uiProps || {})}
        {...(restCellRendererParams || {})}
    >
        {label}
    </AtButton>
}

export default Button;  