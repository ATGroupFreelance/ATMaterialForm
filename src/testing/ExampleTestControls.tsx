import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import {
  clearPerformanceHistory,
  getPerformanceHistory,
  savePerformanceHistory,
  type PerformanceHistoryEntry,
} from './performanceHistory';

type TestKind = 'regression' | 'performance' | 'visual-update';
type RunStatus = 'not-run' | 'running' | 'passed' | 'failed';

interface RunnerMetric {
  name: string;
  median: number;
  limit: number;
  samples: number[];
  pass: boolean;
}

interface RunnerResult {
  status: 'passed' | 'failed';
  exampleId: string;
  kind: TestKind;
  durationMs: number;
  passed: number;
  failed: number;
  summary: string;
  details?: string[];
  metrics?: RunnerMetric[];
  baselineCreated?: boolean;
}

interface ActionState {
  status: RunStatus;
  result: RunnerResult | null;
}

const initialState: ActionState = {
  status: 'not-run',
  result: null,
};

const statusText: Record<RunStatus, string> = {
  'not-run': 'Not Run',
  running: 'Running',
  passed: 'Passed',
  failed: 'Failed',
};

const statusColor = (status: RunStatus) => {
  if (status === 'passed') return 'success' as const;
  if (status === 'failed') return 'error' as const;
  if (status === 'running') return 'warning' as const;
  return 'default' as const;
};

const formatDate = (iso: string) => new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(iso));

const metricDelta = (
  current: RunnerMetric,
  previous: RunnerMetric | undefined,
) => {
  if (!previous || previous.median === 0) return null;
  return ((current.median - previous.median) / previous.median) * 100;
};

const TestAction = ({
  exampleId,
  kind,
  label,
  description,
  onResult,
  tooltip,
}: {
  exampleId: string;
  kind: TestKind;
  label: string;
  description: string;
  tooltip: string;
  onResult?: (result: RunnerResult) => void;
}) => {
  const [state, setState] = useState<ActionState>(initialState);

  const run = async () => {
    setState({ status: 'running', result: null });

    try {
      const response = await fetch('/__atmaterialform/tests/run', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          action: kind,
          exampleId,
        }),
      });

      const payload = await response.json() as RunnerResult & { error?: string };

      if (!response.ok && !payload.status) {
        throw new Error(payload.error || `Test runner returned HTTP ${response.status}`);
      }

      setState({
        status: payload.status === 'passed' ? 'passed' : 'failed',
        result: payload,
      });
      onResult?.(payload);
    } catch (error) {
      const payload: RunnerResult = {
        status: 'failed',
        exampleId,
        kind,
        durationMs: 0,
        passed: 0,
        failed: 1,
        summary: error instanceof Error ? error.message : String(error),
      };

      setState({
        status: 'failed',
        result: payload,
      });
      onResult?.(payload);
    }
  };

  const isRunning = state.status === 'running';
  const isPerformance = kind === 'performance';
  const isVisualUpdate = kind === 'visual-update';

  return (
    <Box
      sx={{
        minWidth: 0,
        p: 1.15,
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={800}>
              {label}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.2 }}>
              {description}
            </Typography>
          </Box>
          <Chip
            size="small"
            variant={state.status === 'not-run' ? 'outlined' : 'filled'}
            color={statusColor(state.status)}
            label={statusText[state.status]}
          />
        </Stack>

        <Tooltip title={tooltip}>
          <span style={{ alignSelf: 'flex-start' }}>
            <Button
              size="small"
              variant={isPerformance || isVisualUpdate ? 'outlined' : 'contained'}
              onClick={run}
              disabled={isRunning}
              startIcon={
                isRunning
                  ? <CircularProgress size={16} color="inherit" />
                  : isPerformance
                    ? <SpeedOutlinedIcon fontSize="small" />
                    : isVisualUpdate
                      ? <PhotoCameraOutlinedIcon fontSize="small" />
                      : <ScienceOutlinedIcon fontSize="small" />
              }
              sx={{ minHeight: 36, whiteSpace: 'nowrap' }}
            >
              {label}
            </Button>
          </span>
        </Tooltip>

        <Collapse in={Boolean(state.result)} unmountOnExit>
          {state.result ? (
            <Alert
              severity={state.result.status === 'passed' ? 'success' : 'error'}
              variant="outlined"
              sx={{
                py: 0.5,
                textAlign: 'start',
                '& .MuiAlert-message': { minWidth: 0 },
              }}
            >
              <Typography variant="body2" fontWeight={800}>
                {state.result.summary}
              </Typography>
              <Typography variant="caption" component="div" color="text.secondary">
                {state.result.passed} passed · {state.result.failed} failed · {(state.result.durationMs / 1000).toFixed(2)}s
              </Typography>

              {state.result.baselineCreated ? (
                <Typography variant="caption" component="div" color="success.main" sx={{ mt: 0.35 }}>
                  Missing visual baseline was created automatically, then the test was rerun.
                </Typography>
              ) : null}

              {state.result.metrics?.map((metric) => (
                <Typography
                  key={metric.name}
                  variant="caption"
                  component="div"
                  sx={{ mt: 0.25, fontFamily: 'monospace' }}
                >
                  {metric.name}: {metric.median.toFixed(1)}ms / {metric.limit.toFixed(1)}ms — {metric.pass ? 'PASS' : 'FAIL'}
                </Typography>
              ))}

              {state.result.details?.slice(0, 6).map((detail, index) => (
                <Typography
                  key={`${detail}-${index}`}
                  variant="caption"
                  component="div"
                  sx={{ mt: 0.25, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                >
                  {detail}
                </Typography>
              ))}
            </Alert>
          ) : null}
        </Collapse>
      </Stack>
    </Box>
  );
};

const PerformanceHistory = ({
  entries,
  onClear,
}: {
  entries: PerformanceHistoryEntry[];
  onClear: () => void;
}) => {
  const visibleEntries = entries.slice(0, 8);

  return (
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
        spacing={1}
        sx={{ px: 1.25, py: 1 }}
      >
        <Box>
          <Typography variant="subtitle2" fontWeight={850}>
            Performance history
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Stored locally in this browser for this example.
          </Typography>
        </Box>
        <Tooltip title="Delete the locally stored performance history for this example only. This does not change test thresholds or the form itself.">
          <span>
            <Button
              size="small"
              variant="text"
              startIcon={<DeleteOutlineOutlinedIcon fontSize="small" />}
              disabled={!entries.length}
              onClick={onClear}
            >
              Clear
            </Button>
          </span>
        </Tooltip>
      </Stack>

      <Divider />

      {!visibleEntries.length ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 1.25, py: 1.5 }}>
          No performance runs yet. Run “Test Performance” to start a local history.
        </Typography>
      ) : (
        <Stack divider={<Divider flexItem />}>
          {visibleEntries.map((entry, entryIndex) => {
            const previous = visibleEntries[entryIndex + 1];

            return (
              <Box key={entry.id} sx={{ px: 1.25, py: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <Typography variant="caption" fontWeight={800}>
                    {formatDate(entry.createdAt)}
                  </Typography>
                  <Chip
                    size="small"
                    color={entry.status === 'passed' ? 'success' : 'error'}
                    variant="outlined"
                    label={entry.status === 'passed' ? 'PASS' : 'FAIL'}
                  />
                </Stack>

                <Stack spacing={0.35} sx={{ mt: 0.65 }}>
                  {entry.metrics.map((metric) => {
                    const previousMetric = previous?.metrics.find((item) => item.name === metric.name);
                    const delta = metricDelta(metric, previousMetric);
                    const meaningfulDelta = delta !== null && Math.abs(delta) >= 0.5;
                    const improved = meaningfulDelta && delta < 0;

                    return (
                      <Stack
                        key={metric.name}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="baseline"
                        spacing={1}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {metric.name}
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', textAlign: 'right' }}>
                          {metric.median.toFixed(1)}ms
                          {meaningfulDelta ? (
                            <Box
                              component="span"
                              sx={{
                                ml: 0.75,
                                color: improved ? 'success.main' : 'error.main',
                                fontWeight: 800,
                              }}
                            >
                              {improved ? '↓' : '↑'} {Math.abs(delta).toFixed(1)}%
                            </Box>
                          ) : null}
                        </Typography>
                      </Stack>
                    );
                  })}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

const ExampleTestControls = ({ exampleId }: { exampleId: string }) => {
  const [history, setHistory] = useState<PerformanceHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getPerformanceHistory(exampleId));
  }, [exampleId]);

  const latestPerformance = useMemo(() => history[0] ?? null, [history]);

  const handlePerformanceResult = (result: RunnerResult) => {
    if (result.kind !== 'performance' || !result.metrics?.length) return;

    const nextHistory = savePerformanceHistory(exampleId, {
      status: result.status,
      durationMs: result.durationMs,
      metrics: result.metrics,
    });
    setHistory(nextHistory);
  };

  const clearHistory = () => {
    clearPerformanceHistory(exampleId);
    setHistory([]);
  };

  return (
    <Stack spacing={1.25} data-testid="example-test-controls">
      <TestAction
        key={`${exampleId}-regression`}
        exampleId={exampleId}
        kind="regression"
        label="Test This Example"
        description="Runs the real regression and visual checks for the selected example only."
        tooltip="Starts the selected example's Playwright regression spec only. It exercises real browser interactions and compares the example-stage screenshot with its approved visual baseline. It does not run the other examples."
      />

      <TestAction
        key={`${exampleId}-performance`}
        exampleId={exampleId}
        kind="performance"
        label="Test Performance"
        description={latestPerformance
          ? `Last local run: ${formatDate(latestPerformance.createdAt)}.`
          : 'Runs the real performance regression checks and stores the result locally.'}
        tooltip="Runs only this example's Playwright performance spec. It performs warm-up plus repeated measured runs, checks configured median thresholds, and saves the result in this browser's local performance history."
        onResult={handlePerformanceResult}
      />

      <TestAction
        key={`${exampleId}-visual-update`}
        exampleId={exampleId}
        kind="visual-update"
        label="Update Visual Baseline"
        description="Approve the current rendering for this example after an intentional visual change."
        tooltip="Re-runs this example's regression spec with Playwright snapshot-update mode. This intentionally overwrites the approved visual baseline for this example, so use it only when the UI change is expected."
      />

      <PerformanceHistory entries={history} onClear={clearHistory} />
    </Stack>
  );
};

export default ExampleTestControls;
