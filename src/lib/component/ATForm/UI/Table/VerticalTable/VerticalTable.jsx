import React from 'react';
import MUITable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
// Hooks
import useATFormProvider from '../../../../../hooks/useATFormProvider/useATFormProvider';

const VerticalTable = ({ atFormProvidedProps, id, data, columns, label, cellStyle, labelStyle, columnCellStyle, hideColumns, columnsPerRow = 2 }) => {
    const { getLocalText } = useATFormProvider();

    const newColumns = [...(columns || [])];

    if (!newColumns.length && data && data.length) {
        for (let key in data[0]) {
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

    return (
        <TableContainer component={Paper}>
            {label && label !== '' && (
                <Typography sx={{ fontWeight: 'bold', ...(labelStyle || {}) }}>
                    {getLocalText(label)}
                </Typography>
            )}
            <MUITable sx={{ minWidth: 650 }} aria-label={label}>
                <TableBody>
                    {columnSections.map((section, sectionIndex) => (
                        <TableRow key={`section-${sectionIndex}`}>
                            {section.map((column) => {
                                const currentColumnData = newData.map((row) => row[column])
                                const isAllNull = !currentColumnData.find(item => item)

                                return <React.Fragment key={column}>
                                    {/* Column Name */}
                                    <TableCell sx={{ fontWeight: 'bold', ...(columnCellStyle || {}) }}>
                                        {getLocalText(column)}
                                    </TableCell>

                                    {/* Column Data (concatenates values from all data rows) */}
                                    <TableCell sx={cellStyle || {}}>
                                        {
                                            isAllNull ? '-' : currentColumnData.join(', ')
                                        }
                                    </TableCell>
                                </React.Fragment>
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </MUITable>
        </TableContainer>
    );
};

export default VerticalTable;
