import { ATFormCustomControlledFieldProps } from '@/lib/types/ui/CustomControlledField.type';

const CustomControlledField = ({ component: Component, ...restProps }: ATFormCustomControlledFieldProps) => {
    if (!Component) {
        // safe fallback — don't crash in production; warn in dev
        if (process.env.NODE_ENV === 'development') {
            console.warn('CustomControlledField rendered without a component. uiProps:', restProps);
        }
        return null;
    }
    
    return <Component {...restProps} />
}

export default CustomControlledField;