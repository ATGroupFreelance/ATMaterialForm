import React, { useCallback, useMemo, useState } from 'react';
import ATFormRender from "../ATFormRender/ATFormRender";
import UIRender from '../ATFormRender/UIRender/UIRender';
import ATFormTabs from './ATFormTabs/ATFormTabs';
import { ATFormTabConfigInterface, ATFormTabContainer, ATFormTabsManagerProps, ATFormTabsOnChangeProps } from '@/lib/types/ATFormTabsManager.type';
import { ATFormChildProps, ATFormUnknownChildProps } from '@/lib/types/ATForm.type';
import { Grid } from '@mui/material';

const getFirstIndex = (input: number | number[] | undefined | null) => {
    if (Array.isArray(input) && input.length)
        return input[0]
    else
        return input as number | undefined | null;
}

const enrichTabs = (tabs: ATFormTabConfigInterface[], parentTabPath: number[]): ATFormTabConfigInterface[] => {
    return tabs.map((item, index) => {
        const tabPath: number[] = [
            ...parentTabPath,
            index,
        ]

        return {
            ...item,
            tabs: item.tabs ? enrichTabs(item.tabs, tabPath) : item.tabs,
            tabPath,
        }
    })
}

const ATFormTabsManager = ({ tabs, children, childrenProps, onChange, defaultSelectedTabPaths }: ATFormTabsManagerProps) => {
    //TODO Add suppport for defaultSelectedTabPaths
    void defaultSelectedTabPaths;

    const enrichedTabs = useMemo(() => {
        return tabs ? enrichTabs(tabs, []) : []
    }, [tabs])

    const [selectedTabMap, setSelectedTabMap] = useState<Record<number, ATFormTabsOnChangeProps>>({});

    const onTabChange = useCallback((props: ATFormTabsOnChangeProps) => {
        setSelectedTabMap((prevState: any) => {
            const newTabStateMap = {
                ...prevState,
                [props.tabContainer.primarytabPathIndex]: {
                    ...props,
                    tabContainer: props.tabContainer
                }
            }

            if (onChange)
                onChange(newTabStateMap)

            return newTabStateMap
        })
    }, [onChange])

    /**If tabs does not exist just skip and go to render stage */
    if (!tabs)
        return <ATFormRender childrenProps={childrenProps}>
            {children}
        </ATFormRender>

    const tabContainerList: ATFormTabContainer[] = []

    let lastAddedTabContainer: ATFormTabContainer | null = null

    //null, null, 0,0 ,1,1,null,1,2,2,3
    //Create containers based on children and their tabPath please note children are not assigned to containers here.
    for (let i = 0; i < childrenProps.length; i++) {
        const currentChildProps = childrenProps[i];
        const currentTProps = currentChildProps?.tProps

        //The initial index of the current element, e.g [1,2,3] primary index is 1
        const currentPrimarytabPathIndex = getFirstIndex(currentTProps?.tabPath)

        if ((currentPrimarytabPathIndex || currentPrimarytabPathIndex === 0)) {

            const foundContainerIndex = tabContainerList.findIndex((item) => item.primarytabPathIndex === currentPrimarytabPathIndex)
            const currentTab = enrichedTabs?.find(((_, index) => index === currentPrimarytabPathIndex))

            if (currentTab) {
                const newTabContainer = {
                    primarytabPathIndex: currentPrimarytabPathIndex,
                    childIndex: i,
                    tabs: [currentTab],
                }

                //Skip If a container for a primary index is already made. we do not need to make any more containers or assign any more tabs.
                if (foundContainerIndex === -1) {
                    if (lastAddedTabContainer) {
                        const foundIndexLastTabContainer = tabContainerList.findIndex((item: any) => item.primarytabPathIndex === lastAddedTabContainer?.primarytabPathIndex)

                        if (foundIndexLastTabContainer !== -1) {
                            const foundTab = tabContainerList[foundIndexLastTabContainer].tabs.find(tab => getFirstIndex(tab.tabPath) === getFirstIndex(currentTab.tabPath))
                            if (!foundTab)
                                tabContainerList[foundIndexLastTabContainer].tabs.push({
                                    ...currentTab,
                                })
                        }
                        else {
                            tabContainerList.push(
                                newTabContainer
                            )

                            lastAddedTabContainer = {
                                ...newTabContainer
                            }
                        }

                    }
                    else {
                        tabContainerList.push(
                            newTabContainer
                        )

                        lastAddedTabContainer = {
                            ...newTabContainer
                        }
                    }
                }

            }
            else {
                // console.warn('ATFormTabWrapper: Tab not found for index', currentPrimarytabPathIndex, 'in tabs', enrichedTabs)
                lastAddedTabContainer = null
            }
        }
        else
            lastAddedTabContainer = null
    }

    // console.log('tabStateMap arrayOfGroups', {
    //     childrenIdList: childrenProps.map((item: any) => item.tProps.id),
    //     tabContainerList,
    //     enrichedTabs,
    //     children,
    //     childrenProps,
    // })

    // console.log('selectedTabMap', selectedTabMap)

    const newChildrenProps: (ATFormChildProps | ATFormUnknownChildProps)[] = childrenProps.map(item => {
        const tabPath = item.tProps?.tabPath

        /**Skip childs with no tabPath */
        if (tabPath === undefined || tabPath === null || (Array.isArray(tabPath) && tabPath.length === 0))
            return item;

        const tabPathAsArray: number[] = Array.isArray(tabPath) ? tabPath as Array<number> : ((tabPath || tabPath === 0) ? [tabPath] : [])

        let isSameOrParentTabPath = false

        for (const key in selectedTabMap) {
            //Example: tabPath: [1, 2] means this item is inside the first tab and then inside the second tab within the first tab.
            //Please note if tabPath is [0, 1] an element that has tabPath [0] is also shown.
            isSameOrParentTabPath = tabPathAsArray.every(
                (val, index) => selectedTabMap[key].selectedTabPath[index] === val
            );

            if (isSameOrParentTabPath === true)
                break;
        }

        // Use `display: 'none'` to hide formChildren of unselected tabs. This ensures the values of hidden elements are retained during tab changes.
        // Avoid using conditional rendering (like skipping rendering entirely) as it would reset the values of those elements.
        // Note: To make `wrapperRenderer.props` and tabs work properly, ensure a `wrapper` is provided.
        // The default wrapper used here is MUI's `Grid`.
        return {
            ...item,
            isTabSelected: isSameOrParentTabPath,
            tProps: {
                ...(item.tProps || {}),
                wrapperRenderer: {
                    ... (item.tProps?.wrapperRenderer || {}),
                    config: {
                        ...(item.tProps?.wrapperRenderer?.config || {}),
                        sx: {
                            ... (item.tProps?.wrapperRenderer?.config?.sx || {}),
                            display: isSameOrParentTabPath ? undefined : 'none',
                        }
                    }
                }
            }
        };
    });

    return children.map((item: any, index: number) => {
        const foundTabContainer = tabContainerList.find((tab) => tab.childIndex === index)

        return <React.Fragment key={newChildrenProps[index]?.tProps?.id || index}>
            {
                foundTabContainer &&
                <Grid size={12}>
                    <ATFormTabs
                        tabs={foundTabContainer.tabs}
                        onTabChange={onTabChange}
                        value={selectedTabMap[foundTabContainer.primarytabPathIndex]}
                        depth={0}
                        tabContainer={foundTabContainer}
                    />
                </Grid>
            }
            <UIRender childProps={newChildrenProps[index]}>
                {item}
            </UIRender>
        </React.Fragment>
    })
}

export default ATFormTabsManager;