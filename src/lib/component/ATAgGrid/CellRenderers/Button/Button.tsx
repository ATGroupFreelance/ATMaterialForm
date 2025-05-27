import ATButton from "../../../ATForm/UI/Button/Button";
import { ATAgGridButtonCellRendererProps } from "@/lib/types/at-ag-grid/cell-renderers/ATAgGridCellRendererButton.type";
import { useATCellRenderer } from "../../../../hooks/useATCellRenderer/useATCellRenderer";
import { useCallback } from "react";
import { ATFormOnClickProps } from "@/lib/types/Common.type";

const Button = (props: ATAgGridButtonCellRendererProps) => {
    const { label, cellRendererParams } = useATCellRenderer(props)

    const { ["onClick"]: cellRendererParamsOnClick, ...restCellRendererParams } = cellRendererParams

    const onInternalClick = useCallback((onClickProps: ATFormOnClickProps) => {
        if (props.config?.onClick)
            props.config.onClick({ ...onClickProps, data: props.data, cellRendererProps: props })

        if (cellRendererParamsOnClick)
            cellRendererParamsOnClick({ ...onClickProps, cellRendererProps: props })
    }, [props.config?.onClick, cellRendererParamsOnClick, props])

    return <ATButton
        onClick={onInternalClick}
        {...(props.config?.uiProps || {})}
        {...(restCellRendererParams || {})}
    >
        {label}
    </ATButton>
}

export default Button;  