import type React from 'react';
import type { BoxProps, TypographyProps } from '@mui/material';

/**
 * Shared header options used by the built-in layouts.
 *
 * `title` and `description` stay renderer-agnostic while `headerProps`,
 * `titleProps`, and `descriptionProps` provide an escape hatch for MUI-level
 * customization without forcing each layout to invent its own header API.
 */
export interface AtFormLayoutHeaderConfig {
    title?: React.ReactNode,
    description?: React.ReactNode,
    icon?: React.ReactNode,
    action?: React.ReactNode,
    headerProps?: BoxProps,
    titleProps?: TypographyProps,
    descriptionProps?: TypographyProps,
}
