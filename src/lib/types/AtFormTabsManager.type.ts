import { TabProps, TabsProps } from "@mui/material";
import { AtFormChildProps, AtFormUnknownChildProps, AtFormFieldErrorFallback } from "./AtForm.type";
import type { AtFormChildren } from "./AtFormLayout.type";

/**Material UI Grid is used as the default wrapperRenderer */
export interface AtFormTabConfigInterface {
    label: string,
    wrapperRenderer?: any,
    tabs?: AtFormTabConfigInterface[],
    tabProps?: TabProps,
    /**The props for the container of all the tabs, only the first instance of this props is used in an array of tabs */
    tabsProps?: TabsProps,
    /**This is autofilled and is not provided by the user */
    tabPath?: number[],
}

export interface AtFormTabsProps {
    tabs: AtFormTabConfigInterface[],
    onTabChange: AtFormTabsOnChangeType,
    value: AtFormTabsOnChangeProps,
    depth: number,
    tabContainer: AtFormTabContainer,
}

export type AtFormTabsManagerDefaultSelectedTabPathsType = number[][]

export interface AtFormTabsManagerProps {
    tabs?: AtFormTabConfigInterface[],
    children: any,
    childrenProps: (AtFormChildProps | AtFormUnknownChildProps)[],
    onChange?: AtFormTabsOnChangeType,
    defaultSelectedTabPaths?: AtFormTabsManagerDefaultSelectedTabPathsType;
    fieldErrorFallback?: AtFormFieldErrorFallback,
    layoutChildren?: AtFormChildren,
}

/** Events */
export type AtFormTabsOnChangeProps = {
    /**The event originated from the mui tabs onChange */
    event: any,
    /**The tab button that is selected */
    selectedTab: AtFormTabConfigInterface,
    /**The tab path that i used on elements, this is not related to the local tab index and does not belong to a container but the whole tab system*/
    selectedTabPath: number[],
    /**Each group of tabs are under a container these tabs are in the same row and use a local indexing system */
    tabContainer: AtFormTabContainer,
    /** Local tab index within the container */
    containerTabIndex: number,
    /** Local tab path within the container */
    containerTabPath: number[],
}

export type AtFormTabsOnChangeType = (props: AtFormTabsOnChangeProps) => void;


export interface AtFormTabContainer {
    primarytabPathIndex: number;
    /**Index of the child which the a tab container will be inserted at (before the child) */
    childIndex: number;
    tabs: any[],
}
