import { AtFormButtonProps } from "../../ui/Button.type";
import { AtAgGridCellRendererOnClickType, CreateAtCellRendererPropsInterface } from "../AtAgGrid.type";

export type AtAgGridButtonCellRendererProps = CreateAtCellRendererPropsInterface<
    AtFormButtonProps,
    {
        confirmationText?: string,
        onClick?: AtAgGridCellRendererOnClickType,
    }
>;