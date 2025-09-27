import { ATFormMinimalControlledUIProps } from "../Common.type";

export type ATFormCustomControlledFieldProps<P = Record<string, any>> = ATFormMinimalControlledUIProps & {
    component?: React.JSXElementConstructor<ATFormMinimalControlledUIProps>;
} & Omit<P, keyof ATFormMinimalControlledUIProps>;
