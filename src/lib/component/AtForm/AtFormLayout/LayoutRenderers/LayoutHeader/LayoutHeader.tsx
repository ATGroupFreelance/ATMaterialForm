import { Box, Divider, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { BoxProps, DividerProps } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { AtFormLayoutHeaderConfig } from '../../../../../types/layouts/LayoutHeader.type';

interface LayoutHeaderProps extends AtFormLayoutHeaderConfig {
    appearance?: 'plain' | 'surface' | 'section',
    divider?: boolean,
    dividerProps?: DividerProps,
}

const mergeSx = (defaultSx: SxProps<Theme>, sx?: SxProps<Theme>): SxProps<Theme> => {
    if (!sx) return defaultSx;

    return [
        defaultSx,
        ...(Array.isArray(sx) ? sx : [sx]),
    ] as SxProps<Theme>;
};

const getHeaderSx = (appearance: NonNullable<LayoutHeaderProps['appearance']>): SxProps<Theme> => {
    if (appearance === 'surface') {
        return {
            px: 1.75,
            py: 1.125,
            bgcolor: (theme) => alpha(
                theme.palette.primary.main,
                theme.palette.mode === 'dark' ? 0.12 : 0.055,
            ),
        };
    }

    return {};
};

const LayoutHeader = ({
    title,
    description,
    icon,
    action,
    headerProps,
    titleProps,
    descriptionProps,
    appearance = 'plain',
    divider = false,
    dividerProps,
}: LayoutHeaderProps) => {
    const hasText = title !== undefined || description !== undefined;
    const shouldRender = hasText || icon !== undefined || action !== undefined;

    if (!shouldRender)
        return null;

    const content = (
        <Box
            {...headerProps}
            sx={mergeSx({
                display: 'flex',
                alignItems: description !== undefined ? 'flex-start' : 'center',
                gap: 1,
                minWidth: 0,
                ...getHeaderSx(appearance),
            }, headerProps?.sx)}
        >
            {icon !== undefined && (
                <Box
                    sx={{
                        width: 3.5,
                        height: 3.5,
                        borderRadius: 1,
                        bgcolor: 'action.hover',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: '0 0 auto',
                        '& > svg': {
                            fontSize: '1.125rem',
                        },
                    }}
                >
                    {icon}
                </Box>
            )}

            {hasText && (
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    {title !== undefined && (
                        <Typography
                            {...titleProps}
                            variant={titleProps?.variant ?? 'subtitle2'}
                        >
                            {title}
                        </Typography>
                    )}
                    {description !== undefined && (
                        <Typography
                            {...descriptionProps}
                            variant={descriptionProps?.variant ?? 'caption'}
                            color={descriptionProps?.color ?? 'text.secondary'}
                            sx={mergeSx({
                                display: 'block',
                                mt: title !== undefined ? 0.25 : 0,
                            }, descriptionProps?.sx)}
                        >
                            {description}
                        </Typography>
                    )}
                </Box>
            )}

            {appearance === 'section' && divider && (
                <Divider
                    {...dividerProps}
                    sx={mergeSx({
                        flex: 1,
                        alignSelf: description !== undefined ? 'center' : undefined,
                        minWidth: 3,
                    }, dividerProps?.sx)}
                />
            )}

            {action !== undefined && (
                <Box sx={{ flex: '0 0 auto', alignSelf: 'center' }}>
                    {action}
                </Box>
            )}
        </Box>
    );

    if (appearance === 'surface' && divider) {
        return (
            <>
                {content}
                <Divider {...dividerProps} />
            </>
        );
    }

    return content;
};

export default LayoutHeader;
