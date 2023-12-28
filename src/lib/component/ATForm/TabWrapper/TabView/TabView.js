import { Tab, Tabs, Box } from "@mui/material";
import { useState } from "react";

const TabView = ({ tabs, onTabChange }) => {
    const [activeTabIndex, setActiveTabIndex] = useState(0)

    const onInternalTabChange = (event, newIndex, selectedTab) => {
        setActiveTabIndex(newIndex)

        const getIndexArray = (newIndex, selectedTab) => {
            const result = [
                newIndex,
            ]

            if (selectedTab?.tabs)
                result.push(0)

            return result
        }

        if (onTabChange) {
            onTabChange(event, getIndexArray(newIndex, selectedTab), selectedTab)
        }
    }

    const onTabViewChange = (event, newIndexArray, selectedTab) => {
        const output = [
            activeTabIndex,
            ...newIndexArray
        ]

        if (onTabChange) {
            onTabChange(event, output, selectedTab)
        }
    }

    const selectedTab = tabs.find((item, index) => index === activeTabIndex)

    return <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTabIndex} onChange={(event, newIndex) => onInternalTabChange(event, newIndex, { ...tabs[newIndex] })} variant="scrollable">
            {
                tabs.map(({ label, sx, tabs, ...restItem }, index) => {
                    return <Tab key={'Tab' + label + index} label={label} sx={{ textTransform: 'none', ...(sx || {}) }} {...restItem} />
                })
            }
        </Tabs>
        {
            selectedTab?.tabs
            &&
            <TabView tabs={selectedTab.tabs} onTabChange={onTabViewChange} />
        }
    </Box>
}

export default TabView;