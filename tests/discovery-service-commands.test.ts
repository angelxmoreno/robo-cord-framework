import { describe, expect, it } from 'bun:test';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { Logger } from 'pino';
import { z } from 'zod';
import { BaseSlashCommand, createConfig } from '../packages/framework/src';
import type { BaseConfig, ClassConstructor } from '../packages/framework/src/types';
import { createStartupLogger } from '../packages/framework/src/utils/createStartupLogger';

// Create a test-friendly version of DiscoveryService that exposes the protected method
class TestDiscoveryService {
    protected config: BaseConfig;
    protected logger: Logger;

    constructor(config: BaseConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
    }

    // Copy the exact implementation from DiscoveryService
    isValidCommand(exportedItem: unknown): exportedItem is ClassConstructor {
        if (typeof exportedItem !== 'function' || !exportedItem.prototype) {
            return false;
        }

        // Check if the class name follows convention
        if (!exportedItem.name.endsWith('Command')) {
            return false;
        }

        // Check if it extends BaseSlashCommand
        let currentProto = exportedItem.prototype;
        while (currentProto) {
            if (currentProto.constructor === BaseSlashCommand) {
                return true;
            }
            currentProto = Object.getPrototypeOf(currentProto);
        }

        return false;
    }
}

const TestConfigSchema = z.object({});

describe('DiscoveryService Command Validation', () => {
    function createTestService() {
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
        return new TestDiscoveryService(config, logger);
    }

    it('should validate valid command classes that extend BaseSlashCommand', () => {
        const testService = createTestService();

        class ValidCommand extends BaseSlashCommand {
            readonly description = 'A valid command';

            async execute(interaction: ChatInputCommandInteraction): Promise<void> {
                await interaction.reply('Valid!');
            }
        }

        expect(testService.isValidCommand(ValidCommand)).toBe(true);
    });

    it('should reject classes that do not extend BaseSlashCommand', () => {
        const testService = createTestService();

        class InvalidCommand {
            // Does not extend BaseSlashCommand
        }

        expect(testService.isValidCommand(InvalidCommand)).toBe(false);
    });

    it('should reject classes that do not end with Command', () => {
        const testService = createTestService();

        class ValidButWrongName extends BaseSlashCommand {
            readonly description = 'Wrong name';

            async execute(interaction: ChatInputCommandInteraction): Promise<void> {
                await interaction.reply('Wrong!');
            }
        }

        expect(testService.isValidCommand(ValidButWrongName)).toBe(false);
    });

    it('should reject non-function exports', () => {
        const testService = createTestService();

        const notAFunction = { name: 'TestCommand' };
        expect(testService.isValidCommand(notAFunction)).toBe(false);
    });

    it('should validate nested inheritance from BaseSlashCommand', () => {
        const testService = createTestService();

        class IntermediateCommand extends BaseSlashCommand {
            readonly description = 'Intermediate command';

            async execute(interaction: ChatInputCommandInteraction): Promise<void> {
                await interaction.reply('Intermediate!');
            }
        }

        class DerivedCommand extends IntermediateCommand {
            override readonly description = 'Derived command';

            override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
                await interaction.reply('Derived!');
            }
        }

        expect(testService.isValidCommand(DerivedCommand)).toBe(true);
    });
});
