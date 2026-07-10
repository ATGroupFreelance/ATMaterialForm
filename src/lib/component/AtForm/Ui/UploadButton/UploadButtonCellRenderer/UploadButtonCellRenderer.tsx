import { useState } from 'react';

import Button from "../../Button/Button";
import ShowFilesDialog from "../ShowFilesDialog/ShowFilesDialog";
import { Grid, Tooltip } from '@mui/material';
import localText from '../../../AtFormConfigContext/LocalText';
import { AtFormButtonFileType, AtFormUploadButtonCellRenderer } from '../../../../../types/ui/UploadButton.type';
import { AtFormOnClickType } from '../../../../../types/Common.type';

const UploadButtonCellRenderer = ({ data, colDef }: AtFormUploadButtonCellRenderer) => {
    const [dialog, setDialog] = useState<any>(null)
    const [showToolTip, setShowTooltip] = useState(false)

    const files = colDef.field ? JSON.parse(data[colDef.field] || '[]') : []

    const onViewFilesClick: AtFormOnClickType = ({ startLoading, stopLoading, data }) => {
        startLoading()
        setShowTooltip(false)

        setDialog(
            <ShowFilesDialog
                files={data}
                readOnly={true}
                onClose={() => {
                    stopLoading()
                    setDialog(null)
                }}
            />
        )
    }

    //TODO This was also item md={12} but im not sure how to impant this in Grid
    return <Grid container sx={{ height: '100%', justifyContent: 'center' }}>
        <Tooltip
            title={files.map((item: AtFormButtonFileType) => item.name).join(' , ')}
            onMouseEnter={() => { setShowTooltip(true) }}
            onMouseLeave={() => { setShowTooltip(false) }}
            open={showToolTip}
        >
            <span>
                <Button color={'secondary'} onClick={(buttonProps) => onViewFilesClick({ ...buttonProps, data: files })} sx={{ margin: '3px' }}>
                    {localText['View Files']}{` (${files.length})`}
                </Button>
            </span>
        </Tooltip>
        {dialog}
    </Grid>
}

export default UploadButtonCellRenderer;