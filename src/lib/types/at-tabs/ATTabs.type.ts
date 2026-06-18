export interface ATTabsOnChangeProps {
    tabID: string;
}

export type ATTabOnChangeType = (
    props: ATTabsOnChangeProps
) => void;

export interface ATTabsInterface {
    activeTabID?: string;
    defaultActiveTabID?: string;
    fallbackTabID?: string;
    onTabChange?: ATTabOnChangeType,
}
