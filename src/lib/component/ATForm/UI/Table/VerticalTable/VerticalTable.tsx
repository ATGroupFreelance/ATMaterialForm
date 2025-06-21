import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
// Hooks
import useATFormConfig from '../../../../../hooks/useATFormConfig/useATFormConfig';
import { ATFormVerticalTableProps } from '@/lib/types/ui/Table.type';
import React from 'react';

const VerticalTable = ({ id, data, columns, rowProps, cellProps, columnsPerRow = 2 }: ATFormVerticalTableProps) => {
    void id;

    const { getLocalText } = useATFormConfig();

    const newColumns = [...(columns || [])];

    if (!newColumns.length && data && data.length) {
        for (const key in data[0]) {
            newColumns.push(key);
        }
    }

    const newData = data || [];

    // If columnsPerRow  is not defined, show everything in a single section
    const rowLimit = columnsPerRow || newColumns.length;

    // Splitting the columns into sections
    const columnSections = [];
    for (let i = 0; i < newColumns.length; i += rowLimit) {
        columnSections.push(newColumns.slice(i, i + rowLimit));
    }

    return <TableBody>
        {columnSections.map((section, sectionIndex) => (
            <TableRow key={`section-${sectionIndex}`} {...(rowProps || {})}>
                {section.map((column) => {
                    const currentColumnData = newData.map((row) => row[column])
                    const isAllNull = !currentColumnData.find(item => item)

                    return <React.Fragment key={column}>
                        {/* Column Name */}
                        <TableCell {...(cellProps || {})} sx={{ fontWeight: 'bold', ...(cellProps?.sx || {}) }}>
                            {getLocalText(column)}
                        </TableCell>

                        {/* Column Data (concatenates values from all data rows) */}
                        <TableCell {...(cellProps || {})}>
                            {
                                isAllNull ? '-' : currentColumnData.join(', ')
                            }
                        </TableCell>
                    </React.Fragment>
                })}
            </TableRow>
        ))}
    </TableBody>

};

export default VerticalTable;
