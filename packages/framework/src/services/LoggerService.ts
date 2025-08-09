import pino, { type Logger, type LoggerOptions } from 'pino';
import { injectable } from 'tsyringe';

@injectable()
export class LoggerService {
    protected loggers: Map<string, Logger> = new Map();
    public readonly baseLogger: Logger;

    constructor(loggerOptions: LoggerOptions = {}) {
        this.baseLogger = pino(loggerOptions);
    }

    /**
     * Get or create a named child logger.
     * @param loggerName The unique name for the child logger.
     * @returns Logger instance tagged with loggerName.
     */
    getLogger(loggerName: string): Logger {
        const cached = this.loggers.get(loggerName);
        if (cached) return cached;

        const childLogger = this.baseLogger.child({ name: loggerName });
        this.loggers.set(loggerName, childLogger);
        return childLogger;
    }

    /**
     * Clear all cached child loggers.
     * Useful for testing or when reconfiguring logging.
     */
    clearLoggers(): void {
        this.loggers.clear();
    }

    /**
     * Get the number of cached child loggers.
     */
    get loggerCount(): number {
        return this.loggers.size;
    }
}
