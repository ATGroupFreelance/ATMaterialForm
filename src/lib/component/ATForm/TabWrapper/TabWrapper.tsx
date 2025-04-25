import { useState } from "react";
// MUI (Material-UI)
import { Grid } from "@mui/material";
// Utils
// Components
import ATTabs from "./ATTabs/ATTabs";
import ATFormRender from "../ATFormRender/ATFormRender";
import { ATFormChildProps, ATFormUnknownChildProps, ATTabWrapper, ATTabWrapperOnChangeInterface } from "@/lib/types/ATForm.type";

const TabWrapper = ({ tabs, tabsGridProps, children, childrenProps, onChange }: ATTabWrapper) => {
    /**If tabs does not exist just skip and go to render stage */
    if (!tabs)
        return <ATFormRender childrenProps={childrenProps}>
            {children}
        </ATFormRender>


    const [selectedTabIndexArray, setSelectedTabIndexArray] = useState([0]);

    const newChildrenProps: ATFormChildProps[] | ATFormUnknownChildProps[] = childrenProps.map(item => {
        const tabIndexAsArray: number[] = Array.isArray(item?.tProps?.tabIndex) ? item.tProps.tabIndex as Array<number> : (item?.tProps?.tabIndex ? [item.tProps.tabIndex] : [])

        // If tabs are enabled and the current item does not belong to the selected tab(s), hide it.
        // Note: `tabIndex` is an array of indices to support nested tabs.
        // Example: `tabIndex: [1, 2]` means this item is inside the first tab and then inside the second tab within the first tab.
        const isSameTabPath = selectedTabIndexArray.join(',') === tabIndexAsArray.join(',')
        const isTabbableChild = !!(item?.tProps?.tabIndex || (item?.tProps?.tabIndex === 0))

        // Use `display: 'none'` to hide elements of unselected tabs. This ensures the values of hidden elements are retained during tab changes.
        // Avoid using conditional rendering (like skipping rendering entirely) as it would reset the values of those elements.
        // Note: To make `wrapperRendererProps` and tabs work properly, ensure a `wrapper` is provided.
        // The default wrapper used here is MUI's `Grid`.
        return {
            ...item,
            isTabSelected: isTabbableChild && isSameTabPath,
        };
    });

    const onInternalTabChange = (event: any, { newIndexArray, selectedTab }: ATTabWrapperOnChangeInterface) => {
        setSelectedTabIndexArray(newIndexArray);

        if (onChange) {
            if (newIndexArray.length === 1) {
                onChange(event, { newIndexArray: [newIndexArray[0]], selectedTab });
            } else {
                onChange(event, { newIndexArray, selectedTab });
            }
        }
    };

    return (
        <>
            {
                <Grid size={12} {...(tabsGridProps || {})}>
                    <ATTabs
                        tabs={tabs}
                        onTabChange={onInternalTabChange}
                    />
                </Grid>
            }
            <ATFormRender childrenProps={newChildrenProps}>
                {children}
            </ATFormRender>
        </>
    );
};

export default TabWrapper;