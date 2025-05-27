import { ATFormButtonProps } from "../../ui/Button.type";
import { ATAgGridCellRendererOnClickType, CreateATCellRendererPropsInterface } from "../ATAgGrid.type";

export type ATAgGridButtonCellRendererProps = CreateATCellRendererPropsInterface<
    ATFormButtonProps,
    {
        confirmationText?: string,
        onClick?: ATAgGridCellRendererOnClickType,
    }
>;