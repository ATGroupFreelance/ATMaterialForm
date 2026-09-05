import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(rootDir, 'src', 'examples', 'exampleManifest.json');

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const errors = [];
const seen = new Set();

for (const example of manifest) {
  if (seen.has(example.id)) {
    errors.push(`${example.id}: duplicate manifest ID`);
    continue;
  }

  seen.add(example.id);

  const sourcePath = path.join(rootDir, example.sourcePath.replace(/^\/+/, ''));
  const exampleDir = path.dirname(sourcePath);
  const regressionSpec = path.join(exampleDir, 'test', `${example.id}.spec.ts`);
  const performanceSpec = path.join(exampleDir, 'test', `${example.id}.performance.spec.ts`);

  for (const [label, target] of [
    ['source', sourcePath],
    ['regression spec', regressionSpec],
    ['performance spec', performanceSpec],
  ]) {
    try {
      await access(target);
    } catch {
      errors.push(`${example.id}: missing ${label} (${path.relative(rootDir, target)})`);
    }
  }
}

if (errors.length) {
  console.error('Example coverage check failed:\n');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Example coverage check: ${manifest.length} examples have regression + performance specs.`);
