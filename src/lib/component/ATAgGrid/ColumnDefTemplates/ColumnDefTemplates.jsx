import { DeleteForeverOutlined, EditOutlined } from "@mui/icons-material"
import Button from '../CellRenderers/Button/Button';
import IconButton from '../CellRenderers/IconButton/IconButton';
import { useTheme } from "@emotion/react";

const createButton = ({ onClick, field, confirmationMessage, getCellRendererParams, color, variant, disabled, ...overWriteProps } = {}) => {
    return {
        cellRenderer: Button,
        cellRendererParams: {
            onClick,
            confirmationMessage,
            getCellRendererParams,
            color,
            variant,
            disabled,
        },
        field,
        width: 160,
        ...(overWriteProps || {})
    }
}

const EditIcon = () => {
    const theme = useTheme()

    return <EditOutlined sx={theme?.at_columnDefTemplates?.editIcon || {}} />
}

const createEdit = ({ onClick, field = 'Edit', ...overWriteProps } = {}) => {
    return {
        cellRenderer: IconButton,
        cellRendererParams: {
            icon: <EditIcon />,
            onClick,
        },
        field,
        width: 80,
        ...(overWriteProps || {})
    }
}

const DeleteIcon = () => {
    const theme = useTheme()

    return <DeleteForeverOutlined color={'red'} sx={theme?.at_columnDefTemplates?.removeIcon || {}} />
}

const createRemove = ({ onClick, field = 'Remove', confirmationMessage, ...overWriteProps } = {}) => {
    return {
        cellRenderer: IconButton,
        cellRendererParams: {
            icon: <DeleteIcon />,
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