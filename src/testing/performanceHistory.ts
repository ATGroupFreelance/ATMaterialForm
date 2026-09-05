export interface PerformanceHistoryMetric {
  name: string;
  median: number;
  limit: number;
  samples: number[];
  pass: boolean;
}

export interface PerformanceHistoryEntry {
  id: string;
  exampleId: string;
  createdAt: string;
  status: 'passed' | 'failed';
  durationMs: number;
  metrics: PerformanceHistoryMetric[];
}

const STORAGE_KEY = 'atmaterialform.performance-history.v1';
const MAX_RUNS_PER_EXAMPLE = 20;

type StoredHistory = Record<string, PerformanceHistoryEntry[]>;

const readStore = (): StoredHistory => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as StoredHistory;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeStore = (history: StoredHistory) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Performance history is a developer convenience. A disabled/full
    // localStorage must never prevent the actual test run from completing.
  }
};

export const getPerformanceHistory = (exampleId: string) => (
  readStore()[exampleId] ?? []
);

export const savePerformanceHistory = (
  exampleId: string,
  entry: Omit<PerformanceHistoryEntry, 'id' | 'exampleId' | 'createdAt'>,
) => {
  const store = readStore();
  const nextEntry: PerformanceHistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    exampleId,
    createdAt: new Date().toISOString(),
  };

  store[exampleId] = [
    nextEntry,
    ...(store[exampleId] ?? []),
  ].slice(0, MAX_RUNS_PER_EXAMPLE);

  writeStore(store);
  return store[exampleId];
};

export const clearPerformanceHistory = (exampleId: string) => {
  const store = readStore();
  delete store[exampleId];
  writeStore(store);
};
