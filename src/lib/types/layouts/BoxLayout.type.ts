import type { BoxProps, GridProps } from '@mui/material';
import type { AtFormLayoutHeaderConfig } from './LayoutHeader.type';

export type AtFormBoxLayoutAppearance = 'dashed' | 'outlined' | 'soft';

export interface AtFormBoxLayoutConfig extends AtFormLayoutHeaderConfig {
    appearance?: AtFormBoxLayoutAppearance,
    boxProps?: BoxProps,
    gridProps?: GridProps,
}
