import { Menu, MenuItem } from "@mui/material";
import useAtFormConfig from "../../../hooks/useAtFormConfig/useAtFormConfig";
// import { useState } from "react";

const AtAgGridContextMenu = ({ agEvent, onClose }: any) => {
    const { t } = useAtFormConfig();

    const handleMenuAction = async (action: any) => {
        console.log(`${action} clicked for:`, agEvent);
        onClose();


        if (action === 'Copy') {
            await navigator.clipboard.writeText(agEvent.value);
        }
    };

    return <Menu
        open={agEvent !== null}
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={
            agEvent !== null
                ? { top: agEvent.event.clientY, left: agEvent.event.clientX }
                : undefined
        }
        sx={{
            '.MuiBackdrop-root': {
                backgroundColor: 'transparent', // Make the backdrop invisible
                backdropFilter: 'none'
            }
        }}
    >
        <MenuItem onClick={() => handleMenuAction('Copy')}>{t('Copy')}</MenuItem>
        <MenuItem disabled={true} onClick={() => handleMenuAction('Export')}>{t('Export')}</MenuItem>
        <MenuItem disabled={true} onClick={() => handleMenuAction('Delete')}>{t('Delete')}</MenuItem>
    </Menu>
}

export default AtAgGridContextMenu;