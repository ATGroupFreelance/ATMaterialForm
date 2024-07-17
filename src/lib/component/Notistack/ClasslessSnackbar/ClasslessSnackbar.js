import { useSnackbar } from 'notistack';

let useSnackbarRef;
export const SnackbarUtilsConfigurator = () => {
    useSnackbarRef = useSnackbar();
    return null;
};

const handler = {
    success(msg, props) {
        this.toast(msg, { variant: 'success', ...(props || {}) });
    },
    warning(msg, props) {
        this.toast(msg, { variant: 'warning', ...(props || {}) });
    },
    info(msg, props) {
        this.toast(msg, { variant: 'info', ...(props || {}) });
    },
    error(msg, props) {
        this.toast(msg, { variant: 'error', ...(props || {}) });
    },
    toast(msg, { variant = 'default', ...restProps }) {
        useSnackbarRef.enqueueSnackbar(msg, { variant, autoHideDuration: 2000, ...restProps });
    },
};

export default handler;