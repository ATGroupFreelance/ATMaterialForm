export enum LogLevel {
    NONE = 0,   // No logs
    ERROR = 1,  // Only errors
    WARN = 2,   // Warnings + errors
    INFO = 3,   // Info + warnings + errors
    DEBUG = 4,  // All logs, including debug info
}

type LoggerOptions = {
    prefix?: string;
    preventDuplicates?: boolean;
};

function stableStringify(value: unknown): string {
    const seen = new WeakSet();

    function replacer(_key: string, val: unknown) {
        if (typeof val === "function") {
            return "[Function]";
        }
        if (typeof val === "object" && val !== null) {
            if (seen.has(val)) {
                return "[Circular]";
            }
            seen.add(val);
        }
        return val;
    }

    function sortObjectKeys(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(sortObjectKeys);
        } else if (obj && typeof obj === "object") {
            const sorted: any = {};
            Object.keys(obj)
                .sort()
                .forEach((key) => {
                    sorted[key] = sortObjectKeys(obj[key]);
                });
            return sorted;
        }
        return obj;
    }

    try {
        const sortedValue = sortObjectKeys(value);
        return JSON.stringify(sortedValue, replacer);
    } catch {
        return String(value);
    }
}

export function createLogger(
    logLevel: LogLevel = LogLevel.INFO,
    options: LoggerOptions = {}
) {
    const { prefix = "", preventDuplicates = false } = options;

    // Map message key => { count, timer }
    const messageCache = new Map<string, { count: number; timer: number | null }>();

    function logWithDupCheck(
        level: LogLevel,
        consoleMethod: (...args: unknown[]) => void,
        args: unknown[]
    ) {
        if (logLevel < level) return;

        // Serialize entire args array for stable dedupe key
        const key = prefix + " " + stableStringify(args);

        if (preventDuplicates) {
            const entry = messageCache.get(key);
            if (entry) {
                entry.count++;
                if (entry.timer !== null) {
                    clearTimeout(entry.timer);
                }

                entry.timer = window.setTimeout(() => {
                    messageCache.delete(key);
                }, 5000);

                // Print repeated message with colorized label and prefix
                consoleMethod(
                    `%c[Repeated ${entry.count}x]: %c${prefix}`,
                    "color: orange; font-weight: bold;",
                    "color: teal; font-weight: bold;",
                    ...args
                );
            } else {
                messageCache.set(key, { count: 1, timer: null });
                // Colorize prefix on first log
                consoleMethod(`%c${prefix}`, "color: teal; font-weight: bold;", ...args);
            }
        } else {
            // No deduplication - just colorize prefix
            consoleMethod(`%c${prefix}`, "color: teal; font-weight: bold;", ...args);
        }
    }

    return {
        setLevel(level: LogLevel) {
            logLevel = level;
        },

        error(...args: unknown[]) {
            logWithDupCheck(LogLevel.ERROR, console.error, args);
        },

        warn(...args: unknown[]) {
            logWithDupCheck(LogLevel.WARN, console.warn, args);
        },

        info(...args: unknown[]) {
            logWithDupCheck(LogLevel.INFO, console.info, args);
        },

        debug(...args: unknown[]) {
            logWithDupCheck(LogLevel.DEBUG, console.log, args);
        },
    };
}
