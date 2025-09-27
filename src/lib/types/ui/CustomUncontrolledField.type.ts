import { ATFormMinimalUncontrolledUIProps } from "../Common.type";

export type ATFormCustomUncontrolledFieldProps<P = Record<string, any>> = ATFormMinimalUncontrolledUIProps & {
    component?: React.JSXElementConstructor<ATFormMinimalUncontrolledUIProps>;
} & Omit<P, keyof ATFormMinimalUncontrolledUIProps>;