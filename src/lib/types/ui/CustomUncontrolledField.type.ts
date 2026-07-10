import { AtFormMinimalUncontrolledUiProps } from "../Common.type";

export type AtFormCustomUncontrolledFieldProps<P = Record<string, any>> = AtFormMinimalUncontrolledUiProps & {
    component?: React.JSXElementConstructor<AtFormMinimalUncontrolledUiProps>;
} & Omit<P, keyof AtFormMinimalUncontrolledUiProps>;