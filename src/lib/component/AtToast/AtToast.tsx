import { toast, ToastOptions } from 'react-toastify';
import AreYouSure from './AtToastTemplates/AreYouSure/AreYouSure';

interface AtToastAreYouSureOptions extends ToastOptions {
    onYesClick?: any,
    onNoClick?: any,
}

const AtToast = {
    notify: (toastContent: any, options?: ToastOptions) => {
        toast(toastContent, options);
    },
    success: (toastContent: any, options?: ToastOptions) => {
        toast.success(toastContent, options);
    },
    error: (toastContent: any, options?: ToastOptions) => {
        toast.error(toastContent, options);
    },
    warning: (toastContent: any, options?: ToastOptions) => {
        toast.warning(toastContent, options);
    },
    info: (toastContent: any, options?: ToastOptions) => {
        toast.info(toastContent, options);
    },
    AreYouSure: (toastContent: any, options?: AtToastAreYouSureOptions) => {
        const { onYesClick, onNoClick, ...restOptions } = options || {};

        //@ts-ignore
        toast(<AreYouSure toastContent={toastContent} onYesClick={onYesClick} onNoClick={onNoClick} />, { autoClose: false, position: 'top-center', ...restOptions });
    }
}

export default AtToast;
