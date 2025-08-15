import { TabProps, TabsProps } from "@mui/material";
import { ATFormChildProps, ATFormUnknownChildProps } from "./ATForm.type";

/**Material UI Grid is used as the default wrapperRenderer */
export interface ATFormTabConfigInterface {
    label: string,
    wrapperRenderer?: any,
    tabs?: ATFormTabConfigInterface[],
    tabProps?: TabProps,
    /**The props for the container of all the tabs, only the first instance of this props is used in an array of tabs */
    tabsProps?: TabsProps,    
    /**This is autofilled and is not provided by the user */
    tabPath?: number[],
}

export interface ATFormTabsProps {
    tabs: ATFormTabConfigInterface[],
    onTabChange: ATFormTabsOnChangeType,
    value: ATFormTabsOnChangeProps,
    depth: number,
    tabContainer: ATFormTabContainer,
}

export type ATFormTabsManagerDefaultSelectedTabPathsType = number[][]

export interface ATFormTabsManagerProps {
    tabs?: ATFormTabConfigInterface[],
    children: any,
    childrenProps: (ATFormChildProps | ATFormUnknownChildProps)[],
    onChange?: ATFormTabsOnChangeType,
    defaultSelectedTabPaths?: ATFormTabsManagerDefaultSelectedTabPathsType;
}

/** Events */
export type ATFormTabsOnChangeProps = {
    /**The event originated from the mui tabs onChange */
    event: any,
    /**The tab button that is selected */
    selectedTab: ATFormTabConfigInterface,
    /**The tab path that i used on elements, this is not related to the local tab index and does not belong to a container but the whole tab system*/
    selectedTabPath: number[],
    /**Each group of tabs are under a container these tabs are in the same row and use a local indexing system */
    tabContainer: ATFormTabContainer,
    /** Local tab index within the container */
    containerTabIndex: number,
    /** Local tab path within the container */
    containerTabPath: number[],
}

export type ATFormTabsOnChangeType = (props: ATFormTabsOnChangeProps) => void;


export interface ATFormTabContainer {
    primarytabPathIndex: number;
    /**Index of the child which the a tab container will be inserted at (before the child) */
    childIndex: number;
    tabs: any[],
}
