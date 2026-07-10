import { AtFormMinimalControlledUiProps } from "../Common.type";
import { AtFormProps } from "../AtForm.type";

export type AtFormFormProps = AtFormMinimalControlledUiProps & AtFormProps & {
    formChildren?: any[],
};
