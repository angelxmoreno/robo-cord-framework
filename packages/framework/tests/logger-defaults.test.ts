import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import type { LoggerOptions } from 'pino';
import { z } from 'zod';
import { LoggerService } from '../src/services';
import { createConfig } from '../src/utils';

describe('Logger Default Configuration', () => {
    let originalEnv: typeof process.env;
    let testLogsDir: string;

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

        testLogsDir = path.join(process.cwd(), 'logs');
    });

    afterEach(() => {
        // Restore original environment
        process.env = originalEnv;

        // Clean up test logs directory
        if (fs.existsSync(testLogsDir)) {
            const files = fs.readdirSync(testLogsDir);
            for (const file of files) {
                if (file.includes('development.log') || file.includes('production.log')) {
                    fs.unlinkSync(path.join(testLogsDir, file));
                }
            }
        }
    });

    it('should create development logger defaults with pino-pretty', () => {
        process.env.NODE_ENV = 'development';

        const UserSchema = z.object({
            testValue: z.string().default('test'),
        });

        const config = createConfig(UserSchema, {}, { shouldExit: false });

        expect(config.logger.level).toBe('debug');
        expect(config.logger.transport).toBeDefined();

        // Type-safe access to transport properties
        const transport = config.logger.transport as { target: string; options: { colorize: boolean } };
        expect(transport?.target).toBe('pino-pretty');
        expect(transport?.options?.colorize).toBe(true);

        // Should create logs directory
        expect(fs.existsSync(testLogsDir)).toBe(true);

        // Should work with LoggerService
        const loggerService = new LoggerService(config.logger as LoggerOptions);
        expect(loggerService.baseLogger).toBeDefined();
    });

    it('should create production logger defaults with JSON format', () => {
        process.env.NODE_ENV = 'production';

        const UserSchema = z.object({
            testValue: z.string().default('test'),
        });

        const config = createConfig(UserSchema, {}, { shouldExit: false });

        expect(config.logger.level).toBe('info');
        expect(config.logger.destination).toBeDefined();
        expect(config.logger.transport).toBeUndefined();

        // Should create logs directory
        expect(fs.existsSync(testLogsDir)).toBe(true);

        // Should work with LoggerService
        const loggerService = new LoggerService(config.logger as LoggerOptions);
        expect(loggerService.baseLogger).toBeDefined();
    });

    it('should allow user overrides of logger defaults', () => {
        process.env.NODE_ENV = 'development';

        const UserSchema = z.object({
            testValue: z.string().default('test'),
        });

        const config = createConfig(
            UserSchema,
            {
                logger: {
                    level: 'warn',
                    name: 'custom-logger',
                },
            },
            { shouldExit: false }
        );

        // User overrides should merge with defaults
        expect(config.logger.level).toBe('warn');
        expect(config.logger.name).toBe('custom-logger');
        // But transport should still be from defaults
        expect(config.logger.transport).toBeDefined();
    });

    it('should completely override logger config when user provides transport', () => {
        const UserSchema = z.object({
            testValue: z.string().default('test'),
        });

        const config = createConfig(
            UserSchema,
            {
                logger: {
                    level: 'error',
                    transport: {
                        target: 'pino/file',
                        options: {
                            destination: './custom.log',
                        },
                    },
                },
            },
            { shouldExit: false }
        );

        expect(config.logger.level).toBe('error');

        // Type-safe access to transport properties
        const transport = config.logger.transport as { target: string; options: { destination: string } };
        expect(transport?.target).toBe('pino/file');
        expect(transport?.options?.destination).toBe('./custom.log');
    });
});
