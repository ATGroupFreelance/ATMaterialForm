import { Box, ButtonBase, Typography, useTheme } from '@mui/material';
import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { ExampleDefinition } from './exampleRegistry';

interface ExampleNavigationProps {
  examples: ExampleDefinition[];
  value: string;
  onChange: (id: string) => void;
}

const ExampleNavigation = ({ examples, value, onChange }: ExampleNavigationProps) => {
  const theme = useTheme();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectByIndex = (index: number) => {
    const normalizedIndex = (index + examples.length) % examples.length;
    const nextExample = examples[normalizedIndex];

    onChange(nextExample.id);
    requestAnimationFrame(() => refs.current[nextExample.id]?.focus());
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const isRtl = theme.direction === 'rtl';
    let targetIndex: number | null = null;

    if (event.key === 'ArrowRight') targetIndex = index + (isRtl ? -1 : 1);
    if (event.key === 'ArrowLeft') targetIndex = index + (isRtl ? 1 : -1);
    if (event.key === 'ArrowDown') targetIndex = index + 1;
    if (event.key === 'ArrowUp') targetIndex = index - 1;
    if (event.key === 'Home') targetIndex = 0;
    if (event.key === 'End') targetIndex = examples.length - 1;

    if (targetIndex !== null) {
      event.preventDefault();
      selectByIndex(targetIndex);
    }
  };

  return (
    <Box component="nav" aria-label="ATMaterialForm examples">
      <Typography
        variant="overline"
        sx={{
          display: 'block',
          mb: 0.75,
          color: 'text.secondary',
          fontWeight: 800,
          letterSpacing: '0.08em',
        }}
      >
        Examples
      </Typography>

      <Box
        role="tablist"
        aria-label="Example selector"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 0.7, sm: 0.8 },
          alignItems: 'center',
        }}
      >
        {examples.map((example, index) => {
          const selected = example.id === value;

          return (
            <ButtonBase
              key={example.id}
              ref={(node) => {
                refs.current[example.id] = node;
              }}
              role="tab"
              aria-selected={selected}
              aria-controls="selected-example-panel"
              tabIndex={selected ? 0 : -1}
              data-example-id={example.id}
              onClick={() => onChange(example.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              sx={(muiTheme) => ({
                position: 'relative',
                px: { xs: 1.1, sm: 1.35 },
                py: 0.72,
                minHeight: 34,
                borderRadius: 2,
                border: '1px solid',
                borderColor: selected ? 'primary.main' : 'divider',
                bgcolor: selected ? 'primary.main' : 'background.paper',
                color: selected ? 'primary.contrastText' : 'text.primary',
                fontSize: { xs: '0.76rem', sm: '0.8rem' },
                fontWeight: selected ? 800 : 650,
                lineHeight: 1.15,
                boxShadow: selected ? muiTheme.shadows[2] : 'none',
                transition: muiTheme.transitions.create(
                  ['background-color', 'border-color', 'color', 'box-shadow', 'transform'],
                  { duration: 140 },
                ),
                '&:hover': {
                  bgcolor: selected ? 'primary.dark' : 'action.hover',
                  borderColor: selected ? 'primary.dark' : 'primary.main',
                  transform: 'translateY(-1px)',
                },
                '&.Mui-focusVisible': {
                  outline: `3px solid ${muiTheme.palette.primary.main}45`,
                  outlineOffset: 2,
                  boxShadow: muiTheme.shadows[3],
                },
              })}
            >
              {example.label}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
};

export default ExampleNavigation;
