import React from 'react';

import MUITable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
//Hooks
import useATFormProvider from '../../../../../hooks/useATFormProvider/useATFormProvider';

const HorizontalTable = ({ atFormProvidedProps, id, data, columns, label, cellStyle, labelStyle, columnCellStyle, hideColumns, component }) => {
    const { getLocalText } = useATFormProvider()

    const newColumns = [
        ...(columns || [])
    ]

    if (!newColumns.length && data && data.length) {
        for (let key in data[0]) {
            newColumns.push(key)
        }
    }

    const newData = data || []

    return <TableContainer component={component || Paper}>
        {
            label && label !== '' &&
            <Typography sx={{ fontWeight: 'bold', ...(labelStyle || {}) }}>
                {getLocalText(label)}
            </Typography>
        }
        <MUITable sx={{ minWidth: 650 }} aria-label={label}>
            <TableHead>
                {
                    !hideColumns
                    &&
                    <TableRow>
                        {
                            newColumns.map(item => {
                                return <TableCell key={item} sx={columnCellStyle || {}}>{getLocalText(item)}</TableCell>
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
                                <TableCell key={key} sx={cellStyle || {}}>
                                    {row[key]}
                                </TableCell>
                            )
                        }

                        return <TableRow key={JSON.stringify(row) + index}>
                            {
                                cells
                            }
                        </TableRow>
                    })
                }
            </TableBody>
        </MUITable>
    </TableContainer>
}

export default HorizontalTable;