import { useState } from 'react';
import { AtTabsInterface } from '../../types/at-tabs/AtTabs.type';

export const useAtTabs = ({ activeTabId, defaultActiveTabId, fallbackTabId, onTabChange }: AtTabsInterface) => {
    const [internalTabId, setInternalTabId] = useState<string>(
        defaultActiveTabId ?? fallbackTabId ?? ''
    );

    const isControlled = activeTabId !== undefined;

    const currentTabId = isControlled
        ? activeTabId
        : internalTabId;

    const setActiveTabId = (tabId: string) => {
        if (!isControlled) {
            setInternalTabId(tabId);
        }

        onTabChange?.({ tabId });
    };

    if (
        process.env.NODE_ENV !== 'production'
        && activeTabId !== undefined
        && !onTabChange
    ) {
        console.warn(
            'ATTabs is controlled but no onTabChange handler was provided.'
        );
    }

    return {
        activeTabId: currentTabId,
        setActiveTabId,
        isControlled
    }
};