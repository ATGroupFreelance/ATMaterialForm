import { spawn } from 'node:child_process';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const resolvePlaywrightCli = () => {
  const packagePath = require.resolve('playwright/package.json');
  const packageJson = require(packagePath);
  const bin = typeof packageJson.bin === 'string'
    ? packageJson.bin
    : packageJson.bin?.playwright;

  if (!bin) throw new Error('Unable to resolve the Playwright CLI.');
  return path.resolve(path.dirname(packagePath), bin);
};

const runPlaywright = () => new Promise((resolve, reject) => {
  let cli;

  try {
    cli = resolvePlaywrightCli();
  } catch {
    reject(new Error(
      'Playwright is not installed. Run "npm install" and then "npm run test:setup".',
    ));
    return;
  }

  const child = spawn(process.execPath, [
    cli,
    'test',
    '--config=playwright.config.ts',
    '--project=regression',
  ], {
    cwd: rootDir,
    env: process.env,
    shell: false,
    windowsHide: true,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  let output = '';

  const forward = (stream, target) => {
    stream.on('data', (chunk) => {
      const value = chunk.toString();
      output += value;
      target.write(value);
    });
  };

  forward(child.stdout, process.stdout);
  forward(child.stderr, process.stderr);

  child.on('error', reject);
  child.on('close', (code) => resolve({ code: code ?? 1, output }));
});

const isMissingBaselineRun = (output) => (
  output.includes("A snapshot doesn't exist at")
  && output.includes('writing actual')
);

try {
  let result = await runPlaywright();

  if (result.code !== 0 && isMissingBaselineRun(result.output)) {
    process.stdout.write('\nMissing visual baselines were created. Rerunning regression suite...\n\n');
    result = await runPlaywright();
  }

  process.exitCode = result.code;
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
