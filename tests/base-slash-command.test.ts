import { describe, expect, it } from 'bun:test';
import type { ChatInputCommandInteraction } from 'discord.js';
import { z } from 'zod';
import { BaseSlashCommand, createConfig } from '../packages/framework/src';
import { createStartupLogger } from '../packages/framework/src/utils/createStartupLogger';

const TestConfigSchema = z.object({});

describe('BaseSlashCommand', () => {
    it('should auto-derive command name from class name', () => {
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

        class TestPingCommand extends BaseSlashCommand {
            readonly description = 'Test ping command';

            async execute(interaction: ChatInputCommandInteraction): Promise<void> {
                await interaction.reply('Pong!');
            }
        }

        class ComplexServerManageCommand extends BaseSlashCommand {
            readonly description = 'Test complex command name';

            async execute(interaction: ChatInputCommandInteraction): Promise<void> {
                await interaction.reply('Complex!');
            }
        }

        const pingCommand = new TestPingCommand(logger, config);
        const complexCommand = new ComplexServerManageCommand(logger, config);

        expect(pingCommand.commandName).toBe('test-ping');
        expect(complexCommand.commandName).toBe('complex-server-manage');
    });

    it('should use explicit name when provided', () => {
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

        class CustomCommand extends BaseSlashCommand {
            readonly name = 'custom-name';
            readonly description = 'Test custom command name';

            async execute(interaction: ChatInputCommandInteraction): Promise<void> {
                await interaction.reply('Custom!');
            }
        }

        const command = new CustomCommand(logger, config);
        expect(command.commandName).toBe('custom-name');
    });

    it('should build command with correct name', () => {
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

        class BuildTestCommand extends BaseSlashCommand {
            readonly description = 'Test build command';

            async execute(interaction: ChatInputCommandInteraction): Promise<void> {
                await interaction.reply('Built!');
            }
        }

        const command = new BuildTestCommand(logger, config);
        const builtCommand = command.buildCommand();

        expect(builtCommand.name).toBe('build-test');
        expect(builtCommand.description).toBe('Test build command');
    });
});
