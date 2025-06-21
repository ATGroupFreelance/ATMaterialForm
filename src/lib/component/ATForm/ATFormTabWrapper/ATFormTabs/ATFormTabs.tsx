import { ATFormTabsOnChangeType, ATFormTabsProps } from "@/lib/types/ATFormTabsManager.type";
import { Tab, Tabs, Box } from "@mui/material";
import { useCallback, useEffect } from "react";

const ATFormTabs = ({ tabs, onTabChange, value, depth, tabContainer }: ATFormTabsProps) => {
    const selectedPath = value?.selectedTabPath
    let activeTabIndex = selectedPath ? tabs.findIndex(item => item.tabPath?.join(',') === selectedPath.slice(0, depth + 1).join(',')) : 0
    if (activeTabIndex === -1)
        activeTabIndex = 0

    const selectedTab = tabs.find((_, index) => index === activeTabIndex)
    const foundTabsProps = tabs.find(item => item.tabsProps)?.tabsProps

    console.log('ATFormTabs', {
        activeTabIndex,
        selectedTab,
        depth,
        value,
    })

    useEffect(() => {
        if (!value || !value.selectedTab || !value.selectedTabPath) {
            const selectedTab = tabs[activeTabIndex];

            if (selectedTab) {
                onTabChange({
                    event: null as any, // or undefined if your types allow
                    selectedTab,
                    selectedTabPath: selectedTab.tabPath!,
                    containerTabIndex: activeTabIndex,
                    containerTabPath: [
                        ...(value?.containerTabPath || []),
                        activeTabIndex
                    ],
                    tabContainer,
                });
            }
        }
    }, [value, tabs, tabContainer, activeTabIndex, onTabChange]);

    const onInternalChange = useCallback((event: React.SyntheticEvent, newIndex: number) => {
        const selectedTab = tabs[newIndex]

        if (!selectedTab) {
            console.warn('ATFormTabs: Tab not found for index', newIndex, 'in tabs', tabs);
            return;
        }

        const newContainerTabPath = depth === 0
            ? [newIndex] // At root level, start fresh
            : [
                ...(value?.containerTabPath || []),
                newIndex
            ];

        onTabChange(
            {
                event,
                selectedTab,
                selectedTabPath: selectedTab.tabPath!,
                containerTabIndex: newIndex,
                containerTabPath: newContainerTabPath,
                tabContainer,
            }
        )
    }, [onTabChange, depth, tabContainer, value?.containerTabPath, tabs])

    const onSubTabsChange: ATFormTabsOnChangeType = useCallback((props) => {
        onTabChange(props)
    }, [onTabChange])

    return <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
            value={activeTabIndex}
            onChange={onInternalChange}
            variant="scrollable"
            {...(foundTabsProps || {})}
        >
            {
                tabs.map(({ label, tabProps }, index) => {
                    return <Tab
                        key={'Tab' + label + index}
                        label={label}
                        sx={{
                            textTransform: 'none',
                            ...(tabProps?.sx || {})
                        }}
                        {...(tabProps || {})}
                    />
                })
            }
        </Tabs>
        {/**Handle recurisve tabs where each tab might have it's own tabs*/}
        {
            selectedTab?.tabs
            &&
            <ATFormTabs
                tabs={selectedTab.tabs}
                onTabChange={onSubTabsChange}
                value={value}
                depth={depth + 1}
                tabContainer={tabContainer}
            />
        }
    </Box >
}

export default ATFormTabs;