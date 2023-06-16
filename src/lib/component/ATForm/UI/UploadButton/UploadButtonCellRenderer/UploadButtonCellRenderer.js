import { useState } from 'react';

import localText from "lib/component/ATForm/ATFormContext/LocalText";
import Button from "../../Button/Button";
import ShowFilesDialog from "../ShowFilesDialog/ShowFilesDialog";
import { Grid, Tooltip } from '@mui/material';

const UploadButtonCellRenderer = ({ data, colDef, ...props }) => {
    const [dialog, setDialog] = useState(null)
    const [showToolTip, setShowTooltip] = useState(false)

    const files = JSON.parse(data[colDef.field] || '[]')

    const onViewFilesClick = (event, { startLoading, stopLoading, data }) => {
        startLoading()
        setShowTooltip(false)

        setDialog(<ShowFilesDialog
            files={data}
            readOnly={true}
            onClose={() => {
                stopLoading()
                setDialog(null)
            }}
        />)
    }

    return <Grid container item md={12} justifyContent={'center'} sx={{ height: '100%' }}>
        <Tooltip
            title={files.map(item => item.name).join(' , ')}
            onMouseEnter={() => { setShowTooltip(true) }}
            onMouseLeave={() => { setShowTooltip(false) }}
            open={showToolTip}
        >
            <span>
                <Button color={'secondary'} onClick={(event, { ...buttonProps }) => onViewFilesClick(event, { ...buttonProps, data: files })} sx={{ margin: '3px' }}>
                    {localText['View Files']}{` (${files.length})`}
                </Button>
            </span>
        </Tooltip>
        {dialog}
    </Grid>
}

export default UploadButtonCellRenderer;