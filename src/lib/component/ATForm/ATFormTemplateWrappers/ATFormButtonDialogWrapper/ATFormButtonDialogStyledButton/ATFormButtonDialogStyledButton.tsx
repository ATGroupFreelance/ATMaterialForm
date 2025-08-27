import { useTheme, alpha } from '@mui/material/styles'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Button from '../../../UI/Button/Button'
import { ATFormButtonProps } from '@/lib/types/ui/Button.type'

const ATFormButtonDialogStyledButton = ({ children, size, ...restProps }: ATFormButtonProps) => {
    const theme = useTheme()

    // If consumer sets size="small" on config.buttonProps, we match TextField small height (40px), else 56px.
    const configButtonSize = size as 'small' | 'medium' | 'large' | undefined
    const inputHeight = configButtonSize === 'small' ? 40 : 56

    return (
        <Button
            // Keep it feeling like a real button (not a combo)
            variant="outlined"
            startIcon={<OpenInNewIcon />}
            disableElevation
            sx={{
                // Match TextField vertical size for clean row alignment
                height: inputHeight,
                minHeight: inputHeight,

                // Button-y look (not a select): tonal background + crisp border, theme-aware
                borderRadius: theme.shape.borderRadius,
                textTransform: 'none',
                fontWeight: 600,
                letterSpacing: 0.2,
                px: 2.5,
                borderColor: alpha(theme.palette.primary.main, 0.38),
                backgroundColor:
                    theme.palette.mode === 'dark'
                        ? alpha(theme.palette.primary.main, 0.14)
                        : alpha(theme.palette.primary.main, 0.07),
                color:
                    theme.palette.mode === 'dark'
                        ? theme.palette.primary.light
                        : theme.palette.primary.main,

                // Hover/active/focus states tuned for accessibility and polish
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor:
                        theme.palette.mode === 'dark'
                            ? alpha(theme.palette.primary.main, 0.22)
                            : alpha(theme.palette.primary.main, 0.12),
                    boxShadow: 'none',
                },
                '&:active': {
                    transform: 'translateY(0.5px)',
                },
                '&:focus-visible': {
                    outline: `3px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                    outlineOffset: 1,
                },
            }}
            {...restProps}
        >
            {children}
        </Button>
    )
}

export default ATFormButtonDialogStyledButton
