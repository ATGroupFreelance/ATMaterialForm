import { useAtCellRenderer } from "../../../../hooks/useAtCellRenderer/useAtCellRenderer";
import { AtAgGridAvatarCellRendererProps } from "../../../../types/at-ag-grid/cell-renderers/AtAgGridCellRendererAvatar.type";
import MUIAvatar from "@mui/material/Avatar";

const Avatar = (props: AtAgGridAvatarCellRendererProps) => {
    const { cellRendererParams } = useAtCellRenderer(props)

    return <MUIAvatar
        {...props.config?.uiProps || {}}
        {...cellRendererParams}
    />
}

export default Avatar;