import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import type { AtFormOnChangeInterface } from '@/lib/types/AtForm.type';
import ExampleTestControls from './ExampleTestControls';
import type {
  SnapshotDataFormat,
  SnapshotDifference,
  SnapshotVerificationResult,
  StoredFormSnapshot,
} from './formSnapshotStorage';

export type InspectorSection = 'data' | 'tests';
type DataFormat = 'semi' | 'keyValue' | 'formData';
type SnapshotAction = 'idle' | 'capture' | 'restore';

interface PlaygroundInspectorProps {
  section: InspectorSection;
  onSectionChange: (section: InspectorSection) => void;
  exampleId: string;
  formData: AtFormOnChangeInterface | null;
  showTests: boolean;
  liveEnabled: boolean;
  rtl: boolean;
  snapshotEnabled: boolean;
  snapshot: StoredFormSnapshot | null;
  snapshotAction: SnapshotAction;
  snapshotVerification: SnapshotVerificationResult | null;
  onCaptureSnapshot: () => void | Promise<void>;
  onRestoreSnapshot: () => void | Promise<void>;
  onClearSnapshot: () => void;
}

const toPrettyJson = (value: unknown) => {
  if (value === undefined) return 'undefined';

  try {
    return JSON.stringify(value ?? null, null, 2);
  } catch {
    return String(value ?? '');
  }
};

const formatDateTime = (iso: string) => new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
}).format(new Date(iso));

const formatLabels: Record<SnapshotDataFormat, string> = {
  FormDataSemiKeyValue: 'Semi key/value',
  FormDataKeyValue: 'Key/value',
  FormData: 'Form data',
};

const kindLabels: Record<SnapshotDifference['kind'], string> = {
  changed: 'Changed',
  missing: 'Missing after restore',
  unexpected: 'Unexpected after restore',
};

const SnapshotDiffDialog = ({
  open,
  onClose,
  verification,
}: {
  open: boolean;
  onClose: () => void;
  verification: SnapshotVerificationResult;
}) => {
  const availableFormats = useMemo(
    () => Array.from(new Set(verification.differences.map((difference) => difference.format))),
    [verification.differences],
  );
  const [selectedFormat, setSelectedFormat] = useState<SnapshotDataFormat | 'all'>('all');

  useEffect(() => {
    if (open) setSelectedFormat('all');
  }, [open, verification.checkedAt]);

  const visibleDifferences = selectedFormat === 'all'
    ? verification.differences
    : verification.differences.filter((difference) => difference.format === selectedFormat);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      disableScrollLock
      aria-labelledby="snapshot-diff-dialog-title"
    >
      <DialogTitle id="snapshot-diff-dialog-title" sx={{ pr: 7 }}>
        <Typography component="div" variant="h6" fontWeight={850}>
          Snapshot mismatch details
        </Typography>
        <Typography component="div" variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>
          Saved values are shown beside the values returned after AtForm.reset. Paths use JSONPath-style notation.
        </Typography>
        <Tooltip title="Close the snapshot mismatch dialog without changing the saved snapshot or current form data.">
          <IconButton
            aria-label="Close snapshot mismatch details"
            onClick={onClose}
            sx={{ position: 'absolute', top: 12, right: 12 }}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Alert severity="error" variant="outlined">
            {verification.differences.length} JSON difference{verification.differences.length === 1 ? '' : 's'} found across {availableFormats.length} form-data format{availableFormats.length === 1 ? '' : 's'}.
          </Alert>

          <ToggleButtonGroup
            exclusive
            size="small"
            value={selectedFormat}
            onChange={(_, next: SnapshotDataFormat | 'all' | null) => next && setSelectedFormat(next)}
            aria-label="Snapshot difference format filter"
            sx={{ alignSelf: 'flex-start', flexWrap: 'wrap' }}
          >
            <ToggleButton value="all">
              <Tooltip title="Show differences from all three ATMaterialForm value formats.">
                <span>All ({verification.differences.length})</span>
              </Tooltip>
            </ToggleButton>
            {availableFormats.map((format) => {
              const count = verification.differences.filter((difference) => difference.format === format).length;
              return (
                <ToggleButton key={format} value={format}>
                  <Tooltip title={`Show only differences in ${format}.`}>
                    <span>{formatLabels[format]} ({count})</span>
                  </Tooltip>
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>

          <Stack spacing={1.15}>
            {visibleDifferences.map((difference, index) => (
              <Paper
                key={`${difference.format}-${difference.path}-${index}`}
                variant="outlined"
                sx={{ overflow: 'hidden', borderRadius: 2.5 }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={0.75}
                  sx={{ px: 1.25, py: 1, bgcolor: 'action.hover' }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={800}>
                      {formatLabels[difference.format]}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={800}
                      sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', overflowWrap: 'anywhere' }}
                    >
                      {difference.path}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    color={difference.kind === 'changed' ? 'warning' : 'error'}
                    variant="outlined"
                    label={kindLabels[difference.kind]}
                  />
                </Stack>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    borderTop: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ minWidth: 0, p: 1.25, borderRight: { md: 1 }, borderColor: { md: 'divider' } }}>
                    <Typography variant="caption" color="primary.main" fontWeight={900}>
                      SAVED SNAPSHOT
                    </Typography>
                    <Box
                      component="pre"
                      sx={{
                        m: 0,
                        mt: 0.65,
                        p: 1,
                        maxHeight: 240,
                        overflow: 'auto',
                        borderRadius: 1.5,
                        bgcolor: 'action.hover',
                        direction: 'ltr',
                        textAlign: 'left',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere',
                        fontSize: '0.76rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {toPrettyJson(difference.expected)}
                    </Box>
                  </Box>

                  <Box sx={{ minWidth: 0, p: 1.25 }}>
                    <Typography variant="caption" color="error.main" fontWeight={900}>
                      AFTER RESTORE
                    </Typography>
                    <Box
                      component="pre"
                      sx={{
                        m: 0,
                        mt: 0.65,
                        p: 1,
                        maxHeight: 240,
                        overflow: 'auto',
                        borderRadius: 1.5,
                        bgcolor: 'action.hover',
                        direction: 'ltr',
                        textAlign: 'left',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere',
                        fontSize: '0.76rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {toPrettyJson(difference.actual)}
                    </Box>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Stack>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px: 2, py: 1.25 }}>
        <Tooltip title="Close this comparison. It does not modify the snapshot or form.">
          <Button onClick={onClose} variant="outlined">Close</Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

const SnapshotPanel = ({
  enabled,
  snapshot,
  action,
  verification,
  onCapture,
  onRestore,
  onClear,
}: {
  enabled: boolean;
  snapshot: StoredFormSnapshot | null;
  action: SnapshotAction;
  verification: SnapshotVerificationResult | null;
  onCapture: () => void | Promise<void>;
  onRestore: () => void | Promise<void>;
  onClear: () => void;
}) => {
  const busy = action !== 'idle';
  const [diffOpen, setDiffOpen] = useState(false);
  const canShowDiff = verification?.status === 'failed' && Boolean(verification.differences.length);

  return (
    <>
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2.5,
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        <Stack spacing={1.1} sx={{ p: 1.25 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={850}>
                Saved form snapshot
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Save the current form locally, then restore it through AtForm.reset and verify every form-data format matches.
              </Typography>
            </Box>
            <Chip
              size="small"
              variant="outlined"
              color={snapshot ? 'primary' : 'default'}
              label={snapshot ? 'Saved' : 'None'}
            />
          </Stack>

          {snapshot ? (
            <Typography variant="caption" color="text.secondary">
              Saved {formatDateTime(snapshot.createdAt)}
            </Typography>
          ) : null}

          <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
            <Tooltip title="Capture the form's current FormData, FormDataKeyValue, and FormDataSemiKeyValue and save them locally for this example. Later restores are verified against all three formats.">
              <span>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={action === 'capture'
                    ? <CircularProgress size={15} color="inherit" />
                    : <SaveOutlinedIcon fontSize="small" />}
                  disabled={!enabled || busy}
                  onClick={onCapture}
                >
                  Take snapshot
                </Button>
              </span>
            </Tooltip>

            <Tooltip title="Load the saved snapshot through AtForm.reset, then read the form back and compare all three value formats. A mismatch means reset/load did not reproduce the saved state exactly.">
              <span>
                <Button
                  size="small"
                  startIcon={action === 'restore'
                    ? <CircularProgress size={15} color="inherit" />
                    : <RestoreOutlinedIcon fontSize="small" />}
                  disabled={!enabled || !snapshot || busy}
                  onClick={onRestore}
                >
                  Reset to snapshot & verify
                </Button>
              </span>
            </Tooltip>

            <Tooltip title="Delete the locally saved snapshot for this example. This does not change the current form values.">
              <span>
                <IconButton
                  size="small"
                  color="error"
                  aria-label="Clear saved form snapshot"
                  disabled={!snapshot || busy}
                  onClick={onClear}
                >
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

          {!enabled ? (
            <Typography variant="caption" color="text.secondary">
              This example does not expose a playground form ref, so snapshot/reset verification is unavailable.
            </Typography>
          ) : null}

          {verification ? (
            <Alert
              severity={verification.status === 'passed' ? 'success' : 'error'}
              variant="outlined"
              sx={{ py: 0.4 }}
              action={canShowDiff ? (
                <Tooltip title="Open a JSON-path comparison showing the exact saved and restored values that differ.">
                  <Button
                    size="small"
                    color="error"
                    startIcon={<CompareArrowsOutlinedIcon fontSize="small" />}
                    onClick={() => setDiffOpen(true)}
                  >
                    View diff
                  </Button>
                </Tooltip>
              ) : undefined}
            >
              <Typography variant="body2" fontWeight={800}>
                {verification.status === 'passed'
                  ? 'Restore verified — all three form-data formats match the saved snapshot.'
                  : 'Restore mismatch detected.'}
              </Typography>
              <Typography variant="caption" component="div" color="text.secondary">
                Checked {formatDateTime(verification.checkedAt)}
              </Typography>
              {verification.mismatches.map((message) => (
                <Typography key={message} variant="caption" component="div" sx={{ mt: 0.25 }}>
                  {message}
                </Typography>
              ))}
            </Alert>
          ) : null}
        </Stack>
      </Box>

      {verification && verification.differences.length ? (
        <SnapshotDiffDialog
          open={diffOpen}
          onClose={() => setDiffOpen(false)}
          verification={verification}
        />
      ) : null}
    </>
  );
};

const PlaygroundInspector = ({
  section,
  onSectionChange,
  exampleId,
  formData,
  showTests,
  liveEnabled,
  rtl,
  snapshotEnabled,
  snapshot,
  snapshotAction,
  snapshotVerification,
  onCaptureSnapshot,
  onRestoreSnapshot,
  onClearSnapshot,
}: PlaygroundInspectorProps) => {
  const [format, setFormat] = useState<DataFormat>('semi');

  const selectedData = useMemo(() => {
    if (format === 'formData') return formData?.formData ?? {};
    if (format === 'keyValue') return formData?.formDataKeyValue ?? {};
    return formData?.formDataSemiKeyValue ?? {};
  }, [formData, format]);

  const json = useMemo(() => toPrettyJson(selectedData), [selectedData]);
  const itemCount = Array.isArray(selectedData)
    ? selectedData.length
    : selectedData && typeof selectedData === 'object'
      ? Object.keys(selectedData as Record<string, unknown>).length
      : 0;

  const copyJson = async () => {
    await navigator.clipboard?.writeText(json);
  };

  return (
    <Paper
      component="aside"
      elevation={0}
      className="playground-inspector"
      aria-label="Playground inspector"
      dir={rtl ? 'rtl' : 'ltr'}
      sx={(theme) => ({
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1],
        bgcolor: theme.palette.background.default,
      })}
    >
      <Stack sx={{ height: '100%', minHeight: 0 }}>
        <Box sx={{ px: 1.75, pt: 1.5, pb: 1.1 }}>
          <Typography variant="overline" color="primary.main" fontWeight={900}>
            Playground inspector
          </Typography>
          <Typography variant="subtitle1" fontWeight={850} noWrap title={exampleId}>
            {exampleId}
          </Typography>
        </Box>

        <Tabs
          value={section}
          onChange={(_, nextValue: InspectorSection) => onSectionChange(nextValue)}
          variant="fullWidth"
          sx={{ borderTop: 1, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            value="data"
            label={(
              <Tooltip title="Inspect live ATMaterialForm output and test save/reset round trips with locally stored form snapshots.">
                <Stack component="span" direction="row" spacing={0.7} alignItems="center">
                  <DataObjectOutlinedIcon fontSize="small" />
                  <span>Form Data</span>
                </Stack>
              </Tooltip>
            )}
          />
          {showTests ? (
            <Tab
              value="tests"
              label={(
                <Tooltip title="Run the current example's regression, visual-baseline, and performance checks and inspect local performance history.">
                  <Stack component="span" direction="row" spacing={0.7} alignItems="center">
                    <ScienceOutlinedIcon fontSize="small" />
                    <span>Tests</span>
                  </Stack>
                </Tooltip>
              )}
            />
          ) : null}
        </Tabs>

        <Box className="playground-inspector-body">
          {section === 'data' ? (
            <Stack spacing={1.35}>
              <SnapshotPanel
                enabled={snapshotEnabled}
                snapshot={snapshot}
                action={snapshotAction}
                verification={snapshotVerification}
                onCapture={onCaptureSnapshot}
                onRestore={onRestoreSnapshot}
                onClear={onClearSnapshot}
              />

              <Divider />

              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={850}>
                    Live form data
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Inspect the values emitted by the selected example while you work.
                  </Typography>
                </Box>
                <Chip size="small" color="primary" variant="outlined" label={`${itemCount} items`} />
              </Stack>

              {!liveEnabled ? (
                <Box
                  sx={{
                    px: 1.25,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    This example does not expose the playground onChange stream, so live data remains empty.
                  </Typography>
                </Box>
              ) : null}

              <ToggleButtonGroup
                exclusive
                size="small"
                value={format}
                onChange={(_, next: DataFormat | null) => next && setFormat(next)}
                aria-label="Form data format"
                fullWidth
              >
                <ToggleButton value="semi">
                  <Tooltip title="Show FormDataSemiKeyValue: the semi-normalized value format emitted by ATMaterialForm.">
                    <span>Semi</span>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="keyValue">
                  <Tooltip title="Show FormDataKeyValue: values keyed by form field ID.">
                    <span>Key/value</span>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="formData">
                  <Tooltip title="Show FormData: the library's full structured form-data representation.">
                    <span>Form data</span>
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2.5,
                  bgcolor: 'background.paper',
                  overflow: 'hidden',
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 1.25, py: 0.8, borderBottom: 1, borderColor: 'divider' }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={800}>
                    JSON
                  </Typography>
                  <Tooltip title="Copy the currently selected form-data format as pretty-printed JSON to the clipboard.">
                    <IconButton size="small" onClick={copyJson} aria-label="Copy form data JSON">
                      <ContentCopyOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Box
                  component="pre"
                  sx={{
                    m: 0,
                    p: 1.25,
                    minHeight: 260,
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    direction: 'ltr',
                    textAlign: 'left',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: '0.76rem',
                    lineHeight: 1.55,
                  }}
                >
                  {json}
                </Box>
              </Box>
            </Stack>
          ) : (
            <Stack spacing={1.35}>
              <Box>
                <Typography variant="subtitle1" fontWeight={850}>
                  Developer checks
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Run regression, visual, and performance checks without changing the main layout.
                </Typography>
              </Box>
              <Divider />
              <ExampleTestControls key={exampleId} exampleId={exampleId} />
            </Stack>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default PlaygroundInspector;
