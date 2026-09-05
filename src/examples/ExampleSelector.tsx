import { Autocomplete, Box, Chip, TextField, Typography } from '@mui/material';
import type { ExampleDefinition } from './exampleRegistry';

interface ExampleSelectorProps {
  examples: ExampleDefinition[];
  value: ExampleDefinition;
  onChange: (id: string) => void;
}

const ExampleSelector = ({ examples, value, onChange }: ExampleSelectorProps) => (
  <Autocomplete
    disableClearable
    options={examples}
    value={value}
    size="small"
    isOptionEqualToValue={(option, selected) => option.id === selected.id}
    getOptionLabel={(option) => option.label}
    onChange={(_, nextValue) => onChange(nextValue.id)}
    sx={{ minWidth: 0, width: '100%' }}
    slotProps={{
      paper: {
        elevation: 8,
        sx: {
          mt: 0.5,
          borderRadius: 2.5,
          border: '1px solid',
          borderColor: 'divider',
        },
      },
      listbox: {
        sx: { py: 0.75, maxHeight: 420 },
      },
    }}
    renderOption={(props, option, state) => (
      <Box
        component="li"
        {...props}
        key={option.id}
        sx={{
          gap: 1,
          mx: 0.75,
          my: 0.25,
          px: 1.25,
          py: 0.9,
          borderRadius: 2,
          '&[aria-selected="true"]': {
            bgcolor: 'action.selected',
          },
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" fontWeight={state.selected ? 800 : 650} noWrap>
            {option.label}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {option.id}
          </Typography>
        </Box>
        {state.selected ? <Chip size="small" color="primary" label="Current" /> : null}
      </Box>
    )}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Example"
        placeholder="Search examples…"
        inputProps={{
          ...params.inputProps,
          'aria-label': 'Select playground example',
        }}
      />
    )}
  />
);

export default ExampleSelector;
