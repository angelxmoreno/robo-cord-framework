import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { createConfig } from '../packages/framework/src/utils/createConfig';

describe('Schema Improvements', () => {
    describe('Production Safety', () => {
        it('should prevent database synchronization in production', () => {
            const TestSchema = z.object({
                customField: z.string().default('test'),
            });

            expect(() => {
                createConfig(
                    TestSchema,
                    {
                        isDevelopment: false, // Production mode
                        discord: { token: 'test-token', clientId: '123456789012345678' },
                        database: {
                            host: 'localhost',
                            port: 5432,
                            database: 'test',
                            username: 'user',
                            password: 'pass',
                            synchronize: true, // This should fail in production
                        },
                    },
                    { shouldExit: false, silent: true }
                );
            }).toThrow('Database synchronization must be disabled in production environments');
        });

        it('should allow database synchronization in development', () => {
            const TestSchema = z.object({
                customField: z.string().default('test'),
            });

            expect(() => {
                createConfig(
                    TestSchema,
                    {
                        isDevelopment: true, // Development mode
                        discord: { token: 'test-token', clientId: '123456789012345678' },
                        database: {
                            host: 'localhost',
                            port: 5432,
                            database: 'test',
                            username: 'user',
                            password: 'pass',
                            synchronize: true, // This should be allowed in development
                        },
                    },
                    { shouldExit: false }
                );
            }).not.toThrow();
        });
    });

    describe('Database Schema Improvements', () => {
        it('should coerce string port to number and validate range', () => {
            const TestSchema = z.object({
                customField: z.string().default('test'),
            });

            // Valid port as string should be coerced
            const config = createConfig(
                TestSchema,
                {
                    discord: { token: 'test-token' },
                    database: {
                        host: 'localhost',
                        port: '3306' as unknown, // String port should be coerced
                        database: 'test',
                        username: 'user',
                        password: 'pass',
                    },
                },
                { shouldExit: false }
            );

            expect(config.database.port).toBe(3306);
            expect(typeof config.database.port).toBe('number');
        });

        it('should reject invalid port ranges', () => {
            const TestSchema = z.object({
                customField: z.string().default('test'),
            });

            expect(() => {
                createConfig(
                    TestSchema,
                    {
                        discord: { token: 'test-token' },
                        database: {
                            host: 'localhost',
                            port: 70000, // Invalid port range
                            database: 'test',
                            username: 'user',
                            password: 'pass',
                        },
                    },
                    { shouldExit: false, silent: true }
                );
            }).toThrow();
        });

        it('should coerce boolean fields and use safe defaults', () => {
            const TestSchema = z.object({
                customField: z.string().default('test'),
            });

            const config = createConfig(
                TestSchema,
                {
                    discord: { token: 'test-token' },
                    database: {
                        host: 'localhost',
                        port: 5432,
                        database: 'test',
                        username: 'user',
                        password: 'pass',
                        synchronize: 'true' as unknown, // String should be coerced to boolean
                        logging: 'true' as unknown, // String should be coerced to boolean
                    },
                },
                { shouldExit: false }
            );

            expect(config.database.synchronize).toBe(true);
            expect(config.database.logging).toBe(true);
            expect(typeof config.database.synchronize).toBe('boolean');
            expect(typeof config.database.logging).toBe('boolean');
        });
    });

    describe('Discord Schema Improvements', () => {
        it('should trim whitespace from token', () => {
            const TestSchema = z.object({
                customField: z.string().default('test'),
            });

            const config = createConfig(
                TestSchema,
                {
                    discord: { token: '  test-token  ' }, // Token with whitespace
                    database: {
                        host: 'localhost',
                        port: 5432,
                        database: 'test',
                        username: 'user',
                        password: 'pass',
                    },
                },
                { shouldExit: false }
            );

            expect(config.discord.token).toBe('test-token'); // Trimmed
        });

        it('should validate Discord snowflake IDs', () => {
            const TestSchema = z.object({
                customField: z.string().default('test'),
            });

            expect(() => {
                createConfig(
                    TestSchema,
                    {
                        discord: {
                            token: 'test-token',
                            clientId: '123', // Invalid snowflake - too short
                        },
                        database: {
                            host: 'localhost',
                            port: 5432,
                            database: 'test',
                            username: 'user',
                            password: 'pass',
                        },
                    },
                    { shouldExit: false, silent: true }
                );
            }).toThrow('Client ID must be a valid Discord snowflake');
        });

        it('should accept valid Discord snowflake IDs', () => {
            const TestSchema = z.object({
                customField: z.string().default('test'),
            });

            expect(() => {
                createConfig(
                    TestSchema,
                    {
                        discord: {
                            token: 'test-token',
                            clientId: '123456789012345678', // Valid snowflake
                            guildId: '987654321098765432', // Valid snowflake
                        },
                        database: {
                            host: 'localhost',
                            port: 5432,
                            database: 'test',
                            username: 'user',
                            password: 'pass',
                        },
                    },
                    { shouldExit: false }
                );
            }).not.toThrow();
        });
    });

    describe('Paths Schema Improvements', () => {
        it('should reject empty path strings', () => {
            const TestSchema = z.object({
                customField: z.string().default('test'),
            });

            expect(() => {
                createConfig(
                    TestSchema,
                    {
                        discord: { token: 'test-token' },
                        database: {
                            host: 'localhost',
                            port: 5432,
                            database: 'test',
                            username: 'user',
                            password: 'pass',
                        },
                        paths: {
                            entities: '', // Empty string should fail
                        },
                    },
                    { shouldExit: false, silent: true }
                );
            }).toThrow('Entities path cannot be empty');
        });

        it('should accept valid path strings', () => {
            const TestSchema = z.object({
                customField: z.string().default('test'),
            });

            expect(() => {
                createConfig(
                    TestSchema,
                    {
                        discord: { token: 'test-token' },
                        database: {
                            host: 'localhost',
                            port: 5432,
                            database: 'test',
                            username: 'user',
                            password: 'pass',
                        },
                        paths: {
                            entities: './custom/entities',
                            commands: './custom/commands',
                        },
                    },
                    { shouldExit: false }
                );
            }).not.toThrow();
        });
    });
});
