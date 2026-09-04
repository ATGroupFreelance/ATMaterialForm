import { GlobalStyles, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { ComponentProps } from 'react';
import { ToastContainer } from 'react-toastify';

const AtToastContainer = (props: ComponentProps<typeof ToastContainer>) => {
    const theme = useTheme();
    const toastBorderRadius = typeof theme.shape.borderRadius === 'number'
        ? theme.shape.borderRadius * 2
        : theme.shape.borderRadius;

    return <>
        <GlobalStyles
            styles={{
                '.Toastify__toast-container': {
                    '--toastify-font-family': theme.typography.fontFamily,
                    '--toastify-color-light': theme.palette.background.paper,
                    '--toastify-color-dark': theme.palette.background.paper,
                    '--toastify-text-color-light': theme.palette.text.primary,
                    '--toastify-text-color-dark': theme.palette.text.primary,
                    '--toastify-color-progress-light': theme.palette.primary.main,
                    '--toastify-color-progress-dark': theme.palette.primary.main,
                },
                '.Toastify__toast-container .Toastify__toast': {
                    minHeight: 60,
                    padding: '12px 14px',
                    border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                    borderRadius: toastBorderRadius,
                    background: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.98 : 0.99),
                    color: theme.palette.text.primary,
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 16px 38px rgba(0,0,0,0.38), 0 2px 8px rgba(0,0,0,0.2)'
                        : '0 16px 38px rgba(15,23,42,0.14), 0 2px 8px rgba(15,23,42,0.06)',
                    backdropFilter: 'blur(16px)',
                    overflow: 'hidden',
                },
                '.Toastify__toast-container .Toastify__toast-body': {
                    margin: 0,
                    padding: 0,
                    gap: 10,
                    lineHeight: 1.45,
                    color: theme.palette.text.primary,
                },
                '.Toastify__toast-container .Toastify__toast-icon': {
                    width: 20,
                    marginInlineEnd: 10,
                },
                '.Toastify__toast-container .Toastify__toast--success': {
                    borderColor: alpha(theme.palette.success.main, 0.34),
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.1 : 0.06)}, ${theme.palette.background.paper} 42%)`,
                },
                '.Toastify__toast-container .Toastify__toast--success .Toastify__toast-icon': {
                    color: theme.palette.success.main,
                },
                '.Toastify__toast-container .Toastify__toast--error': {
                    borderColor: alpha(theme.palette.error.main, 0.36),
                    background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.1 : 0.055)}, ${theme.palette.background.paper} 42%)`,
                },
                '.Toastify__toast-container .Toastify__toast--error .Toastify__toast-icon': {
                    color: theme.palette.error.main,
                },
                '.Toastify__toast-container .Toastify__toast--warning': {
                    borderColor: alpha(theme.palette.warning.main, 0.38),
                    background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, theme.palette.mode === 'dark' ? 0.1 : 0.06)}, ${theme.palette.background.paper} 42%)`,
                },
                '.Toastify__toast-container .Toastify__toast--warning .Toastify__toast-icon': {
                    color: theme.palette.warning.main,
                },
                '.Toastify__toast-container .Toastify__toast--info': {
                    borderColor: alpha(theme.palette.info.main, 0.34),
                    background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, theme.palette.mode === 'dark' ? 0.1 : 0.055)}, ${theme.palette.background.paper} 42%)`,
                },
                '.Toastify__toast-container .Toastify__toast--info .Toastify__toast-icon': {
                    color: theme.palette.info.main,
                },
                '.Toastify__toast-container .Toastify__toast-icon svg': {
                    fill: 'currentColor',
                },
                '.Toastify__toast-container .Toastify__close-button': {
                    alignSelf: 'center',
                    color: theme.palette.text.secondary,
                    opacity: 0.65,
                    transition: theme.transitions.create(['opacity', 'color'], {
                        duration: theme.transitions.duration.shorter,
                    }),
                },
                '.Toastify__toast-container .Toastify__close-button:hover': {
                    color: theme.palette.text.primary,
                    opacity: 1,
                },
                '.Toastify__toast-container .Toastify__progress-bar--success': {
                    background: theme.palette.success.main,
                },
                '.Toastify__toast-container .Toastify__progress-bar--error': {
                    background: theme.palette.error.main,
                },
                '.Toastify__toast-container .Toastify__progress-bar--warning': {
                    background: theme.palette.warning.main,
                },
                '.Toastify__toast-container .Toastify__progress-bar--info': {
                    background: theme.palette.info.main,
                },
                '.Toastify__toast-container .Toastify__progress-bar': {
                    opacity: 0.8,
                },
            }}
        />
        <ToastContainer
            {...props}
            theme={theme.palette.mode}
        />
    </>
}

export default AtToastContainer;