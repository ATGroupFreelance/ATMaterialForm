import { Card, CardContent, Grid } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { AtFormLayoutRendererProps } from '../../../../../types/AtFormLayout.type';
import type { AtFormCardLayoutConfig } from '../../../../../types/layouts/CardLayout.type';
import LayoutHeader from '../LayoutHeader/LayoutHeader';

const mergeSx = (defaultSx: SxProps<Theme>, sx?: SxProps<Theme>): SxProps<Theme> => {
    if (!sx) return defaultSx;

    return [
        defaultSx,
        ...(Array.isArray(sx) ? sx : [sx]),
    ] as SxProps<Theme>;
};

const CardLayout = ({ children, config }: AtFormLayoutRendererProps<AtFormCardLayoutConfig>) => {
    const {
        title,
        description,
        icon,
        action,
        appearance = 'outlined',
        headerDivider = true,
        cardProps,
        cardContentProps,
        headerProps,
        titleProps,
        descriptionProps,
        gridProps,
    } = config || {};

    const variant = cardProps?.variant ?? (appearance === 'outlined' ? 'outlined' : 'elevation');
    const elevation = cardProps?.elevation ?? (appearance === 'elevated' ? 1 : 0);

    return (
        <Card
            {...cardProps}
            variant={variant}
            elevation={elevation}
            sx={mergeSx({
                overflow: 'hidden',
                backgroundImage: 'none',
            }, cardProps?.sx)}
        >
            <LayoutHeader
                title={title}
                description={description}
                icon={icon}
                action={action}
                headerProps={headerProps}
                titleProps={titleProps}
                descriptionProps={descriptionProps}
                appearance="surface"
                divider={headerDivider}
            />

            <CardContent
                {...cardContentProps}
                sx={mergeSx({
                    p: 1.75,
                    '&:last-child': {
                        pb: 1.75,
                    },
                }, cardContentProps?.sx)}
            >
                <Grid
                    {...gridProps}
                    container
                    spacing={gridProps?.spacing ?? 1.5}
                >
                    {children}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default CardLayout;
