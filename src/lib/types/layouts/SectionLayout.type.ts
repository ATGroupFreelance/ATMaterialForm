import type { BoxProps, DividerProps, GridProps } from '@mui/material';
import type { AtFormLayoutHeaderConfig } from './LayoutHeader.type';

export interface AtFormSectionLayoutConfig extends AtFormLayoutHeaderConfig {
    divider?: boolean,
    sectionProps?: BoxProps,
    dividerProps?: DividerProps,
    gridProps?: GridProps,
}
