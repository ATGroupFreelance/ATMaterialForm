import React, { useMemo } from 'react';
import {
    Tabs,
    Tab,
} from '@mui/material';
import { ATTabsProps } from './ATTabs.type';

const ATTabs = ({ tabs, activeTabID, onTabChange, sx }: ATTabsProps) => {
    const visibleTabs = useMemo(
        () => tabs.filter((tab) => !tab.hidden),
        [tabs]
    );

    if (visibleTabs.length === 0) {
        return null;
    }

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        onTabChange?.({ tabID: newValue });
    };

    const selectedTab = visibleTabs.find(tab => tab.id === activeTabID) ?? visibleTabs[0];

    return <Tabs
        value={selectedTab.id}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        textColor="primary"
        indicatorColor="primary"
        sx={{
            minHeight: 48,
            ...sx,
            '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontWeight: 600,
            },
        }}
    >
        {visibleTabs.map((tab) => (
            <Tab
                key={tab.id}
                value={tab.id}
                label={tab.label}
                disabled={tab.disabled}
            />
        ))}
    </Tabs>
};

export default ATTabs;