import React, { useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Collapse,
    Paper,
    Tooltip,
    useTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ATFormChildProps, ATFormFieldTProps, ATFormUnknownChildProps } from "@/lib/types/ATForm.type";
import UIRenderDebugWrapperTable from "./UIRenderDebugWrapperTable/UIRenderDebugWrapperTable";

interface UIRenderDebugWrapperProps {
    childProps: ATFormChildProps | ATFormUnknownChildProps;
    children: React.ReactNode;
}

function UIRenderDebugWrapper({ childProps, children }: UIRenderDebugWrapperProps) {
    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();

    const tProps = childProps.tProps as Partial<ATFormFieldTProps> || {};
    const uiProps = childProps.uiProps || {};

    const basicInfo = [
        { label: "id", value: tProps.id },
        { label: "type", value: tProps.type },
        { label: "label", value: tProps.label },
        { label: "tabPath", value: tProps.tabPath },
    ];

    return (
        <Box
            sx={{
                border: `1px dashed ${theme.palette.primary.light}`,
                borderRadius: 2,
                padding: 1,
                marginBottom: 2,
                backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#f0f7ff",
                fontSize: "12px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Top info bar */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: "1.4em",
                        height: "2.8em",
                        fontSize: "11px",
                        color: theme.palette.primary.dark,
                        flex: 1,
                        minWidth: 0,
                        textAlign: "left",
                        whiteSpace: "normal",
                    }}
                >
                    {basicInfo.map(({ label, value }) => {
                        const stringValue = typeof value === "string" ? value : String(value);
                        return (
                            <Tooltip key={label} title={`${label}: ${stringValue}`}>
                                <span style={{ marginRight: 8 }}>
                                    <strong>{label}:</strong> {stringValue}
                                </span>
                            </Tooltip>
                        );
                    })}
                </Box>

                <Tooltip title={expanded ? "Hide Details" : "Show More Info"}>
                    <IconButton
                        onClick={() => setExpanded(prev => !prev)}
                        size="small"
                        sx={{ color: theme.palette.primary.dark }}
                    >
                        <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Collapsible Full Debug Details */}
            <Collapse in={expanded}>
                <Paper
                    elevation={0}
                    sx={{
                        backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : "#e3f2fd",
                        padding: 1,
                        borderRadius: 1,
                        maxHeight: 400,
                        overflowY: "auto",
                        mt: 1,
                    }}
                >
                    <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, mb: 1 }}>
                        tProps
                    </Typography>
                    <UIRenderDebugWrapperTable data={tProps} />

                    <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, mt: 2, mb: 1 }}>
                        uiProps
                    </Typography>
                    <UIRenderDebugWrapperTable data={uiProps} />
                </Paper>
            </Collapse>

            <Box mt={1}>{children}</Box>
        </Box>
    );
}

export default UIRenderDebugWrapper;
