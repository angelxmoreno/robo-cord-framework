import { type ClientOptions, Client as DiscordClient } from 'discord.js';
import type { Logger } from 'pino';
import type { BaseEventHandler, BaseSlashCommand } from '../base';
import type { BaseConfig, ClassConstructor } from '../types';
import { BuiltinInteractionHandler } from './BuiltinInteractionHandler';
import type { DiscoveryService } from './DiscoveryService';

export type DiscordServiceOptions = {
    config: BaseConfig;
    logger: Logger;
    discoveryService: DiscoveryService;
};

export class DiscordService {
    protected config: BaseConfig;
    protected logger: Logger;
    protected discoveryService: DiscoveryService;
    protected client?: DiscordClient;
    protected commandInstances?: Map<string, BaseSlashCommand>;
    private builtinInteractionHandler?: BuiltinInteractionHandler;

    constructor({ config, logger, discoveryService }: DiscordServiceOptions) {
        this.config = config;
        this.logger = logger;
        this.discoveryService = discoveryService;
    }

    get discordClient(): DiscordClient {
        if (!this.client) {
            this.client = new DiscordClient(this.config.discord.clientOptions as ClientOptions);
        }

        return this.client;
    }

    async connect() {
        try {
            this.logger.info('Starting Discord connection process');

            // Set up error handlers before connecting
            this.setupClientErrorHandlers();

            // Discover and register commands and event handlers
            this.logger.info('Discovering and registering commands and event handlers');
            await this.discoverAndRegister();

            // Connect to Discord
            this.logger.info('Logging in to Discord');
            await this.discordClient.login(this.config.discord.token);

            this.logger.info('Successfully connected to Discord');
        } catch (error) {
            this.logger.error({ error }, 'Failed to connect to Discord');
            throw error;
        }
    }

    async disconnect() {
        try {
            if (this.discordClient.isReady()) {
                this.logger.info('Disconnecting from Discord');
                await this.discordClient.destroy();
                this.logger.info('Successfully disconnected from Discord');
            } else {
                this.logger.debug('Discord client is not connected, nothing to disconnect');
            }
        } catch (error) {
            this.logger.error({ error }, 'Error during Discord disconnect');
            throw error;
        }
    }

    /**
     * Check if the Discord client is connected and ready.
     */
    get isConnected(): boolean {
        return this.discordClient.isReady();
    }

    /**
     * Get the current connection status information.
     */
    get connectionInfo() {
        const client = this.discordClient;
        return {
            isConnected: client.isReady(),
            ping: client.ws?.ping ?? null,
            uptime: client.uptime ?? null,
            user: client.user ?? null,
        };
    }

    protected setupClientErrorHandlers() {
        // Set up built-in interaction handler
        this.setupBuiltinInteractionHandler();

        // Handle client errors
        this.discordClient.on('error', (error) => {
            this.logger.error({ error }, 'Discord client error');
        });

        // Handle WebSocket errors
        this.discordClient.on('shardError', (error) => {
            this.logger.error({ error }, 'Discord WebSocket error');
        });

        // Handle rate limit warnings
        this.discordClient.on('rateLimit', (rateLimitData) => {
            this.logger.warn({ rateLimitData }, 'Discord API rate limit hit');
        });

        // Handle warnings
        this.discordClient.on('warn', (info) => {
            this.logger.warn({ info }, 'Discord client warning');
        });

        // Handle disconnections
        this.discordClient.on('disconnect', (event) => {
            this.logger.warn({ event }, 'Discord client disconnected');
        });

        // Handle reconnection
        this.discordClient.on('reconnecting', () => {
            this.logger.info('Discord client reconnecting');
        });
    }

    protected setupBuiltinInteractionHandler() {
        // Create the built-in interaction handler
        this.builtinInteractionHandler = new BuiltinInteractionHandler(this.logger, this.config, this);

        // Register the interaction handler with Discord client
        this.discordClient.on('interactionCreate', async (interaction) => {
            try {
                await this.builtinInteractionHandler?.execute(interaction);
            } catch (error) {
                this.logger.error(
                    { error, interactionType: interaction.type },
                    'Built-in interaction handler execution failed'
                );
            }
        });

        this.logger.debug('Built-in interaction handler registered');
    }

    protected async discoverAndRegister() {
        const [commands, handlers] = await Promise.all([
            this.discoveryService.discoverCommands(),
            this.discoveryService.discoverEvents(),
        ]);

        await this.registerCommands(commands);
        this.registerEventHandlers(handlers);
    }

    protected registerEventHandlers(handlers: ClassConstructor[]) {
        this.logger.debug(`Discovered ${handlers.length} event handlers`);

        for (const HandlerClass of handlers) {
            try {
                // Create instance with dependency injection
                const handler = new HandlerClass(this.logger, this.config) as BaseEventHandler;

                // Validation is handled internally by the handler if needed

                // Get event name (auto-derived or explicit)
                const eventName = handler.eventName;

                // Skip interactionCreate handlers - we provide a built-in one
                if (eventName === 'interactionCreate') {
                    this.logger.warn(
                        { handlerName: HandlerClass.name },
                        'Skipping user-defined interactionCreate handler - the framework provides a built-in handler. Remove this handler from your code.'
                    );
                    continue;
                }

                // Create wrapper function for the event handler
                const eventListener = async (...args: unknown[]) => {
                    try {
                        // Execute the handler (lifecycle hooks are handled internally by the base class)
                        await handler.execute(...(args as Parameters<typeof handler.execute>));
                    } catch (error) {
                        this.logger.error(
                            { error, eventName, handlerName: HandlerClass.name },
                            'Event handler execution failed'
                        );
                    }
                };

                // Register with Discord client
                if (handler.once) {
                    this.discordClient.once(eventName, eventListener);
                } else {
                    this.discordClient.on(eventName, eventListener);
                }

                this.logger.debug(
                    { eventName, handlerName: HandlerClass.name, once: handler.once },
                    'Registered event handler'
                );
            } catch (error) {
                this.logger.error({ error, handlerName: HandlerClass.name }, 'Failed to register event handler');
            }
        }
    }

    protected async registerCommands(commands: ClassConstructor[]) {
        this.logger.debug(`Discovered ${commands.length} commands`);

        for (const CommandClass of commands) {
            try {
                // Create instance with dependency injection
                const command = new CommandClass(this.logger, this.config) as BaseSlashCommand;

                // Validation is handled internally by the command if needed

                // Build the slash command data for Discord API
                const slashCommand = command.buildCommand();

                this.logger.debug(
                    {
                        commandName: slashCommand.name,
                        description: slashCommand.description,
                        className: CommandClass.name,
                    },
                    'Prepared slash command for registration'
                );

                // Store command instance for execution handling
                // We'll need a Map to store command instances by name
                if (!this.commandInstances) {
                    this.commandInstances = new Map();
                }
                this.commandInstances.set(slashCommand.name, command);
            } catch (error) {
                this.logger.error(
                    { error, commandName: CommandClass.name },
                    'Failed to prepare command for registration'
                );
            }
        }

        // Register all commands with Discord API
        await this.registerSlashCommandsWithDiscord();
    }

    protected async registerSlashCommandsWithDiscord() {
        if (!this.commandInstances || this.commandInstances.size === 0) {
            this.logger.debug('No commands to register with Discord API');
            return;
        }

        try {
            // Build array of command data for Discord API
            const commandData = Array.from(this.commandInstances.values()).map((command) =>
                command.buildCommand().toJSON()
            );

            this.logger.info({ commandCount: commandData.length }, 'Registering slash commands with Discord API');

            // Register commands globally or per guild based on configuration
            if (this.config.isDevelopment && this.config.discord.guildId) {
                // Register to development guild only (faster updates)
                const guild = await this.discordClient.guilds.fetch(this.config.discord.guildId);
                await guild.commands.set(commandData);

                this.logger.info(
                    { guildId: this.config.discord.guildId, commandCount: commandData.length },
                    'Successfully registered commands to development guild'
                );
            } else {
                // Register globally (takes up to 1 hour to propagate)
                await this.discordClient.application?.commands.set(commandData);

                this.logger.info({ commandCount: commandData.length }, 'Successfully registered commands globally');
            }
        } catch (error) {
            this.logger.error({ error }, 'Failed to register commands with Discord API');
            throw error;
        }
    }

    /**
     * Handle slash command execution.
     * This should be called from an interactionCreate event handler.
     */
    async executeSlashCommand(interaction: import('discord.js').ChatInputCommandInteraction) {
        if (!this.commandInstances) {
            this.logger.error('No command instances available for execution');
            return;
        }

        const commandName = interaction.commandName;
        const command = this.commandInstances.get(commandName);

        if (!command) {
            this.logger.warn({ commandName }, 'Unknown command executed');
            await interaction.reply({
                content: 'Unknown command. Please try again.',
                ephemeral: true,
            });
            return;
        }

        try {
            this.logger.debug(
                { commandName, userId: interaction.user.id, guildId: interaction.guildId },
                'Executing slash command'
            );

            await command.execute(interaction);

            this.logger.debug({ commandName }, 'Slash command executed successfully');
        } catch (error) {
            this.logger.error({ error, commandName, userId: interaction.user.id }, 'Slash command execution failed');

            // Try to respond to the user
            const errorMessage = 'An error occurred while executing this command.';
            try {
                if (interaction.deferred) {
                    await interaction.editReply({ content: errorMessage });
                } else if (!interaction.replied) {
                    await interaction.reply({ content: errorMessage, ephemeral: true });
                } else {
                    await interaction.followUp({ content: errorMessage, ephemeral: true });
                }
            } catch (replyError) {
                this.logger.error({ replyError }, 'Failed to send error response to user');
            }
        }
    }
}
