import type { ApplicationIntegrationType, InteractionContextType, PermissionResolvable } from 'discord.js';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Logger } from 'pino';
import type { BaseConfig } from '../types';
import { commandNameToId } from '../utils/conventions';

/**
 * Base class for all slash commands in the framework.
 * Provides common functionality, dependency injection, and lifecycle hooks.
 */
export abstract class BaseSlashCommand {
    protected logger: Logger;
    protected config: BaseConfig;

    protected constructor(logger: Logger, config: BaseConfig) {
        this.logger = logger;
        this.config = config;
    }

    /**
     * The name of the command. If not provided, it will be auto-derived from the class name.
     * For example, 'PingCommand' becomes 'ping'.
     */
    readonly name?: string;

    /**
     * Gets the command name, auto-deriving from class name if not explicitly set.
     */
    get commandName(): string {
        return this.name ?? commandNameToId(this.constructor.name);
    }

    /**
     * Description of what this command does.
     * This will be shown to users in Discord's command picker.
     */
    abstract readonly description: string;

    /**
     * Default member permissions required to use this command.
     * If not specified, the command is available to everyone.
     */
    readonly defaultMemberPermissions?: PermissionResolvable;

    /**
     * Contexts where this command can be used.
     * Defaults to [Guild, BotDM, PrivateChannel] (all contexts).
     */
    readonly contexts?: InteractionContextType[];

    /**
     * Integration types where this command is available.
     * Defaults to [GuildInstall, UserInstall] (both installation types).
     */
    readonly integrationTypes?: ApplicationIntegrationType[];

    /**
     * Whether this command is restricted to NSFW channels.
     * Defaults to false.
     */
    readonly nsfw?: boolean = false;

    /**
     * Main execution method for the command.
     * This is where the command's logic should be implemented.
     */
    abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;

    /**
     * Builds the Discord slash command definition.
     * Override this method to add options, subcommands, etc.
     */
    buildCommand(): SlashCommandBuilder {
        const command = new SlashCommandBuilder().setName(this.commandName).setDescription(this.description);

        if (this.defaultMemberPermissions !== undefined) {
            command.setDefaultMemberPermissions(this.defaultMemberPermissions as string | number | bigint | null);
        }

        if (this.contexts !== undefined) {
            command.setContexts(this.contexts);
        }

        if (this.integrationTypes !== undefined) {
            command.setIntegrationTypes(this.integrationTypes);
        }

        if (this.nsfw !== undefined) {
            command.setNSFW(this.nsfw);
        }

        return command;
    }

    /**
     * Hook called before command execution.
     * Use for validation, permission checks, etc.
     */
    protected async beforeExecute?(interaction: ChatInputCommandInteraction): Promise<void>;

    /**
     * Hook called after successful command execution.
     * Use for cleanup, logging, analytics, etc.
     */
    protected async afterExecute?(interaction: ChatInputCommandInteraction): Promise<void>;

    /**
     * Hook called when command execution throws an error.
     * Use for error handling, user feedback, etc.
     */
    protected async onError?(error: Error, interaction: ChatInputCommandInteraction): Promise<void>;

    /**
     * Validates command configuration and options.
     * Called during command registration.
     */
    protected validateOptions?(): void;
}
