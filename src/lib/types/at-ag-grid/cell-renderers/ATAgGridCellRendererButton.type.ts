import { ATFormButtonProps } from "../../ui/Button.type";
import { CreateATCellRendererPropsInterface } from "../ATAgGrid.type";

export type ATAgGridButtonCellRendererProps = CreateATCellRendererPropsInterface<
    ATFormButtonProps,
    { confirmationText?: string }
>;