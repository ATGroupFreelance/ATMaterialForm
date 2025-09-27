import { ATFormCustomUncontrolledFieldProps } from '@/lib/types/ui/CustomUncontrolledField.type';

const CustomUncontrolledField = ({ component: Component, ...restProps }: ATFormCustomUncontrolledFieldProps) => {
    if (!Component) {
        // safe fallback — don't crash in production; warn in dev
        if (process.env.NODE_ENV === 'development') {
            console.warn('CustomControlledField rendered without a component. uiProps:', restProps);
        }
        return null;
    }

    return <Component {...restProps} />
}

export default CustomUncontrolledField;