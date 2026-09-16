import { AtFormMinimalControlledUiProps } from "../Common.type";
import { AtFormProps } from "../AtForm.type";
import { AtFormChildren } from "../AtFormLayout.type";

export type AtFormFormProps = AtFormMinimalControlledUiProps & AtFormProps & {
    formChildren?: AtFormChildren,
};
