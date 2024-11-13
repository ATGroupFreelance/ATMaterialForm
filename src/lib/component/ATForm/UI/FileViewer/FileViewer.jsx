import { useContext } from "react";

import { Badge, Box, Grid, Typography } from "@mui/material";
import File from "./File/File";
import ATFormContext from '@/lib/component/ATForm/ATFormContext/ATFormContext';
import { DescriptionOutlined } from "@mui/icons-material";
import { useTheme } from "@emotion/react";

const FileViewer = ({ value, label, fileWidth = 150, fileHeight = 128, getSortedFiles }) => {
    const theme = useTheme()
    const { localText } = useContext(ATFormContext)

    const sortedValue = getSortedFiles ? getSortedFiles(value) : value

    return <Box>
        <Grid container spacing={2}>
            <Grid item xs={12} justifyContent={'start'} justifySelf={'start'} sx={{ textAlign: 'left' }}>
                <Badge badgeContent={sortedValue.length} color="primary">
                    <DescriptionOutlined sx={theme?.at_fileViewer?.labelIcon} />
                </Badge>
                <Typography sx={{ display: 'inline-block', marginLeft: '12px' }}>
                    {label?.toUpperCase()}
                </Typography>
            </Grid>
            {
                !sortedValue.length &&
                <Grid item xs={12} justifyContent={'center'} sx={{ height: `${fileHeight}px` }} >
                    <Typography>
                        {localText['There are no files to view']}
                    </Typography>
                </Grid>
            }
            <Grid item xs={12} sx={{ overflowY: 'hidden', overflowX: 'scroll', display: 'inline-flex' }}>
                {sortedValue.map(item => {
                    return <File key={item.id} {...item} width={fileWidth} height={fileHeight} />
                })}
            </Grid>
        </Grid>
    </Box>
}

export default FileViewer;