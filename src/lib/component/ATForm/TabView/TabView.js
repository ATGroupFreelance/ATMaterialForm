import { Tab, Tabs, Box } from "@mui/material";

const TabView = ({ tabs, activeTabIndex, onTabChange }) => {
    return <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTabIndex} onChange={onTabChange}>
            {
                tabs.map((item, index) => {
                    return <Tab key={'Tab' + item.label + index} label={item.label} sx={{ textTransform: 'none' }} />
                })
            }
        </Tabs>
    </Box>
}

export default TabView;