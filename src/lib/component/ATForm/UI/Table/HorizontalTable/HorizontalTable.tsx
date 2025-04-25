import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

//Hooks
import useATFormConfig from '../../../../../hooks/useATFormConfig/useATFormConfig';
import { ATFormHorizontalTableProps } from '@/lib/types/ui/Table.type';

const HorizontalTable = ({ id, data, columns, rowProps, cellProps, headerCellProps, headerRowProps, hideColumns }: ATFormHorizontalTableProps) => {
    void id;

    const { getLocalText } = useATFormConfig()

    const newColumns = [
        ...(columns || [])
    ]

    if (!newColumns.length && data && data.length) {
        for (let key in data[0]) {
            newColumns.push(key)
        }
    }

    const newData = data || []

    return <>
        <TableHead>
            {
                !hideColumns
                &&
                <TableRow {...(headerRowProps || {})}>
                    {
                        newColumns.map(item => {
                            return <TableCell key={item} {...(headerCellProps || {})}>{getLocalText(item)}</TableCell>
                        })
                    }
                </TableRow>
            }
        </TableHead>
        <TableBody>
            {
                newData.map((row, index) => {
                    const cells = []

                    for (let key in row) {
                        cells.push(
                            <TableCell key={key} {...(cellProps || {})}>
                                {row[key]}
                            </TableCell>
                        )
                    }

                    return <TableRow key={JSON.stringify(row) + index} {...(rowProps || {})}>
                        {
                            cells
                        }
                    </TableRow>
                })
            }
        </TableBody>
    </>
}

export default HorizontalTable;