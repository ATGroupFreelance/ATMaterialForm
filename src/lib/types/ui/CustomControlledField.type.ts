import { AtFormMinimalControlledUiProps } from "../Common.type";

export type AtFormCustomControlledFieldProps<P = Record<string, any>> = AtFormMinimalControlledUiProps & {
    component?: React.JSXElementConstructor<AtFormMinimalControlledUiProps>;
} & Omit<P, keyof AtFormMinimalControlledUiProps>;
