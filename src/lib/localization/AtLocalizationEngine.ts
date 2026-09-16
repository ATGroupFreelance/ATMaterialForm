import { createAtLocalizer } from './createAtLocalizer';
import type { AtLocalizationDiagnostic, AtLocalizeFunction, AtLocalizer, AtMessageValues, CreateAtLocalizerOptions } from './localization.type';

export class AtLocalizationEngine {
    private localizer: AtLocalizer = createAtLocalizer();
    private readonly listeners = new Set<() => void>();

    public readonly t = ((
        key: string | null | undefined,
        fallbackOrValues?: string | AtMessageValues,
        values?: AtMessageValues,
    ) => this.localizer.t(key, fallbackOrValues, values)) as AtLocalizeFunction;

    public configure(options: CreateAtLocalizerOptions): void {
        this.localizer = createAtLocalizer(options);
        this.listeners.forEach((listener) => listener());
    }

    public has(key: string): boolean {
        return this.localizer.has(key);
    }

    public getDiagnostics(): readonly AtLocalizationDiagnostic[] {
        return this.localizer.getDiagnostics();
    }

    public subscribe(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
}
