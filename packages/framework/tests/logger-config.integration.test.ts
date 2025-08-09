import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { LoggerService } from '../src/services';
import { createConfig } from '../src/utils';

describe('LoggerService Configuration Integration', () => {
    let originalEnv: typeof process.env;

    beforeEach(() => {
        // Save original environment
        originalEnv = { ...process.env };
        // Set required environment variables for tests
        process.env.DISCORD_TOKEN = 'valid_discord_token';
        process.env.DB_HOST = 'localhost';
        process.env.DB_PORT = '5432';
        process.env.DB_DATABASE = 'test_db';
        process.env.DB_USERNAME = 'test_user';
        process.env.DB_PASSWORD = 'test_pass';
    });

    afterEach(() => {
        // Restore original environment
        process.env = originalEnv;
    });

    it('should create LoggerService with config-provided options', () => {
        // Create a simple user schema
        const UserSchema = z.object({
            testValue: z.string().default('test'),
        });

        // Create config with logger overrides
        const config = createConfig(
            UserSchema,
            {
                testValue: 'integration-test',
                logger: {
                    level: 'warn',
                    name: 'integration-test-logger',
                },
            },
            { shouldExit: false }
        );

        // Verify the config contains our logger settings
        expect(config.logger.level).toBe('warn');
        expect(config.logger.name).toBe('integration-test-logger');

        // Create LoggerService with config options
        const loggerService = new LoggerService(config.logger);

        expect(loggerService.baseLogger).toBeDefined();
        expect(loggerService.baseLogger.level).toBe('warn');
    });

    it('should use default logger configuration when no overrides provided', () => {
        const UserSchema = z.object({
            testValue: z.string().default('test'),
        });

        const config = createConfig(UserSchema, {}, { shouldExit: false });

        // Should have default logger config
        expect(config.logger).toBeDefined();
        expect(config.logger.level).toBe('debug'); // Should be debug in test env

        const loggerService = new LoggerService(config.logger);
        expect(loggerService.baseLogger).toBeDefined();
    });
});
