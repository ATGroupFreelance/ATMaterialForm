import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import FormatTextdirectionLToR from '@mui/icons-material/FormatTextdirectionLToR';
import FormatTextdirectionRToL from '@mui/icons-material/FormatTextdirectionRToL';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  CssBaseline,
  Grid,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useMemo, useRef, useState } from 'react';

import './App.css';
import MyTextField from '@/CustomComponents/MyTextField/MyTextField';
import { AtFormConfigProvider } from '@/lib/component/AtForm/AtFormConfigContext/AtFormConfigContext';
import AtToast from '@/lib/component/AtToast/AtToast';
import AtToastContainer from '@/lib/component/AtToast/AtToastContainer/AtToastContainer';
import * as UiTypeUtils from '@/lib/component/AtForm/UiTypeUtils/UiTypeUtils';
import type { AtFormOnChangeInterface, AtFormRefInterface } from '@/lib/types/AtForm.type';
import type { StringKeyedObject } from '@/lib/types/Common.type';
import ExampleSelector from '@/examples/ExampleSelector';
import {
  exampleIds,
  exampleList,
  type ExampleDefinition,
} from '@/examples/exampleRegistry';
import ReportComponent from '@/examples/HowToUseRuntime/ReportComponent/ReportComponent';
import ServiceManager from '@/serviceManager/serviceManager';
import PlaygroundInspector, {
  type InspectorSection,
} from '@/testing/PlaygroundInspector';
import {
  clearFormSnapshot,
  compareFormSnapshot,
  loadFormSnapshot,
  normalizeFormSnapshotData,
  saveFormSnapshot,
  type SnapshotVerificationResult,
  type StoredFormSnapshot,
} from '@/testing/formSnapshotStorage';

export interface ExampleComponentInterface {
  ref?: any;
  onChange?: any;
}

const DEFAULT_RTL = false;
const DEFAULT_EXAMPLE = 'CascadeComboBoxPlayground';
const ACTION_FEEDBACK_DELAY = 320;
const SNAPSHOT_VERIFY_TIMEOUT = 1800;
const THEME_STORAGE_KEY = 'atmaterialform.playground-theme.v1';
type ThemeMode = 'light' | 'dark';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const readRequestedExample = () => {
  if (typeof window === 'undefined') return DEFAULT_EXAMPLE;

  const requested = new URLSearchParams(window.location.search).get('example');
  return requested && exampleIds.includes(requested) ? requested : DEFAULT_EXAMPLE;
};

const isAutomatedTestMode = () => {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('testMode') === '1';
};

const isInspectorTestMode = () => {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('inspector') === '1';
};

const readThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined' || isAutomatedTestMode()) return 'light';

  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

function App() {
  const formRef = useRef<AtFormRefInterface | null>(null);
  const currentFormData = useRef<AtFormOnChangeInterface | null>(null);

  const [rtl, setRtl] = useState(DEFAULT_RTL);
  const [themeMode, setThemeMode] = useState<ThemeMode>(readThemeMode);
  const [savedFormData, setSavedFormData] = useState<StringKeyedObject | null | undefined>(null);
  const [liveFormData, setLiveFormData] = useState<AtFormOnChangeInterface | null>(null);
  const [enums, setEnums] = useState<any>(null);
  const [selectedExampleId, setSelectedExampleId] = useState(readRequestedExample);
  const [actionState, setActionState] = useState<'idle' | 'submit' | 'reset' | 'load'>('idle');
  const [snapshotAction, setSnapshotAction] = useState<'idle' | 'capture' | 'restore'>('idle');
  const [formSnapshot, setFormSnapshot] = useState<StoredFormSnapshot | null>(null);
  const [snapshotVerification, setSnapshotVerification] = useState<SnapshotVerificationResult | null>(null);
  const [inspectorSection, setInspectorSection] = useState<InspectorSection>('data');

  const theme = useMemo(() => createTheme({
    direction: rtl ? 'rtl' : 'ltr',
    palette: {
      mode: themeMode,
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        defaultProps: {
          variant: 'contained',
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
          },
        },
      },
    },
  }), [rtl, themeMode]);

  useEffect(() => {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.body.dir = rtl ? 'rtl' : 'ltr';
  }, [rtl]);

  useEffect(() => {
    if (isAutomatedTestMode()) return;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch {
      // Theme persistence is a playground convenience only.
    }
  }, [themeMode]);

  useEffect(() => {
    let isMounted = true;

    ServiceManager.getEnums().then((result) => {
      if (isMounted) setEnums(result);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedExample = useMemo<ExampleDefinition>(
    () => exampleList.find((item) => item.id === selectedExampleId) ?? exampleList[0],
    [selectedExampleId],
  );

  useEffect(() => {
    setFormSnapshot(loadFormSnapshot(selectedExampleId));
    setSnapshotVerification(null);
  }, [selectedExampleId]);

  const onFormChange = (nextFormData: AtFormOnChangeInterface) => {
    currentFormData.current = nextFormData;
    setLiveFormData(nextFormData);
  };

  const getActionFormRef = (actionLabel: string) => {
    if (formRef.current) return formRef.current;

    AtToast.info(`${actionLabel} is not available for ${selectedExample.label} because this example does not expose a form ref.`);
    return null;
  };

  const onSetDefaultValueClick = async () => {
    if (actionState !== 'idle' || snapshotAction !== 'idle') return;

    const activeFormRef = getActionFormRef('Reset');
    if (!activeFormRef) return;

    setActionState('reset');

    try {
      activeFormRef.reset();
      await wait(ACTION_FEEDBACK_DELAY);
      AtToast.info('Default values restored.');
    } finally {
      setActionState('idle');
    }
  };

  const onLoadLastSubmitClick = async () => {
    if (actionState !== 'idle' || snapshotAction !== 'idle') return;

    const activeFormRef = getActionFormRef('Load last submit');
    if (!activeFormRef) return;

    if (!savedFormData) {
      AtToast.info('Submit this example once before loading the last submitted values.');
      return;
    }

    setActionState('load');

    try {
      activeFormRef.reset({
        inputDefaultValue: savedFormData,
        inputDefaultValueFormat: 'FormDataKeyValue',
      });
      await wait(ACTION_FEEDBACK_DELAY);
      AtToast.success('Last submitted values loaded.');
    } finally {
      setActionState('idle');
    }
  };

  const onSubmitClick = async () => {
    if (actionState !== 'idle' || snapshotAction !== 'idle') return;

    const activeFormRef = getActionFormRef('Submit');
    if (!activeFormRef) return;

    setActionState('submit');

    try {
      const validationResult = new Promise<'valid' | 'invalid'>((resolve) => {
        activeFormRef.checkValidation(
          () => resolve('valid'),
          () => resolve('invalid'),
        );
      });

      const [result] = await Promise.all([
        validationResult,
        wait(ACTION_FEEDBACK_DELAY),
      ]);

      if (result === 'invalid') {
        AtToast.warning('Validation failed. Check the highlighted fields and try again.');
        return;
      }

      const snapshot = activeFormRef.getFormData();
      currentFormData.current = snapshot;
      setLiveFormData(snapshot);
      setSavedFormData(snapshot.formDataKeyValue);
      AtToast.success('Form data submitted successfully.');
    } finally {
      setActionState('idle');
    }
  };

  const onCaptureSnapshot = async () => {
    if (snapshotAction !== 'idle' || actionState !== 'idle') return;

    const activeFormRef = getActionFormRef('Take snapshot');
    if (!activeFormRef) return;

    setSnapshotAction('capture');

    try {
      const current = normalizeFormSnapshotData(activeFormRef.getFormData());
      const stored = saveFormSnapshot(selectedExample.id, current);
      currentFormData.current = current;
      setLiveFormData(current);
      setFormSnapshot(stored);
      setSnapshotVerification(null);
      await wait(180);
      AtToast.success(`Snapshot saved locally for ${selectedExample.label}.`);
    } catch (error) {
      AtToast.error(error instanceof Error ? error.message : 'Unable to save the form snapshot.');
    } finally {
      setSnapshotAction('idle');
    }
  };

  const onRestoreSnapshot = async () => {
    if (snapshotAction !== 'idle' || actionState !== 'idle') return;

    const activeFormRef = getActionFormRef('Restore snapshot');
    if (!activeFormRef) return;

    const snapshot = formSnapshot ?? loadFormSnapshot(selectedExample.id);
    if (!snapshot) {
      AtToast.info('Take a snapshot for this example first.');
      return;
    }

    setSnapshotAction('restore');
    setSnapshotVerification(null);

    try {
      activeFormRef.reset({
        inputDefaultValue: snapshot.data.formDataSemiKeyValue,
        inputDefaultValueFormat: 'FormDataSemiKeyValue',
      });

      const startedAt = Date.now();
      let actual = normalizeFormSnapshotData(activeFormRef.getFormData());
      let verification = compareFormSnapshot(snapshot.data, actual);

      while (verification.status === 'failed' && Date.now() - startedAt < SNAPSHOT_VERIFY_TIMEOUT) {
        await wait(75);
        actual = normalizeFormSnapshotData(activeFormRef.getFormData());
        verification = compareFormSnapshot(snapshot.data, actual);
      }

      currentFormData.current = actual;
      setLiveFormData(actual);
      setSnapshotVerification(verification);

      if (verification.status === 'passed') {
        AtToast.success('Snapshot restored and all form-data formats match the saved state.');
      } else {
        AtToast.error(`Snapshot restore mismatch: ${verification.mismatches.join(' ')}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setSnapshotVerification({
        status: 'failed',
        checkedAt: new Date().toISOString(),
        mismatches: [message],
        differences: [],
      });
      AtToast.error(`Snapshot restore failed: ${message}`);
    } finally {
      setSnapshotAction('idle');
    }
  };

  const onClearSnapshot = () => {
    clearFormSnapshot(selectedExample.id);
    setFormSnapshot(null);
    setSnapshotVerification(null);
    AtToast.info(`Saved snapshot cleared for ${selectedExample.label}.`);
  };

  const onExampleChange = (nextExampleId: string) => {
    if (nextExampleId === selectedExampleId) return;

    formRef.current = null;
    currentFormData.current = null;
    setLiveFormData(null);
    setSavedFormData(null);
    setSelectedExampleId(nextExampleId);
    setActionState('idle');
    setSnapshotAction('idle');
    setSnapshotVerification(null);

    const url = new URL(window.location.href);
    url.searchParams.set('example', nextExampleId);
    window.history.replaceState({}, '', url);
  };


  const atFormLocalText = {
    Add: 'Local text Add',
    'This field can not be empty': 'Custom (This field can not be empty)',
  };

  const agGridLocalText = {
    filter: 'Local text Filter',
  };

  const SelectedComponent = selectedExample.component;
  const automatedTestMode = isAutomatedTestMode();
  const inspectorTestMode = automatedTestMode && isInspectorTestMode();
  const externalActionsEnabled = Boolean(selectedExample.refEnabled) || automatedTestMode;
  const onChangeEnabled = Boolean(selectedExample.onChangeEnabled) || automatedTestMode;
  const showDeveloperControls = import.meta.env.DEV && !automatedTestMode;
  const showInspector = !automatedTestMode || inspectorTestMode;

  const semiKeyValueJson = JSON.stringify(liveFormData?.formDataSemiKeyValue ?? {}, null, 2);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App" sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        <AtToastContainer />

        <AtFormConfigProvider
          value={{
            rtl,
            enums,
            uploadFilesToServer: ServiceManager.uploadFilesToServer,
            localText: atFormLocalText,
            agGridLocalText,
            customComponents: [
              {
                component: MyTextField,
                typeInfo: UiTypeUtils.createType({
                  type: 'MyTextField',
                  initialValue: '',
                  validation: UiTypeUtils.createValidation({
                    anyOf: [
                      { type: 'string', minLength: 1 },
                      { type: 'integer' },
                    ],
                  }),
                }),
              },
              {
                component: ReportComponent,
                typeInfo: UiTypeUtils.createUncontrolledType({
                  type: 'ReportComponent',
                }),
              },
            ],
          }}
        >
          <LocalizationProvider dateAdapter={AdapterMoment as any}>
            <Paper
                component="header"
                elevation={0}
                className="playground-toolbar"
                sx={(muiTheme) => ({
                  borderColor: muiTheme.palette.divider,
                  boxShadow: muiTheme.shadows[3],
                  bgcolor: muiTheme.palette.background.paper,
                })}
              >
                <Box className="playground-toolbar-grid">
                  <Box className="playground-brand">
                    <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 900, letterSpacing: '0.11em' }}>
                        ATMaterialForm
                      </Typography>
                      <Chip
                        size="small"
                        color={enums ? 'success' : 'warning'}
                        variant="outlined"
                        label={enums ? 'Ready' : 'Loading enums…'}
                      />
                    </Stack>
                    <Typography variant="h6" component="h1" noWrap title={selectedExample.label} sx={{ fontWeight: 850 }}>
                      {selectedExample.label}
                    </Typography>
                  </Box>

                  <Box className="example-selector-slot">
                    <ExampleSelector
                      examples={exampleList}
                      value={selectedExample}
                      onChange={onExampleChange}
                    />
                  </Box>

                  <Stack
                    direction="row"
                    spacing={0.75}
                    useFlexGap
                    className="playground-tools"
                    sx={{ alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' }}
                  >
                    <ToggleButtonGroup
                      exclusive
                      size="small"
                      value={themeMode}
                      onChange={(_, nextMode: ThemeMode | null) => {
                        if (nextMode) setThemeMode(nextMode);
                      }}
                      aria-label="Color theme"
                    >
                      <ToggleButton value="light" aria-label="Light theme">
                        <Tooltip title="Switch the playground shell and ATMaterialForm example to the light Material UI theme. The preference is saved locally; automated visual tests still use deterministic light mode.">
                          <span style={{ display: 'flex' }}><LightModeOutlinedIcon fontSize="small" /></span>
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton value="dark" aria-label="Dark theme">
                        <Tooltip title="Switch the playground shell and ATMaterialForm example to the dark Material UI theme so you can manually check dark-theme compatibility. The preference is saved locally.">
                          <span style={{ display: 'flex' }}><DarkModeOutlinedIcon fontSize="small" /></span>
                        </Tooltip>
                      </ToggleButton>
                    </ToggleButtonGroup>

                    <ToggleButtonGroup
                      exclusive
                      size="small"
                      value={rtl ? 'rtl' : 'ltr'}
                      onChange={(_, nextDirection: 'ltr' | 'rtl' | null) => {
                        if (nextDirection) setRtl(nextDirection === 'rtl');
                      }}
                      aria-label="Page direction"
                    >
                      <ToggleButton value="ltr" aria-label="Left to right">
                        <Tooltip title="Render the playground and pass rtl=false to ATMaterialForm so you can test the example in left-to-right layout.">
                          <span style={{ display: 'flex' }}><FormatTextdirectionLToR fontSize="small" /></span>
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton value="rtl" aria-label="Right to left">
                        <Tooltip title="Render the playground and pass rtl=true to ATMaterialForm so you can test right-to-left layout and component alignment.">
                          <span style={{ display: 'flex' }}><FormatTextdirectionRToL fontSize="small" /></span>
                        </Tooltip>
                      </ToggleButton>
                    </ToggleButtonGroup>

                    <Tooltip title="Reload the most recently submitted FormDataKeyValue into this example through AtForm.reset. This is available after a successful Submit and lets you manually verify save/load behavior.">
                      <span>
                        <Button
                          size="small"
                          variant="text"
                          startIcon={actionState === 'load'
                            ? <CircularProgress size={15} color="inherit" />
                            : <RestoreOutlinedIcon fontSize="small" />}
                          onClick={onLoadLastSubmitClick}
                          disabled={actionState !== 'idle' || snapshotAction !== 'idle'}
                        >
                          Load last
                        </Button>
                      </span>
                    </Tooltip>

                    <Tooltip title="Reset the current ATMaterialForm example to its original configured default values using the exposed form ref. A toast confirms when the reset finishes.">
                      <span>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={actionState === 'reset'
                            ? <CircularProgress size={15} color="inherit" />
                            : <RestartAltOutlinedIcon fontSize="small" />}
                          onClick={onSetDefaultValueClick}
                          disabled={actionState !== 'idle' || snapshotAction !== 'idle'}
                        >
                          Reset
                        </Button>
                      </span>
                    </Tooltip>

                    <Tooltip title="Run ATMaterialForm validation through the form ref. If valid, capture the current form values as the last submitted state; if invalid, highlighted fields and a warning show what needs attention.">
                      <span>
                        <Button
                          size="small"
                          startIcon={actionState === 'submit'
                            ? <CircularProgress size={15} color="inherit" />
                            : <SendOutlinedIcon fontSize="small" />}
                          onClick={onSubmitClick}
                          disabled={actionState !== 'idle' || snapshotAction !== 'idle'}
                        >
                          Submit
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                </Box>
              </Paper>

            <Box
              component="pre"
              data-testid="realtime-form-data"
              aria-hidden="true"
              sx={{ display: 'none' }}
            >
              {semiKeyValueJson}
            </Box>

            <Box className={automatedTestMode && !inspectorTestMode ? 'playground-workspace playground-workspace--test' : 'playground-workspace'}>
              <Box className="playground-main-column" dir={rtl ? 'rtl' : 'ltr'}>
                <Paper
                  component="main"
                  elevation={0}
                  className="example-surface"
                  aria-label={`${selectedExample.label} example`}
                  sx={(muiTheme) => ({
                    border: `1px solid ${muiTheme.palette.divider}`,
                  })}
                >
                  <Grid
                    id="selected-example-panel"
                    role="region"
                    aria-label={selectedExample.label}
                    data-testid="example-stage"
                    data-example-id={selectedExample.id}
                    data-enums-ready={enums ? 'true' : 'false'}
                    container
                    spacing={2}
                    sx={{ minWidth: 0, width: '100%', m: 0 }}
                  >
                    <SelectedComponent
                      key={selectedExample.id}
                      ref={externalActionsEnabled ? formRef : null}
                      onChange={onChangeEnabled ? onFormChange : null}
                    />
                  </Grid>
                </Paper>
              </Box>

              {showInspector ? (
                <PlaygroundInspector
                  section={inspectorSection}
                  onSectionChange={setInspectorSection}
                  exampleId={selectedExample.id}
                  formData={liveFormData}
                  showTests={showDeveloperControls}
                  liveEnabled={onChangeEnabled}
                  rtl={rtl}
                  snapshotEnabled={externalActionsEnabled}
                  snapshot={formSnapshot}
                  snapshotAction={snapshotAction}
                  snapshotVerification={snapshotVerification}
                  onCaptureSnapshot={onCaptureSnapshot}
                  onRestoreSnapshot={onRestoreSnapshot}
                  onClearSnapshot={onClearSnapshot}
                />
              ) : null}
            </Box>
          </LocalizationProvider>
        </AtFormConfigProvider>
      </Box>
    </ThemeProvider>
  );
}

export default App;
