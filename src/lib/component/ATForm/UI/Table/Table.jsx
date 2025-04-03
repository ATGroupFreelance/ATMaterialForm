import React from 'react';
import VerticalTable from './VerticalTable/VerticalTable';
import HorizontalTable from './HorizontalTable/HorizontalTable';

const Table = ({ tableType = 'Vertical', ...restProps }) => {
    console.log('tableType', tableType)

    return tableType === 'Vertical' ? <VerticalTable {...restProps} /> : <HorizontalTable {...restProps} />
}

export default Table;
