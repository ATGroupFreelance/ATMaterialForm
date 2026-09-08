import type { ExampleComponentInterface } from '@/App';
import {
    AtForm,
    formBuilder,
    type AtFormLayoutRendererProps,
} from '@/lib';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import TabRoundedIcon from '@mui/icons-material/TabRounded';
import { Box, Grid, Typography } from '@mui/material';

interface CustomPanelConfig {
    title: string;
    spacing?: number;
}

const CustomPanelLayout = ({
    children,
    config,
    id,
}: AtFormLayoutRendererProps<CustomPanelConfig>) => {
    return (
        <Box
            id={`custom-layout-${id}`}
            sx={{
                p: 1.75,
                border: 1,
                borderStyle: 'dotted',
                borderColor: 'divider',
                borderRadius: 1,
            }}
        >
            <Typography variant="subtitle2" sx={{ mb: 1.25 }}>
                {config?.title}
            </Typography>
            <Grid container spacing={config?.spacing ?? 1.5}>
                {children}
            </Grid>
        </Box>
    );
};

const FormLayouts = ({ ref, onChange }: ExampleComponentInterface) => {
    const fields = [
        formBuilder.createLayout(
            {
                id: 'PersonalInformation',
                renderer: 'Card',
                size: 12,
                config: {
                    title: 'Card layout — Personal information',
                    description: 'Compact, structured grouping for the most important form sections.',
                    icon: <PersonOutlineRoundedIcon />,
                    headerProps: { id: 'personal-information-card-header' },
                    cardProps: { id: 'personal-information-card' },
                },
            },
            [
                formBuilder.createTextBox({
                    id: 'FirstName',
                    size: 6,
                    validation: { required: true },
                }),
                formBuilder.createTextBox({
                    id: 'LastName',
                    size: 6,
                    wrapperRenderer: {
                        renderer: 'Collapse',
                        config: { defaultOpen: true },
                    },
                }),
            ],
        ),
        formBuilder.createLayout(
            {
                id: 'AddressBox',
                renderer: 'Box',
                size: 12,
                config: {
                    title: 'Box layout — Address',
                    description: 'A lightweight dashed boundary for secondary or optional groups.',
                    icon: <PlaceOutlinedIcon />,
                    boxProps: { id: 'address-box' },
                    gridProps: { spacing: 1 },
                },
            },
            [
                formBuilder.createTextBox({ id: 'City', size: 6 }),
                formBuilder.createTextBox({ id: 'Country', size: 6 }),
            ],
        ),
        formBuilder.createLayout(
            {
                id: 'ContactSection',
                renderer: 'Section',
                size: 12,
                config: {
                    title: 'Section layout — Contact details',
                    description: 'Clean hierarchy with no surrounding container when the page already has a surface.',
                    icon: <AlternateEmailRoundedIcon />,
                    sectionProps: { id: 'contact-section' },
                },
            },
            [
                formBuilder.createTextBox({ id: 'Email', size: 6 }),
                formBuilder.createTextBox({ id: 'Phone', size: 6 }),
            ],
        ),
        formBuilder.createLayout(
            {
                id: 'CompanyPaper',
                renderer: 'Paper',
                size: 12,
                config: {
                    title: 'Paper layout — Company',
                    description: 'A soft themed surface for related fields that need gentle separation.',
                    icon: <BusinessOutlinedIcon />,
                    paperProps: { id: 'company-paper' },
                },
            },
            [
                formBuilder.createTextBox({ id: 'CompanyName', size: 6 }),
                formBuilder.createTextBox({ id: 'JobTitle', size: 6 }),
            ],
        ),
        formBuilder.createLayout(
            {
                id: 'CustomPanel',
                renderer: CustomPanelLayout,
                size: 12,
                config: {
                    title: 'Custom layout — Custom renderer',
                    spacing: 1,
                },
            },
            [
                formBuilder.createTextBox({ id: 'CustomField', size: 6 }),
                formBuilder.createLayout(
                    {
                        id: 'NestedCard',
                        renderer: 'Card',
                        size: 6,
                        config: {
                            title: 'Card layout — Nested group',
                            icon: <DashboardCustomizeOutlinedIcon />,
                        },
                    },
                    [
                        formBuilder.createTextBox({ id: 'NestedField', size: 12 }),
                    ],
                ),
            ],
        ),
        formBuilder.createLayout(
            {
                id: 'TabbedCard',
                renderer: 'Card',
                size: 12,
                config: {
                    title: 'Card layout — Tabs inside a layout',
                    description: 'Inactive tab-only layouts stay mounted but do not leave empty visual shells.',
                    icon: <TabRoundedIcon />,
                },
            },
            [
                formBuilder.createTextBox({
                    id: 'TabbedProfile',
                    size: 12,
                    tabPath: 0,
                }),
                formBuilder.createLayout(
                    {
                        id: 'TabbedNestedBox',
                        renderer: 'Box',
                        size: 12,
                        config: {
                            title: 'Box layout — Contact tab group',
                            boxProps: { id: 'tabbed-nested-box' },
                        },
                    },
                    [
                        formBuilder.createTextBox({
                            id: 'TabbedContact',
                            size: 12,
                            tabPath: 1,
                        }),
                    ],
                ),
            ],
        ),
    ];

    return (
        <AtForm
            ref={ref}
            onChange={onChange}
            validationDisabled={false}
            tabs={[{ label: 'Profile' }, { label: 'Contact' }]}
        >
            {fields}
        </AtForm>
    );
};

export default FormLayouts;
