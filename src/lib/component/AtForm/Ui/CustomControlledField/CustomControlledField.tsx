import { AtFormCustomControlledFieldProps } from '../../../../types/ui/CustomControlledField.type';

const CustomControlledField = ({ component: Component, ...restProps }: AtFormCustomControlledFieldProps) => {
    if (!Component) {
        // safe fallback — don't crash in production; warn in dev
        if (import.meta.env.DEV) {
            console.warn('CustomControlledField rendered without a component. uiProps:', restProps);
        }
        return null;
    }

    return <Component {...restProps} />
}

export default CustomControlledField;