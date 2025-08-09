import 'reflect-metadata';
import { describe, expect, it } from 'bun:test';
import { LoggerService } from '../src/services';

describe('LoggerService', () => {
    it('should create a base logger with default options', () => {
        const loggerService = new LoggerService();

        expect(loggerService.baseLogger).toBeDefined();
        expect(typeof loggerService.baseLogger.info).toBe('function');
    });

    it('should create a base logger with custom options', () => {
        const loggerService = new LoggerService({
            level: 'warn',
            name: 'test-logger',
        });

        expect(loggerService.baseLogger).toBeDefined();
        expect(loggerService.baseLogger.level).toBe('warn');
    });

    it('should create and cache named child loggers', () => {
        const loggerService = new LoggerService();

        const logger1 = loggerService.getLogger('test-service');
        const logger2 = loggerService.getLogger('test-service');

        // Should return the same cached instance
        expect(logger1).toBe(logger2);
        expect(logger1).toBeDefined();
        expect(typeof logger1.info).toBe('function');
    });

    it('should create different loggers for different names', () => {
        const loggerService = new LoggerService();

        const logger1 = loggerService.getLogger('service-a');
        const logger2 = loggerService.getLogger('service-b');

        expect(logger1).not.toBe(logger2);
        expect(logger1).toBeDefined();
        expect(logger2).toBeDefined();
    });

    it('should create child loggers with the correct name bindings', () => {
        const loggerService = new LoggerService();

        const logger = loggerService.getLogger('my-service');

        // Check that the child logger has the name binding
        // Note: This tests the internal pino structure
        expect(logger.bindings()).toEqual({ name: 'my-service' });
    });

    it('should track logger count correctly', () => {
        const loggerService = new LoggerService();

        expect(loggerService.loggerCount).toBe(0);

        loggerService.getLogger('service-1');
        expect(loggerService.loggerCount).toBe(1);

        loggerService.getLogger('service-2');
        expect(loggerService.loggerCount).toBe(2);

        // Getting the same logger shouldn't increase count
        loggerService.getLogger('service-1');
        expect(loggerService.loggerCount).toBe(2);
    });

    it('should clear all cached loggers', () => {
        const loggerService = new LoggerService();

        loggerService.getLogger('service-1');
        loggerService.getLogger('service-2');
        expect(loggerService.loggerCount).toBe(2);

        loggerService.clearLoggers();
        expect(loggerService.loggerCount).toBe(0);

        // Should create new loggers after clearing
        const newLogger = loggerService.getLogger('service-1');
        expect(newLogger).toBeDefined();
        expect(loggerService.loggerCount).toBe(1);
    });
});
