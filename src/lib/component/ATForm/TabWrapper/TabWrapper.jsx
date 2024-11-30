import React, { useState } from "react";
//MUI
import { Grid2 } from "@mui/material";
// Utils
import * as FormUtils from '../FormUtils/FormUtils';
//Components
import TabView from "./TabView/TabView";

const TabWrapper = ({ tabs, tabsGridProps, children, formChildrenProps, onChange }) => {
    const [selectedTabIndexArray, setSelectedTabIndexArray] = useState([0])

    // const newFormChildrenProps = formChildrenProps.map(item => {
    //     return {
    //         ...item,
    //         flexGridProps: {
    //             sx: {
    //                 ...(!tabs || (selectedTabIndexArray.join(',') === item.tabIndex.join(',')) ? {} : { display: 'none' }),
    //                 ...(item?.flexGridProps?.sx || {})
    //             },
    //             ...FormUtils.getFlexGrid(item)
    //         }
    //     }
    // })

    const onInternalTabChange = (event, newIndexArray, selectedTab) => {
        setSelectedTabIndexArray(newIndexArray)

        if (onChange) {
            if (newIndexArray.length === 1)
                onChange(event, newIndexArray[0], selectedTab)
            else
                onChange(event, newIndexArray, selectedTab)
        }
    }

    return <>
        {
            tabs
            &&
            <Grid2 size={12} {...(tabsGridProps || {})}>
                <TabView tabs={tabs} activeTabIndex={selectedTabIndexArray?.[0] || 0} onTabChange={onInternalTabChange} />
            </Grid2>
        }
        {
            FormUtils.getFlatChildren(children).map(item => {
                return React.cloneElement(item, { formChildrenProps, key: item.key })
            })
        }
    </>
}

export default TabWrapper;