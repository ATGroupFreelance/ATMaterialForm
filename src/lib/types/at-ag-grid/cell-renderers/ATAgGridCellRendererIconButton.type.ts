import { ATFormIconButtonProps } from "../../ui/IconButton.type";
import { CreateATCellRendererPropsInterface } from "../ATAgGrid.type";

export type ATAgGridIconButtonCellRendererProps = CreateATCellRendererPropsInterface<
    ATFormIconButtonProps,
    { confirmationText?: string }
>;
