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
    /**If tabs does not exist just skip and go to render stage */
    if (!tabs)
        return <ATFormRender childrenProps={childrenProps}>
            {children}
        </ATFormRender>

    const enrichedTabs = useMemo(() => {
        return enrichTabs(tabs, [])
    }, [tabs])

    const tabContainerList: ATFormTabContainer[] = []

    /**Last tabPath if tab index is a number and first slot of the array if the tab index is an array of number  */
    let lastPrimarytabPathIndex = undefined
    let lastAddedTabContainer: ATFormTabContainer | null = null

    for (let i = 0; i < childrenProps.length; i++) {
        const currentChildProps = childrenProps[i];
        const currentTProps = currentChildProps?.tProps

        const currentPrimarytabPathIndex = getFirstIndex(currentTProps?.tabPath)
        /**Has tab index streak changed? */
        const hastabPathChanged = String(currentPrimarytabPathIndex) !== String(lastPrimarytabPathIndex)

        if (hastabPathChanged && (currentPrimarytabPathIndex || currentPrimarytabPathIndex === 0)) {
            const foundIndex = tabContainerList.findIndex((item) => item.primarytabPathIndex === currentPrimarytabPathIndex)
            const currentTab = enrichedTabs?.find(((_, index) => index === currentPrimarytabPathIndex))

            if (currentTab) {
                const newTabContainer = {
                    primarytabPathIndex: currentPrimarytabPathIndex,
                    childIndex: i,
                    tabs: [currentTab],
                }

                if (foundIndex === -1) {
                    if (lastAddedTabContainer) {
                        const foundIndexLastTabContainer = tabContainerList.findIndex((item: any) => item.primarytabPathIndex === lastAddedTabContainer?.primarytabPathIndex)

                        if (foundIndexLastTabContainer !== -1)
                            tabContainerList[foundIndexLastTabContainer].tabs.push({
                                ...currentTab,
                            })
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
                console.warn('ATFormTabWrapper: Tab not found for index', currentPrimarytabPathIndex, 'in tabs', enrichedTabs)
                lastAddedTabContainer = null
            }
        }
        else
            lastAddedTabContainer = null
    }

    console.log('tabStateMap arrayOfGroups', {
        childrenIdList: childrenProps.map((item: any) => item.tProps.id),
        tabContainerList,
        enrichedTabs,
        children,
        childrenProps,
    })

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

    console.log('selectedTabMap', selectedTabMap)

    const newChildrenProps: (ATFormChildProps | ATFormUnknownChildProps)[] = childrenProps.map(item => {
        const tabPath = item.tProps?.tabPath

        /**Skip childs with no tabPath */
        if (tabPath === undefined || tabPath === null)
            return item;

        const tabPathAsArray: number[] = Array.isArray(tabPath) ? tabPath as Array<number> : (tabPath ? [tabPath] : [])

        let isSameTabPath = false

        for (let key in selectedTabMap) {
            // Example: `tabPath: [1, 2]` means this item is inside the first tab and then inside the second tab within the first tab.
            isSameTabPath = selectedTabMap[key].selectedTabPath.join(',') === tabPathAsArray.join(',')

            if (isSameTabPath === true)
                break;
        }

        // Use `display: 'none'` to hide elements of unselected tabs. This ensures the values of hidden elements are retained during tab changes.
        // Avoid using conditional rendering (like skipping rendering entirely) as it would reset the values of those elements.
        // Note: To make `wrapperRendererProps` and tabs work properly, ensure a `wrapper` is provided.
        // The default wrapper used here is MUI's `Grid`.
        return {
            ...item,
            isTabSelected: isSameTabPath,
            tProps: {
                ...(item.tProps || {}),
                wrapperRendererProps: {
                    ... (item.tProps?.wrapperRendererProps || {}),
                    sx: {
                        ... (item.tProps?.wrapperRendererProps?.sx || {}),
                        display: isSameTabPath ? undefined : 'none',
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
                </Grid>}
            <UIRender childProps={newChildrenProps[index]}>
                {item}
            </UIRender>
        </React.Fragment>
    })
}

export default ATFormTabsManager;