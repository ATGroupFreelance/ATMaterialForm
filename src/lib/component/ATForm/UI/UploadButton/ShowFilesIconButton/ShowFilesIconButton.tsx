import React from 'react';

//MUI
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import Tooltip from '@mui/material/Tooltip';
import { ATFormUploadButtonShowFilesIconButtonProps } from '@/lib/types/ui/UploadButton.type';
import IconButton from '../../IconButton/IconButton';

const ShowFilesIconButton = ({ files = [], onClick, label, ...restProps }: ATFormUploadButtonShowFilesIconButtonProps) => {
    return <React.Fragment>
        <Tooltip title={label}   >
            <span>
                <IconButton disabled={!files?.length} onClick={onClick} {...restProps}>
                    <FindInPageOutlinedIcon />
                </IconButton>
            </span>
        </Tooltip>
    </React.Fragment>
}

export default ShowFilesIconButton;