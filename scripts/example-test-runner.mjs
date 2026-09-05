import { spawn } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(rootDir, 'src', 'examples', 'exampleManifest.json');

const loadManifest = async () => JSON.parse(await readFile(manifestPath, 'utf8'));

const getExampleDefinition = async (exampleId) => {
  const manifest = await loadManifest();
  return manifest.find((entry) => entry.id === exampleId) ?? null;
};

const specPathFor = async (exampleId, kind) => {
  const example = await getExampleDefinition(exampleId);

  if (!example) {
    throw new Error(`Unknown example "${exampleId}".`);
  }

  if (kind !== 'regression' && kind !== 'performance' && kind !== 'visual-update') {
    throw new Error(`Unsupported test action "${kind}".`);
  }

  const absoluteSourcePath = path.join(rootDir, example.sourcePath.replace(/^\/+/, ''));
  const exampleDir = path.dirname(absoluteSourcePath);
  const fileName = kind === 'performance'
    ? `${example.id}.performance.spec.ts`
    : `${example.id}.spec.ts`;
  const specPath = path.join(exampleDir, 'test', fileName);

  await access(specPath);
  return path.relative(rootDir, specPath).split(path.sep).join('/');
};

const resolvePlaywrightCli = () => {
  // @playwright/test depends on the `playwright` package, whose package.json
  // exposes the CLI through its `bin` entry. Resolving that entry is more
  // reliable than relying on an undocumented @playwright/test/cli subpath.
  const packagePath = require.resolve('playwright/package.json');
  const packageJson = require(packagePath);
  const bin = typeof packageJson.bin === 'string'
    ? packageJson.bin
    : packageJson.bin?.playwright;

  if (!bin) {
    throw new Error('Unable to resolve the Playwright CLI from the installed package.');
  }

  return path.resolve(path.dirname(packagePath), bin);
};

const runProcess = (args, env) => new Promise((resolve, reject) => {
  let playwrightCli;

  try {
    playwrightCli = resolvePlaywrightCli();
  } catch {
    reject(new Error(
      'Playwright is not installed. Run "npm install" and then "npx playwright install chromium".',
    ));
    return;
  }

  const child = spawn(process.execPath, [playwrightCli, ...args], {
    cwd: rootDir,
    env,
    shell: false,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stdout = '';
  let stderr = '';

  child.stdout.on('data', (chunk) => {
    stdout += chunk.toString();
  });

  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  child.on('error', reject);
  child.on('close', (code) => {
    resolve({
      code: code ?? 1,
      stdout,
      stderr,
    });
  });
});

const parseStructuredResult = (stdout) => {
  const marker = '__ATFORM_RESULT__';
  const markerLine = stdout
    .split(/\r?\n/)
    .find((line) => line.startsWith(marker));

  if (!markerLine) return null;

  try {
    return JSON.parse(markerLine.slice(marker.length));
  } catch {
    return null;
  }
};

const hasMissingSnapshotFailure = (run, parsed) => {
  const combinedOutput = `${run.stdout}\n${run.stderr}`;
  const outputMentionsMissingSnapshot = combinedOutput.includes("A snapshot doesn't exist at")
    && combinedOutput.includes('writing actual');

  const parsedMentionsMissingSnapshot = (parsed?.tests ?? []).some((testResult) => (
    typeof testResult.error === 'string'
    && testResult.error.includes("A snapshot doesn't exist at")
  ));

  return outputMentionsMissingSnapshot || parsedMentionsMissingSnapshot;
};

const createRunArgs = (specPath, project, kind) => {
  const args = [
    'test',
    specPath,
    '--config=playwright.config.ts',
    `--project=${project}`,
    '--workers=1',
    '--reporter=./scripts/structured-reporter.mjs',
  ];

  if (kind === 'visual-update') {
    args.push('--grep', 'visual regression', '--update-snapshots=all');
  }

  return args;
};

const normalizeRunResult = ({
  run,
  parsed,
  exampleId,
  kind,
  startedAt,
  baselineCreated,
}) => {
  const fallbackDetails = [
    ...run.stderr.trim().split(/\r?\n/).filter(Boolean).slice(-8),
    ...run.stdout.trim().split(/\r?\n/).filter(Boolean).slice(-8),
  ];

  const passed = parsed?.passed ?? 0;
  const failed = parsed?.failed ?? (run.code === 0 ? 0 : 1);
  const status = run.code === 0 && parsed?.status === 'passed' ? 'passed' : 'failed';

  const details = [];
  const metrics = [];

  if (baselineCreated) {
    details.push('Created the missing visual baseline for this example, then reran the regression suite.');
  }

  for (const testResult of parsed?.tests ?? []) {
    if (testResult.error) {
      details.push(`${testResult.title}: ${testResult.error}`);
    }

    for (const metric of testResult.metrics ?? []) {
      metrics.push(metric);
    }
  }

  if (!parsed) {
    details.push(...fallbackDetails);
  }

  return {
    status,
    exampleId,
    kind,
    durationMs: parsed?.durationMs ?? Date.now() - startedAt,
    passed,
    failed,
    summary: kind === 'performance'
      ? `${exampleId} performance ${status}`
      : kind === 'visual-update'
        ? `${exampleId} visual baseline ${status === 'passed' ? 'updated' : 'update failed'}`
        : `${exampleId}: ${passed} passed${failed ? ` · ${failed} failed` : ''}`,
    details,
    metrics,
    baselineCreated: Boolean(baselineCreated),
  };
};

export const runExampleTests = async ({ exampleId, kind, baseURL }) => {
  const specPath = await specPathFor(exampleId, kind);
  const project = kind === 'performance' ? 'performance' : 'regression';
  const startedAt = Date.now();

  const env = {
    ...process.env,
  };

  // When no explicit baseURL is supplied, make sure an inherited value does
  // not disable Playwright's configured webServer. The normal/default path is
  // for Playwright to start its own isolated Vite server on port 4173.
  if (baseURL) {
    env.AT_TEST_BASE_URL = baseURL;
  } else {
    delete env.AT_TEST_BASE_URL;
  }

  const args = createRunArgs(specPath, project, kind);
  let run = await runProcess(args, env);
  let parsed = parseStructuredResult(run.stdout);
  let baselineCreated = false;

  // Playwright intentionally fails the first run when a screenshot baseline
  // does not exist, even though it writes the new image to disk. For the
  // playground's per-example developer action, that is setup rather than a
  // regression. Rerun once after the baseline is written. Real assertion or
  // visual-diff failures still fail normally on the second run.
  if (kind === 'regression' && hasMissingSnapshotFailure(run, parsed)) {
    baselineCreated = true;
    run = await runProcess(args, env);
    parsed = parseStructuredResult(run.stdout);
  }

  return normalizeRunResult({
    run,
    parsed,
    exampleId,
    kind,
    startedAt,
    baselineCreated,
  });
};

const runFromCli = async () => {
  const [, , kind, exampleId] = process.argv;

  if ((kind !== 'regression' && kind !== 'performance' && kind !== 'visual-update') || !exampleId) {
    console.error(
      'Usage:\n'
      + '  npm run test:example -- <ExampleId>\n'
      + '  npm run test-performance:example -- <ExampleId>\n'
      + '  npm run test:visual:example -- <ExampleId>',
    );
    process.exitCode = 2;
    return;
  }

  try {
    const result = await runExampleTests({
      exampleId,
      kind,
      baseURL: process.env.AT_TEST_BASE_URL,
    });

    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.status === 'passed' ? 0 : 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await runFromCli();
}
