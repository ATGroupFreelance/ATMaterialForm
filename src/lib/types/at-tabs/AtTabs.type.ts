export interface AtTabsOnChangeProps {
    tabId: string;
}

export type AtTabOnChangeType = (
    props: AtTabsOnChangeProps
) => void;

export interface AtTabsInterface {
    activeTabId?: string;
    defaultActiveTabId?: string;
    fallbackTabId?: string;
    onTabChange?: AtTabOnChangeType,
}
