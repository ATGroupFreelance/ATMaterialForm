import { useATCellRenderer } from "@/lib/hooks/useATCellRenderer/useATCellRenderer";
import { ATAgGridAvatarCellRendererProps } from "@/lib/types/at-ag-grid/cell-renderers/ATAgGridCellRendererAvatar.type";
import MUIAvatar from "@mui/material/Avatar";

const Avatar = (props: ATAgGridAvatarCellRendererProps) => {
    const { cellRendererParams } = useATCellRenderer(props)

    return <MUIAvatar
        {...props.config?.uiProps || {}}
        {...cellRendererParams}
    />
}

export default Avatar;