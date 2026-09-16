import VerticalTable from './VerticalTable/VerticalTable';
import HorizontalTable from './HorizontalTable/HorizontalTable';
import { AtFormTableProps } from '../../../../types/ui/Table.type';
import { Paper, TableContainer, Typography } from '@mui/material';
import MUITable from '@mui/material/Table';
import useAtFormConfig from '../../../../hooks/useAtFormConfig/useAtFormConfig';

const Table = ({ tableType = 'Vertical', tableContainerProps, tableProps, label, labelProps, ...restProps }: AtFormTableProps) => {
    const { t } = useAtFormConfig();

    return <TableContainer component={Paper} {...(tableContainerProps || {})}>
        {label && label !== '' && (
            <Typography {...(labelProps || {})} sx={{ fontWeight: 'bold', ...(labelProps?.sx || {}) }}>
                {t(label, label)}
            </Typography>
        )}
        <MUITable  {...(tableProps || {})} sx={{ minWidth: 650, ...(tableProps?.sx || {}) }} aria-label={label}>
            {tableType === 'Vertical' ? <VerticalTable {...restProps} /> : <HorizontalTable {...restProps} />}
        </MUITable>
    </TableContainer>

}

export default Table;
