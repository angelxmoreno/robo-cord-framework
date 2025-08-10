import pino from 'pino';

/**
 * Creates a minimal Pino logger for startup/bootstrap logging.
 *
 * This logger is used before the full LoggerService can be initialized,
 * particularly for configuration validation errors. It provides consistent
 * Pino-based logging during the bootstrap phase.
 *
 * @param level - Log level (default: 'info'). Use 'silent' to suppress output during tests.
 * @returns A Pino logger instance configured for startup logging
 *
 * @example
 * ```typescript
 * const logger = createStartupLogger('info');
 * logger.error('Configuration validation failed');
 *
 * // For tests - suppress output
 * const silentLogger = createStartupLogger('silent');
 * ```
 */
export function createStartupLogger(level: string = 'info') {
    return pino({
        level,
        // Simple console transport for startup logging
        // No file output or complex transports needed during bootstrap
        transport:
            level === 'silent'
                ? undefined
                : {
                      target: 'pino-pretty',
                      options: {
                          colorize: true,
                          translateTime: 'HH:MM:ss',
                          ignore: 'pid,hostname',
                      },
                  },
    });
}
