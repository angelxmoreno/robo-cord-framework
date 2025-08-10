import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { createConfig } from '../packages/framework/src/utils/createConfig';

describe('Paths Configuration Defaults', () => {
    it('should use PathsConfigSchema defaults when no paths are provided', () => {
        const TestSchema = z.object({
            customField: z.string().default('test'),
        });

        const config = createConfig(
            TestSchema,
            {
                discord: { token: 'test-token', clientId: 'test-client-id' },
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

        // Verify that paths use schema defaults (resolved to absolute paths)
        expect(config.paths.entities).toBe(`${process.cwd()}/src/entities`);
        expect(config.paths.commands).toBe(`${process.cwd()}/src/commands`);
        expect(config.paths.jobs).toBe(`${process.cwd()}/src/jobs`);
        expect(config.paths.events).toBe(`${process.cwd()}/src/events`);
        expect(config.paths.services).toBe(`${process.cwd()}/src/services`);
    });

    it('should allow overriding individual path defaults', () => {
        const TestSchema = z.object({
            customField: z.string().default('test'),
        });

        const config = createConfig(
            TestSchema,
            {
                discord: { token: 'test-token', clientId: 'test-client-id' },
                database: {
                    host: 'localhost',
                    port: 5432,
                    database: 'test',
                    username: 'user',
                    password: 'pass',
                },
                // Override specific paths
                paths: {
                    entities: './custom/entities',
                    commands: './custom/commands',
                },
            },
            { shouldExit: false }
        );

        // Verify overrides work (resolved to absolute paths)
        expect(config.paths.entities).toBe(`${process.cwd()}/custom/entities`);
        expect(config.paths.commands).toBe(`${process.cwd()}/custom/commands`);

        // Verify non-overridden paths still use schema defaults (resolved to absolute paths)
        expect(config.paths.jobs).toBe(`${process.cwd()}/src/jobs`);
        expect(config.paths.events).toBe(`${process.cwd()}/src/events`);
        expect(config.paths.services).toBe(`${process.cwd()}/src/services`);
    });
});
