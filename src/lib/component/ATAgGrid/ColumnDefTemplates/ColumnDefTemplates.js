import { DeleteForeverOutlined, EditOutlined } from "@mui/icons-material"
import Button from '../CellRenderers/Button/Button';
import IconButton from '../CellRenderers/IconButton/IconButton';

const createButton = ({ onClick, field, confirmationMessage, getCellRendererParams, color, variant, ...overWriteProps } = {}) => {
    return {
        cellRenderer: Button,
        cellRendererParams: {
            onClick,
            confirmationMessage,
            getCellRendererParams,
            color, 
            variant
        },
        field,
        width: 160,
        ...(overWriteProps || {})
    }
}

const createEdit = ({ onClick, field = 'Edit', ...overWriteProps } = {}) => {
    return {
        cellRenderer: IconButton,
        cellRendererParams: {
            icon: <EditOutlined />,
            onClick,
        },
        field,
        width: 80,
        ...(overWriteProps || {})
    }
}

const createRemove = ({ onClick, field = 'Remove', confirmationMessage, ...overWriteProps } = {}) => {
    return {
        cellRenderer: IconButton,
        cellRendererParams: {
            icon: <DeleteForeverOutlined sx={{ color: '#B00020' }} />,
            onClick,
            confirmationMessage,
        },
        field,
        width: 90,
        ...(overWriteProps || {})
    }
}


export const ColumnDefTemplates = {
    createEdit,
    createRemove,
    createButton,
}