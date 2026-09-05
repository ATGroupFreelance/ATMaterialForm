import {
  expect,
  type Locator,
  type Page,
  type TestInfo,
} from '@playwright/test';

const VISUAL_BASELINE_VERSION = 'v2';

export const exampleUrl = (
  exampleId: string,
  options: { inspector?: boolean } = {},
) => {
  const params = new URLSearchParams({
    example: exampleId,
    testMode: '1',
  });

  if (options.inspector) params.set('inspector', '1');
  return `/?${params.toString()}`;
};

const escapeAttributeValue = (value: string) => (
  value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
);

export const byFieldId = (page: Page, id: string): Locator => (
  page.locator(`[id="${escapeAttributeValue(id)}"]`).first()
);

export const exampleStage = (page: Page) => page.getByTestId('example-stage');

const waitForTwoAnimationFrames = async (page: Page) => {
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
};

export const openExample = async (
  page: Page,
  exampleId: string,
  options: { inspector?: boolean } = {},
) => {
  await page.goto(exampleUrl(exampleId, options), {
    waitUntil: 'domcontentloaded',
  });

  const stage = exampleStage(page);

  await expect(stage).toBeVisible();
  await expect(stage).toHaveAttribute('data-example-id', exampleId);
  await expect(stage).toHaveAttribute('data-enums-ready', 'true', {
    timeout: 10_000,
  });

  await page.evaluate(async () => {
    if ('fonts' in document) {
      await document.fonts.ready;
    }
  });

  await waitForTwoAnimationFrames(page);
};

export const expectExampleScreenshot = async (
  page: Page,
  exampleId: string,
) => {
  const stage = exampleStage(page);

  await expect(stage).toHaveScreenshot(`${exampleId}.${VISUAL_BASELINE_VERSION}.png`, {
    animations: 'disabled',
    caret: 'hide',
  });
};

export const readFormOutput = async (page: Page) => {
  const raw = await page.getByTestId('realtime-form-data').textContent();

  try {
    return JSON.parse(raw || '{}') as Record<string, unknown>;
  } catch {
    throw new Error(`Unable to parse form output: ${raw}`);
  }
};

export const expectFormOutput = async (
  page: Page,
  expected: Record<string, unknown>,
) => {
  await expect.poll(
    () => readFormOutput(page),
    {
      message: `Expected live FormDataSemiKeyValue to contain ${JSON.stringify(expected)}`,
    },
  ).toMatchObject(expected);
};

export const selectAutocompleteOption = async (
  page: Page,
  label: string,
  optionText: string,
) => {
  const input = page.getByLabel(label, { exact: true });

  await input.click();
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.getByRole('option', { name: optionText, exact: true }).click();
};

export const median = (values: number[]) => {
  if (!values.length) {
    throw new Error('Cannot calculate the median of an empty sample.');
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
};

export interface PerformanceMetric {
  name: string;
  median: number;
  limit: number;
  samples: number[];
  pass: boolean;
}

interface PerformanceOptions {
  renderLimitMs?: number;
  interactionLimitMs?: number;
  runs?: number;
  interaction?: (page: Page, runIndex: number) => Promise<void>;
}

const recordMetric = (
  testInfo: TestInfo,
  metric: PerformanceMetric,
) => {
  testInfo.annotations.push({
    type: 'performance',
    description: JSON.stringify(metric),
  });
};

const browserNow = (page: Page) => page.evaluate(() => performance.now());

const settle = async (page: Page) => {
  await waitForTwoAnimationFrames(page);
};

const measureRender = async (page: Page, exampleId: string) => {
  await page.goto(exampleUrl(exampleId), {
    waitUntil: 'domcontentloaded',
  });

  const stage = exampleStage(page);

  await expect(stage).toHaveAttribute('data-example-id', exampleId);
  await expect(stage).toHaveAttribute('data-enums-ready', 'true', {
    timeout: 10_000,
  });

  await settle(page);

  // performance.now() is relative to this navigation's time origin, so this
  // measures browser-side navigation + React render + example initialization.
  return browserNow(page);
};

export const runPerformanceRegression = async (
  page: Page,
  testInfo: TestInfo,
  exampleId: string,
  options: PerformanceOptions = {},
) => {
  const runs = options.runs ?? 5;
  const renderLimitMs = options.renderLimitMs ?? 2500;
  const interactionLimitMs = options.interactionLimitMs ?? 700;

  // Warm-up: compile/load modules and populate browser caches before samples.
  await openExample(page, exampleId);

  const renderSamples: number[] = [];

  for (let index = 0; index < runs; index += 1) {
    renderSamples.push(await measureRender(page, exampleId));
  }

  const renderMedian = median(renderSamples);
  const renderMetric: PerformanceMetric = {
    name: 'Initial render',
    median: renderMedian,
    limit: renderLimitMs,
    samples: renderSamples,
    pass: renderMedian <= renderLimitMs,
  };

  recordMetric(testInfo, renderMetric);

  expect(
    renderMedian,
    `${exampleId} initial render median ${renderMedian.toFixed(1)}ms exceeded ${renderLimitMs}ms`,
  ).toBeLessThanOrEqual(renderLimitMs);

  if (!options.interaction) return;

  // Warm up the interaction separately.
  await openExample(page, exampleId);
  await options.interaction(page, -1);
  await settle(page);

  const interactionSamples: number[] = [];

  for (let index = 0; index < runs; index += 1) {
    await openExample(page, exampleId);

    const startedAt = await browserNow(page);
    await options.interaction(page, index);
    await settle(page);
    const completedAt = await browserNow(page);

    interactionSamples.push(completedAt - startedAt);
  }

  const interactionMedian = median(interactionSamples);
  const interactionMetric: PerformanceMetric = {
    name: 'Primary interaction',
    median: interactionMedian,
    limit: interactionLimitMs,
    samples: interactionSamples,
    pass: interactionMedian <= interactionLimitMs,
  };

  recordMetric(testInfo, interactionMetric);

  expect(
    interactionMedian,
    `${exampleId} interaction median ${interactionMedian.toFixed(1)}ms exceeded ${interactionLimitMs}ms`,
  ).toBeLessThanOrEqual(interactionLimitMs);
};
