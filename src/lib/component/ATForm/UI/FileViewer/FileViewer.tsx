import { Badge, Box, Grid, Typography } from "@mui/material";
import File from "./File/File";
import useATFormConfig from '../../../../hooks/useATFormConfig/useATFormConfig';
import { DescriptionOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { ATFormFileViewerProps, ATFormFileViewerFile } from "@/lib/types/ui/FileViewer.type";

const FileViewer = ({ value, label, fileWidth = 150, fileHeight = 128, getSortedFiles }: ATFormFileViewerProps) => {
    const theme = useTheme()
    const { localText } = useATFormConfig()

    const sortedValue = getSortedFiles ? getSortedFiles(value) : value

    console.log('sortedValue', sortedValue)

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
                {sortedValue?.map((item: ATFormFileViewerFile) => {
                    return <File key={item.id} {...item} width={fileWidth} height={fileHeight} />
                })}
            </Grid>
        </Grid>
    </Box>
}

export default FileViewer;