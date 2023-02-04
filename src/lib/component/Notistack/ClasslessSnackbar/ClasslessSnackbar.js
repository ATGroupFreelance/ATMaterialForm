import { useSnackbar } from 'notistack';

let useSnackbarRef;
export const SnackbarUtilsConfigurator = () => {
    useSnackbarRef = useSnackbar();
    return null;
};

const handler = {
    success(msg) {
        this.toast(msg, { variant: 'success' });
    },
    warning(msg) {
        this.toast(msg, { variant: 'warning' });
    },
    info(msg) {
        this.toast(msg, { variant: 'info' });
    },
    error(msg) {
        this.toast(msg, { variant: 'error' });
    },
    toast(msg, { variant = 'default', ...restProps }) {
        useSnackbarRef.enqueueSnackbar(msg, { variant, autoHideDuration: 2000, ...restProps });
    },
};

export default handler;