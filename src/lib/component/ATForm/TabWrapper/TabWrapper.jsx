import React, { useState } from "react";
// MUI (Material-UI)
import { Grid } from "@mui/material";
// Utils
import * as FormUtils from '../FormUtils/FormUtils';
// Components
import TabView from "./TabView/TabView";

const TabWrapper = ({ tabs, tabsGridProps, children, formChildrenProps, onChange }) => {
    const [selectedTabIndexArray, setSelectedTabIndexArray] = useState([0]);

    const newFormChildrenProps = formChildrenProps.map(item => {
        const conditionalStyle = {};

        // If tabs are enabled and the current item does not belong to the selected tab(s), hide it.
        // Note: `tabIndex` is an array of indices to support nested tabs.
        // Example: `tabIndex: [1, 2]` means this item is inside the first tab and then inside the second tab within the first tab.
        if (tabs && selectedTabIndexArray.join(',') !== item.tabIndex.join(',')) {
            conditionalStyle['display'] = 'none';
        }

        // Use `display: 'none'` to hide elements of unselected tabs. This ensures the values of hidden elements are retained during tab changes.
        // Avoid using conditional rendering (like skipping rendering entirely) as it would reset the values of those elements.
        // Note: To make `wrapperRendererProps` and tabs work properly, ensure a `wrapper` is provided.
        // The default wrapper used here is MUI's `Grid`.
        return {
            ...item,
            wrapperRendererProps: {
                ...(item?.wrapperRendererProps || {}),
                sx: {
                    ...(item?.wrapperRendererProps?.sx || {}),
                    ...conditionalStyle,
                },
            }
        };
    });

    const onInternalTabChange = (event, newIndexArray, selectedTab) => {
        setSelectedTabIndexArray(newIndexArray);

        if (onChange) {            
            if (newIndexArray.length === 1) {
                onChange(event, newIndexArray[0], selectedTab);
            } else {
                onChange(event, newIndexArray, selectedTab);
            }
        }
    };

    return (
        <>
            {
                tabs &&
                <Grid size={12} {...(tabsGridProps || {})}>
                    <TabView 
                        tabs={tabs} 
                        activeTabIndex={selectedTabIndexArray?.[0] || 0} 
                        onTabChange={onInternalTabChange} 
                    />
                </Grid>
            }
            {
                FormUtils.getFlatChildren(children).map(item => {
                    // Pass the updated `formChildrenProps` to each child while preserving their keys.
                    return React.cloneElement(item, { formChildrenProps: newFormChildrenProps, key: item.key });
                })
            }
        </>
    );
};

export default TabWrapper;