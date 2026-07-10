import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { AtTabOnChangeType } from '../../types/at-tabs/AtTabs.type';

export interface AtTabInterface {
    id: string;
    label: ReactNode;
    disabled?: boolean;
    hidden?: boolean;
}

export interface AtTabsProps {
    tabs: AtTabInterface[];

    activeTabId: string;

    onTabChange?: AtTabOnChangeType,

    sx?: SxProps<Theme>;
}