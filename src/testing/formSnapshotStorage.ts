import type { AtFormOnChangeInterface } from '@/lib/types/AtForm.type';

export interface StoredFormSnapshot {
  version: 1;
  exampleId: string;
  createdAt: string;
  data: AtFormOnChangeInterface;
}

export type SnapshotDifferenceKind = 'changed' | 'missing' | 'unexpected';
export type SnapshotDataFormat = 'FormDataSemiKeyValue' | 'FormDataKeyValue' | 'FormData';

export interface SnapshotDifference {
  format: SnapshotDataFormat;
  path: string;
  kind: SnapshotDifferenceKind;
  expected: unknown;
  actual: unknown;
}

export interface SnapshotVerificationResult {
  status: 'passed' | 'failed';
  checkedAt: string;
  mismatches: string[];
  differences: SnapshotDifference[];
}

const STORAGE_PREFIX = 'atmaterialform.form-snapshot.v1.';

const keyFor = (exampleId: string) => `${STORAGE_PREFIX}${exampleId}`;

const normalizeForStorage = <T,>(value: T): T => {
  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch {
    return value;
  }
};

const sortRecursively = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortRecursively);

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, sortRecursively(child)]),
    );
  }

  return value;
};

const stableStringify = (value: unknown) => JSON.stringify(sortRecursively(normalizeForStorage(value)));

const isRecord = (value: unknown): value is Record<string, unknown> => (
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)
);

const appendObjectPath = (path: string, key: string) => (
  /^[A-Za-z_$][\w$]*$/.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`
);

const collectDifferences = (
  format: SnapshotDataFormat,
  expected: unknown,
  actual: unknown,
  path = '$',
): SnapshotDifference[] => {
  if (stableStringify(expected) === stableStringify(actual)) return [];

  if (Array.isArray(expected) && Array.isArray(actual)) {
    const differences: SnapshotDifference[] = [];
    const length = Math.max(expected.length, actual.length);

    for (let index = 0; index < length; index += 1) {
      const nextPath = `${path}[${index}]`;
      const expectedExists = index < expected.length;
      const actualExists = index < actual.length;

      if (!actualExists) {
        differences.push({
          format,
          path: nextPath,
          kind: 'missing',
          expected: expected[index],
          actual: undefined,
        });
      } else if (!expectedExists) {
        differences.push({
          format,
          path: nextPath,
          kind: 'unexpected',
          expected: undefined,
          actual: actual[index],
        });
      } else {
        differences.push(...collectDifferences(format, expected[index], actual[index], nextPath));
      }
    }

    return differences;
  }

  if (isRecord(expected) && isRecord(actual)) {
    const differences: SnapshotDifference[] = [];
    const keys = Array.from(new Set([...Object.keys(expected), ...Object.keys(actual)])).sort();

    for (const key of keys) {
      const nextPath = appendObjectPath(path, key);
      const expectedExists = Object.prototype.hasOwnProperty.call(expected, key);
      const actualExists = Object.prototype.hasOwnProperty.call(actual, key);

      if (!actualExists) {
        differences.push({
          format,
          path: nextPath,
          kind: 'missing',
          expected: expected[key],
          actual: undefined,
        });
      } else if (!expectedExists) {
        differences.push({
          format,
          path: nextPath,
          kind: 'unexpected',
          expected: undefined,
          actual: actual[key],
        });
      } else {
        differences.push(...collectDifferences(format, expected[key], actual[key], nextPath));
      }
    }

    return differences;
  }

  return [{
    format,
    path,
    kind: 'changed',
    expected,
    actual,
  }];
};

export const normalizeFormSnapshotData = (value: AtFormOnChangeInterface): AtFormOnChangeInterface => (
  normalizeForStorage(value)
);

export const loadFormSnapshot = (exampleId: string): StoredFormSnapshot | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(keyFor(exampleId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredFormSnapshot;
    if (parsed?.version !== 1 || parsed.exampleId !== exampleId || !parsed.data) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveFormSnapshot = (
  exampleId: string,
  data: AtFormOnChangeInterface,
): StoredFormSnapshot => {
  const snapshot: StoredFormSnapshot = {
    version: 1,
    exampleId,
    createdAt: new Date().toISOString(),
    data: normalizeFormSnapshotData(data),
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(keyFor(exampleId), JSON.stringify(snapshot));
  }

  return snapshot;
};

export const clearFormSnapshot = (exampleId: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(keyFor(exampleId));
};

export const compareFormSnapshot = (
  expected: AtFormOnChangeInterface,
  actual: AtFormOnChangeInterface,
): SnapshotVerificationResult => {
  const differences: SnapshotDifference[] = [];
  const comparisons: Array<[
    keyof AtFormOnChangeInterface,
    SnapshotDataFormat,
  ]> = [
    ['formDataSemiKeyValue', 'FormDataSemiKeyValue'],
    ['formDataKeyValue', 'FormDataKeyValue'],
    ['formData', 'FormData'],
  ];

  for (const [key, format] of comparisons) {
    differences.push(...collectDifferences(format, expected[key], actual[key]));
  }

  const mismatchedFormats = Array.from(new Set(differences.map((difference) => difference.format)));
  const mismatches = mismatchedFormats.map((format) => `${format} did not return to the saved snapshot.`);

  return {
    status: differences.length ? 'failed' : 'passed',
    checkedAt: new Date().toISOString(),
    mismatches,
    differences,
  };
};
