import { Badge, Box, Grid, Typography } from "@mui/material";
import File from "./File/File";
import useATFormProvider from '../../../../hooks/useATFormProvider/useATFormProvider';
import { DescriptionOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material";

const FileViewer = ({ value, label, fileWidth = 150, fileHeight = 128, getSortedFiles }) => {
    const theme = useTheme()
    const { localText } = useATFormProvider()

    const sortedValue = getSortedFiles ? getSortedFiles(value) : value

    return <Box>
        <Grid container spacing={2}>
            <Grid size={12} justifyContent={'start'} justifySelf={'start'} sx={{ textAlign: 'left' }}>
                <Badge badgeContent={sortedValue.length} color="primary">
                    <DescriptionOutlined sx={theme?.atConfig?.fileViewer?.labelIcon} />
                </Badge>
                <Typography sx={{ display: 'inline-block', marginLeft: '12px' }}>
                    {label?.toUpperCase()}
                </Typography>
            </Grid>
            {
                !sortedValue.length &&
                <Grid size={12} justifyContent={'center'} sx={{ height: `${fileHeight}px` }} >
                    <Typography>
                        {localText['There are no files to view']}
                    </Typography>
                </Grid>
            }
            <Grid size={12} sx={{ overflowY: 'hidden', overflowX: 'scroll', display: 'inline-flex' }}>
                {sortedValue.map(item => {
                    return <File key={item.id} {...item} width={fileWidth} height={fileHeight} />
                })}
            </Grid>
        </Grid>
    </Box>
}

export default FileViewer;