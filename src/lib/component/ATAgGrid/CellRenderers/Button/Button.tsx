import ATButton from "../../../ATForm/UI/Button/Button";
import { ATAgGridButtonCellRendererProps } from "@/lib/types/at-ag-grid/cell-renderers/ATAgGridCellRendererButton.type";
import { useATCellRenderer } from "../../../../hooks/useATCellRenderer/useATCellRenderer";
import { useCallback } from "react";
import { ATFormOnClickProps } from "@/lib/types/Common.type";

const Button = (props: ATAgGridButtonCellRendererProps) => {
    const { label, cellRendererParams } = useATCellRenderer(props)
    const { onClick, ...newUiProps } = props.config?.uiProps || {}

    const { ["onClick"]: cellRendererParamsOnClick, ...restCellRendererParams } = cellRendererParams

    const onInternalClick = useCallback((onClickProps: ATFormOnClickProps) => {
        if (onClick)
            onClick({ ...onClickProps, cellRendererProps: props })

        if (cellRendererParamsOnClick)
            cellRendererParamsOnClick({ ...onClickProps, cellRendererProps: props })
    }, [onClick, cellRendererParamsOnClick, props])

    return <ATButton
        onClick={onInternalClick}
        {...newUiProps}
        {...(restCellRendererParams || {})}
    >
        {label}
    </ATButton>
}

export default Button;  