import type { Interaction } from 'discord.js';
import type { Logger } from 'pino';
import { BaseEventHandler } from '../base';
import type { BaseConfig } from '../types';
import type { DiscordService } from './DiscordService';

/**
 * Built-in interaction handler that automatically routes Discord interactions
 * to the appropriate handlers in the DiscordService.
 *
 * This handler is automatically registered by the DiscordService and should not
 * be manually created or registered by applications.
 */
export class BuiltinInteractionHandler extends BaseEventHandler<'interactionCreate'> {
    private discordService: DiscordService;

    constructor(logger: Logger, config: BaseConfig, discordService: DiscordService) {
        super(logger, config);
        this.discordService = discordService;
    }

    async execute(interaction: Interaction): Promise<void> {
        try {
            // Handle different types of interactions
            if (interaction.isChatInputCommand()) {
                // Route slash commands to DiscordService
                await this.handleSlashCommand(interaction);
            } else if (interaction.isButton()) {
                // Handle button interactions
                await this.handleButtonInteraction(interaction);
            } else if (interaction.isAnySelectMenu()) {
                // Handle select menu interactions
                await this.handleSelectMenuInteraction(interaction);
            } else if (interaction.isModalSubmit()) {
                // Handle modal submit interactions
                await this.handleModalSubmitInteraction(interaction);
            } else if (interaction.isAutocomplete()) {
                // Handle autocomplete interactions
                await this.handleAutocompleteInteraction(interaction);
            } else {
                // Log unknown interaction types for debugging
                this.logger.debug(
                    {
                        interactionType: interaction.type,
                        userId: interaction.user.id,
                        guildId: interaction.guildId,
                    },
                    'Received unknown interaction type'
                );
            }
        } catch (error) {
            this.logger.error(
                {
                    error,
                    interactionType: interaction.type,
                    userId: interaction.user.id,
                    guildId: interaction.guildId,
                },
                'Built-in interaction handler failed'
            );
        }
    }

    private async handleSlashCommand(interaction: import('discord.js').ChatInputCommandInteraction) {
        this.logger.debug(
            {
                commandName: interaction.commandName,
                userId: interaction.user.id,
                guildId: interaction.guildId,
            },
            'Routing slash command to DiscordService'
        );

        // Route to DiscordService for execution
        await this.discordService.executeSlashCommand(interaction);
    }

    private async handleButtonInteraction(interaction: import('discord.js').ButtonInteraction) {
        this.logger.debug(
            {
                customId: interaction.customId,
                userId: interaction.user.id,
                guildId: interaction.guildId,
            },
            'Handling button interaction'
        );

        // For now, just acknowledge the interaction
        // In the future, this could route to registered button handlers
        if (!interaction.replied && !interaction.deferred) {
            await interaction.deferUpdate();
        }
    }

    private async handleSelectMenuInteraction(interaction: import('discord.js').AnySelectMenuInteraction) {
        this.logger.debug(
            {
                customId: interaction.customId,
                userId: interaction.user.id,
                guildId: interaction.guildId,
            },
            'Handling select menu interaction'
        );

        // For now, just acknowledge the interaction
        // In the future, this could route to registered select menu handlers
        if (!interaction.replied && !interaction.deferred) {
            await interaction.deferUpdate();
        }
    }

    private async handleModalSubmitInteraction(interaction: import('discord.js').ModalSubmitInteraction) {
        this.logger.debug(
            {
                customId: interaction.customId,
                userId: interaction.user.id,
                guildId: interaction.guildId,
            },
            'Handling modal submit interaction'
        );

        // For now, just acknowledge the interaction
        // In the future, this could route to registered modal handlers
        if (!interaction.replied && !interaction.deferred) {
            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply({ content: 'Modal submission received.' });
        }
    }

    private async handleAutocompleteInteraction(interaction: import('discord.js').AutocompleteInteraction) {
        this.logger.debug(
            {
                commandName: interaction.commandName,
                focusedOption: interaction.options.getFocused(true),
                userId: interaction.user.id,
                guildId: interaction.guildId,
            },
            'Handling autocomplete interaction'
        );

        // For now, return empty suggestions
        // In the future, this could route to command-specific autocomplete handlers
        await interaction.respond([]);
    }
}
