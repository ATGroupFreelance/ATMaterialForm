import type { CardContentProps, CardProps, GridProps } from '@mui/material';
import type { AtFormLayoutHeaderConfig } from './LayoutHeader.type';

export type AtFormCardLayoutAppearance = 'outlined' | 'elevated';

export interface AtFormCardLayoutConfig extends AtFormLayoutHeaderConfig {
    appearance?: AtFormCardLayoutAppearance,
    headerDivider?: boolean,
    cardProps?: CardProps,
    cardContentProps?: CardContentProps,
    gridProps?: GridProps,
}
