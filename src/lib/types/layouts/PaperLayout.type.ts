import type { GridProps, PaperProps } from '@mui/material';
import type { AtFormLayoutHeaderConfig } from './LayoutHeader.type';

export type AtFormPaperLayoutAppearance = 'soft' | 'outlined' | 'elevated';

export interface AtFormPaperLayoutConfig extends AtFormLayoutHeaderConfig {
    appearance?: AtFormPaperLayoutAppearance,
    paperProps?: PaperProps,
    gridProps?: GridProps,
}
