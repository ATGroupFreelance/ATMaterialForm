import { ATFormMinimalControlledUIProps } from "../Common.type";
import { ATFormProps } from "../ATForm.type";

export type ATFormFormProps = ATFormMinimalControlledUIProps & ATFormProps & {
    elements?: any[],
};
