import { useState } from 'react';
import { ATTabsInterface } from '../../types/at-tabs/ATTabs.type';

export const useATTabs = ({ activeTabID, defaultActiveTabID, fallbackTabID, onTabChange }: ATTabsInterface) => {
    const [internalTabID, setInternalTabID] = useState<string>(
        defaultActiveTabID ?? fallbackTabID ?? ''
    );

    const isControlled = activeTabID !== undefined;

    const currentTabID = isControlled
        ? activeTabID
        : internalTabID;

    const setActiveTabID = (tabID: string) => {
        if (!isControlled) {
            setInternalTabID(tabID);
        }

        onTabChange?.({ tabID });
    };

    if (
        process.env.NODE_ENV !== 'production'
        && activeTabID !== undefined
        && !onTabChange
    ) {
        console.warn(
            'ATTabs is controlled but no onTabChange handler was provided.'
        );
    }

    return {
        activeTabID: currentTabID,
        setActiveTabID,
        isControlled
    }
};