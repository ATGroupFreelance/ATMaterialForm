import { Badge, Box, Grid, Typography } from "@mui/material";
import File from "./File/File";
import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import { useTheme } from "@mui/material";
import { AtFormFileViewerProps, AtFormFileViewerFile } from "../../../../types/ui/FileViewer.type";

const FileViewer = ({ value, label, fileWidth = 150, fileHeight = 128, getSortedFiles }: AtFormFileViewerProps) => {
    const theme = useTheme()
    const { localText } = useAtFormConfig()

    const sortedValue = getSortedFiles ? getSortedFiles(value) : value

    console.log('sortedValue', sortedValue)

    return <Box>
        <Grid container spacing={2}>
            <Grid size={12} sx={{ textAlign: 'left', justifyContent: 'start', justifySelf: 'start' }}>
                <Badge badgeContent={sortedValue.length} color="primary">
                    <DescriptionOutlined sx={theme?.atConfig?.fileViewer?.labelIcon} />
                </Badge>
                <Typography sx={{ display: 'inline-block', marginLeft: '12px' }}>
                    {label?.toUpperCase()}
                </Typography>
            </Grid>
            {
                !sortedValue.length &&
                <Grid size={12} sx={{ height: `${fileHeight}px`, justifyContent: 'center' }} >
                    <Typography>
                        {localText['There are no files to view']}
                    </Typography>
                </Grid>
            }
            <Grid size={12} sx={{ overflowY: 'hidden', overflowX: 'scroll', display: 'inline-flex' }}>
                {sortedValue?.map((item: AtFormFileViewerFile) => {
                    return <File key={item.id} {...item} width={fileWidth} height={fileHeight} />
                })}
            </Grid>
        </Grid>
    </Box>
}

export default FileViewer;