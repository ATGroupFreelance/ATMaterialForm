import React from 'react';

//MUI
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const ShowFilesIconButton = ({ files = [], sx, onClick, label }) => {
    return <React.Fragment>
        <Tooltip title={label} sx={{ ...(sx || {}) }}  >
            <span>
                <IconButton disabled={!files.length} onClick={onClick}>
                    <FindInPageOutlinedIcon />
                </IconButton>
            </span>
        </Tooltip>
    </React.Fragment>
}

export default ShowFilesIconButton;