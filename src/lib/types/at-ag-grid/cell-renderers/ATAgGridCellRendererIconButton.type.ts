import { ATFormIconButtonProps } from "../../ui/IconButton.type";
import { ATAgGridCellRendererOnClickType, CreateATCellRendererPropsInterface } from "../ATAgGrid.type";

export type ATAgGridIconButtonCellRendererProps = CreateATCellRendererPropsInterface<
    ATFormIconButtonProps,
    {
        confirmationText?: string,
        onClick?: ATAgGridCellRendererOnClickType,
    }
>;
