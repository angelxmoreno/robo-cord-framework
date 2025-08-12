import { describe, expect, it } from 'bun:test';
import type { Client, Interaction } from 'discord.js';
import { z } from 'zod';
import { BaseEventHandler, createConfig } from '../packages/framework/src';
import { createStartupLogger } from '../packages/framework/src/utils/createStartupLogger';

const TestConfigSchema = z.object({});

describe('BaseEventHandler', () => {
    function createTestEnvironment() {
        const config = createConfig(
            TestConfigSchema,
            {
                discord: {
                    token: 'test-token',
                    clientOptions: { intents: [] },
                },
                database: {
                    host: 'localhost',
                    port: 5432,
                    username: 'test',
                    password: 'test',
                    database: 'test',
                },
            },
            { silent: true }
        );

        const logger = createStartupLogger('silent');
        return { config, logger };
    }

    it('should auto-derive event name from class name', () => {
        const { config, logger } = createTestEnvironment();

        class ReadyEvent extends BaseEventHandler<'ready'> {
            async execute(_client: Client<true>): Promise<void> {
                // Test implementation
            }
        }

        class InteractionCreateEvent extends BaseEventHandler<'interactionCreate'> {
            async execute(_interaction: Interaction): Promise<void> {
                // Test implementation
            }
        }

        const readyEvent = new ReadyEvent(logger, config);
        const interactionEvent = new InteractionCreateEvent(logger, config);

        expect(readyEvent.eventName).toBe('ready');
        expect(interactionEvent.eventName).toBe('interactionCreate');
    });

    it('should use explicit event name when provided', () => {
        const { config, logger } = createTestEnvironment();

        class CustomEvent extends BaseEventHandler<'messageCreate'> {
            readonly event = 'messageCreate' as const;

            async execute(): Promise<void> {
                // Test implementation
            }
        }

        const customEvent = new CustomEvent(logger, config);
        expect(customEvent.eventName).toBe('messageCreate');
    });

    it('should support once property for one-time events', () => {
        const { config, logger } = createTestEnvironment();

        class OnceEvent extends BaseEventHandler<'ready'> {
            override readonly once = true;

            async execute(): Promise<void> {
                // Test implementation
            }
        }

        class RepeatingEvent extends BaseEventHandler<'messageCreate'> {
            // once defaults to false

            async execute(): Promise<void> {
                // Test implementation
            }
        }

        const onceEvent = new OnceEvent(logger, config);
        const repeatingEvent = new RepeatingEvent(logger, config);

        expect(onceEvent.once).toBe(true);
        expect(repeatingEvent.once).toBe(false);
    });

    it('should have access to logger and config through dependency injection', () => {
        const { config, logger } = createTestEnvironment();

        class TestEvent extends BaseEventHandler<'ready'> {
            async execute(): Promise<void> {
                // Access logger and config to verify they're available
                this.logger.info('Test log');
                expect(this.config.isDevelopment).toBeDefined();
            }
        }

        const testEvent = new TestEvent(logger, config);
        expect(testEvent.logger).toBe(logger);
        expect(testEvent.config).toBe(config);
    });

    it('should support TypeScript generics for event type safety', () => {
        const { config, logger } = createTestEnvironment();

        class ReadyEvent extends BaseEventHandler<'ready'> {
            async execute(client: Client<true>): Promise<void> {
                // TypeScript should enforce correct parameter type
                expect(client).toBeDefined();
            }
        }

        class InteractionCreateEvent extends BaseEventHandler<'interactionCreate'> {
            async execute(interaction: Interaction): Promise<void> {
                // TypeScript should enforce correct parameter type
                expect(interaction).toBeDefined();
            }
        }

        // These should compile without errors if types are correct
        const readyEvent = new ReadyEvent(logger, config);
        const interactionEvent = new InteractionCreateEvent(logger, config);

        expect(readyEvent.eventName).toBe('ready');
        expect(interactionEvent.eventName).toBe('interactionCreate');
    });
});
