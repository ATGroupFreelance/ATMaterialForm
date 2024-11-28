import { useContext } from "react";

import { Badge, Box, Grid2, Typography } from "@mui/material";
import File from "./File/File";
import ATFormContext from '@/lib/component/ATForm/ATFormContext/ATFormContext';
import { DescriptionOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material";

const FileViewer = ({ value, label, fileWidth = 150, fileHeight = 128, getSortedFiles }) => {
    const theme = useTheme()
    const { localText } = useContext(ATFormContext)

    const sortedValue = getSortedFiles ? getSortedFiles(value) : value

    return <Box>
        <Grid2 container spacing={2}>
            <Grid2 size={12} justifyContent={'start'} justifySelf={'start'} sx={{ textAlign: 'left' }}>
                <Badge badgeContent={sortedValue.length} color="primary">
                    <DescriptionOutlined sx={theme?.atConfig?.fileViewer?.labelIcon} />
                </Badge>
                <Typography sx={{ display: 'inline-block', marginLeft: '12px' }}>
                    {label?.toUpperCase()}
                </Typography>
            </Grid2>
            {
                !sortedValue.length &&
                <Grid2 size={12} justifyContent={'center'} sx={{ height: `${fileHeight}px` }} >
                    <Typography>
                        {localText['There are no files to view']}
                    </Typography>
                </Grid2>
            }
            <Grid2 size={12} sx={{ overflowY: 'hidden', overflowX: 'scroll', display: 'inline-flex' }}>
                {sortedValue.map(item => {
                    return <File key={item.id} {...item} width={fileWidth} height={fileHeight} />
                })}
            </Grid2>
        </Grid2>
    </Box>
}

export default FileViewer;