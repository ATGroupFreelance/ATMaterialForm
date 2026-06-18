import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { ATTabOnChangeType } from '../../types/at-tabs/ATTabs.type';

export interface ATTabInterface {
    id: string;
    label: ReactNode;
    disabled?: boolean;
    hidden?: boolean;
}

export interface ATTabsProps {
    tabs: ATTabInterface[];

    activeTabID: string;

    onTabChange?: ATTabOnChangeType,

    sx?: SxProps<Theme>;
}