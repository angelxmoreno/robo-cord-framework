import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { createConfig } from '@framework/utils';
import { z } from 'zod';

describe('createConfig', () => {
    let originalEnv: typeof process.env;

    // Helper to create standard user schema (clean, no preprocessing)
    const createUserSchema = () =>
        z.object({
            ollamaUrl: z.string().url('Invalid URL format'),
        });

    // Helper to create extended user schema for merge test
    const createExtendedUserSchema = () =>
        z.object({
            ollamaUrl: z.string().url('Invalid URL format'),
            customSetting: z.string(),
        });

    // Helper to create standard config overrides
    const createStandardOverrides = () => ({
        ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
    });

    // Helper to create extended config overrides
    const createExtendedOverrides = () => ({
        ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
        customSetting: process.env.CUSTOM_SETTING || 'custom_value',
    });

    // Helper to test config validation errors
    const expectConfigError = (
        envSetup: () => void,
        schema = createUserSchema(),
        overrides = createStandardOverrides()
    ) => {
        envSetup();

        const consoleSpy = spyOn(console, 'error').mockImplementation(() => {});
        const exitSpy = spyOn(process, 'exit').mockImplementation(
            (code?: string | number | null | undefined): never => {
                throw new Error(`process.exit called with code ${code}`);
            }
        );

        expect(() => createConfig(schema, overrides)).toThrow('process.exit called with code 1');
        expect(consoleSpy).toHaveBeenCalledWith('❌ Configuration validation failed!\n');

        consoleSpy.mockRestore();
        exitSpy.mockRestore();
    };

    beforeEach(() => {
        // Save original environment
        originalEnv = { ...process.env };
        process.env.DISCORD_TOKEN = 'valid_discord_token';
        process.env.DB_HOST = 'localhost';
        process.env.DB_PORT = '5432';
        process.env.DB_DATABASE = 'test_db';
        process.env.DB_USERNAME = 'test_user';
        process.env.DB_PASSWORD = 'test_pass';
        process.env.OLLAMA_URL = 'http://localhost:11434';
        process.env.CUSTOM_SETTING = 'custom_value';
    });

    afterEach(() => {
        // Restore original environment
        process.env = originalEnv;
    });

    it('should successfully parse valid configuration', () => {
        const config = createConfig(createUserSchema(), createStandardOverrides());

        expect(config.discord.token).toBe('valid_discord_token');
        expect(config.database.host).toBe('localhost');
        expect(config.database.port).toBe(5432);
        expect(config.database.database).toBe('test_db');
        expect(config.database.username).toBe('test_user');
        expect(config.database.password).toBe('test_pass');
        expect(config.ollamaUrl).toBe('http://localhost:11434');
    });

    it('should use default values for optional database fields', () => {
        const config = createConfig(createUserSchema(), createStandardOverrides());

        expect(config.database.host).toBe('localhost'); // default
        expect(config.database.port).toBe(5432); // default
    });

    it('should throw ZodError for missing required DISCORD_TOKEN', () => {
        expectConfigError(() => delete process.env.DISCORD_TOKEN);
    });

    it('should throw ZodError for missing required database fields', () => {
        expectConfigError(() => {
            delete process.env.DB_DATABASE;
            delete process.env.DB_USERNAME;
            delete process.env.DB_PASSWORD;
        });
    });

    it('should throw ZodError for invalid URL in user schema', () => {
        expectConfigError(
            () => {
                process.env.OLLAMA_URL = 'not-a-valid-url';
            },
            createUserSchema(),
            { ollamaUrl: 'not-a-valid-url' } // Override with invalid URL
        );
    });

    it('should throw ZodError for invalid port number', () => {
        expectConfigError(() => {
            process.env.DB_PORT = 'not-a-number';
        });
    });

    it('should properly merge base schema with user schema', () => {
        const config = createConfig(createExtendedUserSchema(), createExtendedOverrides());

        // Should have base schema properties
        expect(config.discord.token).toBe('valid_discord_token');
        expect(config.database.database).toBe('test_db');

        // Should have user schema properties
        expect(config.ollamaUrl).toBe('http://localhost:11434');
        expect(config.customSetting).toBe('custom_value');
    });

    it('should use overrides when provided', () => {
        const customOverrides = {
            ollamaUrl: 'http://custom:8080',
            discord: {
                token: 'override_token',
            },
            database: {
                host: 'override_host',
                port: 3000,
                database: 'override_db',
                username: 'override_user',
                password: 'override_pass',
            },
        };

        const config = createConfig(createUserSchema(), customOverrides);

        expect(config.ollamaUrl).toBe('http://custom:8080');
        expect(config.discord.token).toBe('override_token');
        expect(config.database.host).toBe('override_host');
        expect(config.database.port).toBe(3000);
        expect(config.database.database).toBe('override_db');
        expect(config.database.username).toBe('override_user');
        expect(config.database.password).toBe('override_pass');
    });

    it('should work without overrides parameter', () => {
        // Set ollamaUrl directly on process.env to match the schema field name
        process.env.ollamaUrl = 'http://localhost:11434';

        const config = createConfig(createUserSchema());

        expect(config.discord.token).toBe('valid_discord_token');
        expect(config.database.host).toBe('localhost');
        expect(config.ollamaUrl).toBe('http://localhost:11434');

        // Clean up
        delete process.env.ollamaUrl;
    });

    it('should prioritize overrides over environment variables', () => {
        // Set env var first
        process.env.OLLAMA_URL = 'http://env:9999';

        const overrides = {
            ollamaUrl: 'http://override:7777',
        };

        const config = createConfig(createUserSchema(), overrides);

        expect(config.ollamaUrl).toBe('http://override:7777');

        // Clean up
        process.env.OLLAMA_URL = 'http://localhost:11434';
    });
});
