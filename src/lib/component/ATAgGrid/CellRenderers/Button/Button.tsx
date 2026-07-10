import ATButton from "../../../ATForm/UI/Button/Button";
import { ATAgGridButtonCellRendererProps } from "../../../../types/at-ag-grid/cell-renderers/ATAgGridCellRendererButton.type";
import { useATCellRenderer } from "../../../../hooks/useATCellRenderer/useATCellRenderer";
import { useCallback } from "react";
import { ATFormOnClickProps } from "../../../../types/Common.type";

const Button = (props: ATAgGridButtonCellRendererProps) => {
    const { label, cellRendererParams } = useATCellRenderer(props)

    const { ["onClick"]: cellRendererParamsOnClick, ...restCellRendererParams } = cellRendererParams

    const onInternalClick = useCallback((onClickProps: ATFormOnClickProps) => {
        const latestRow = props.node.data ?? props.data;

        if (props.config?.onClick)
            props.config.onClick({ ...onClickProps, data: latestRow, cellRendererProps: { ...props, data: latestRow } })

        if (cellRendererParamsOnClick)
            cellRendererParamsOnClick({ ...onClickProps, cellRendererProps: { ...props, data: latestRow } })
    }, [cellRendererParamsOnClick, props])

    return <ATButton
        onClick={onInternalClick}
        {...(props.config?.uiProps || {})}
        {...(restCellRendererParams || {})}
    >
        {label}
    </ATButton>
}

export default Button;  