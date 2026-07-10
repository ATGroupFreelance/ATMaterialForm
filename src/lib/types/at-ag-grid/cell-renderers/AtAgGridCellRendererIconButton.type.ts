import { AtFormIconButtonProps } from "../../ui/IconButton.type";
import { AtAgGridCellRendererOnClickType, CreateAtCellRendererPropsInterface } from "../AtAgGrid.type";

export type AtAgGridIconButtonCellRendererProps = CreateAtCellRendererPropsInterface<
    AtFormIconButtonProps,
    {
        confirmationText?: string,
        onClick?: AtAgGridCellRendererOnClickType,
    }
>;
