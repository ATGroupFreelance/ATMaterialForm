import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
    useTheme,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const UIRenderDebugWrapperTable = ({ data }: { data: Record<string, any> }) => {
    const [dialogContent, setDialogContent] = useState<string | null>(null);
    const theme = useTheme();

    const MAX_LENGTH = 30;

    const openDialog = (value: any) => {
        setDialogContent(
            typeof value === "function"
                ? value.toString()
                : typeof value === "object"
                    ? JSON.stringify(value, null, 2)
                    : String(value)
        );
    };

    return (
        <>
            <Table size="small">
                <TableBody>
                    {Object.entries(data).map(([key, value]) => {
                        let displayValue = "";

                        if (typeof value === "function") {
                            displayValue = "[Function]";
                        } else if (typeof value === "object") {
                            try {
                                const jsonString = JSON.stringify(value);
                                displayValue = jsonString.length > MAX_LENGTH
                                    ? jsonString.slice(0, MAX_LENGTH) + "..."
                                    : jsonString;
                            } catch {
                                displayValue = "[Object]";
                            }
                        } else {
                            const stringVal = String(value);
                            displayValue = stringVal.length > MAX_LENGTH
                                ? stringVal.slice(0, MAX_LENGTH) + "..."
                                : stringVal;
                        }

                        const showViewButton =
                            typeof value === "function" ||
                            (typeof value === "object" && value !== null) ||
                            String(value).length > MAX_LENGTH;

                        return (
                            <TableRow key={key}>
                                <TableCell
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: "11px",
                                        verticalAlign: "top",
                                        color: theme.palette.text.primary,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {key}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontSize: "11px",
                                        wordBreak: "break-word",
                                        whiteSpace: "pre-wrap",
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    {displayValue}
                                    {showViewButton && (
                                        <IconButton
                                            onClick={() => openDialog(value)}
                                            size="small"
                                            sx={{ marginLeft: 1, color: theme.palette.primary.main }}
                                        >
                                            <VisibilityIcon fontSize="inherit" />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <Dialog
                open={Boolean(dialogContent)}
                onClose={() => setDialogContent(null)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Full Property View</DialogTitle>
                <DialogContent>
                    <pre
                        style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            fontSize: "13px",
                            color: theme.palette.text.primary,
                        }}
                    >
                        {dialogContent}
                    </pre>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UIRenderDebugWrapperTable;
