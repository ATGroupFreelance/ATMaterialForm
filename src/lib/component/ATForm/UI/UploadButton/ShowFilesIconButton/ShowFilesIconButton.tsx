import React from 'react';

//MUI
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const ShowFilesIconButton = ({ files = [], onClick, label, ...restProps }) => {
    return <React.Fragment>
        <Tooltip title={label}   >
            <span>
                <IconButton disabled={!files.length} onClick={onClick} {...restProps}>
                    <FindInPageOutlinedIcon />
                </IconButton>
            </span>
        </Tooltip>
    </React.Fragment>
}

export default ShowFilesIconButton;