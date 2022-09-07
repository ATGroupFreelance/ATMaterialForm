import React, { useState } from 'react';

//MUI
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
//Components
import ShowFilesDialog from './ShowFilesDialog/ShowFilesDialog';

const ShowFilesIconButton = ({ files = [], sx, onRemove }) => {    
    const [dialog, setDialog] = useState(null)

    const onShowFilesClick = () => {
        setDialog(<ShowFilesDialog onClose={() => setDialog(false)} files={files} onRemove={onRemove}/>)
    }

    return <React.Fragment>
        <Tooltip title={'Show Files'} sx={{ ...(sx || {}) }}  >
            <span>
                <IconButton disabled={!files.length} onClick={onShowFilesClick}>
                    <FindInPageOutlinedIcon />
                </IconButton>
            </span>
        </Tooltip>
        {dialog}
    </React.Fragment>
}

export default ShowFilesIconButton;