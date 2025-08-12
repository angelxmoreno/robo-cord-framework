import { z } from 'zod';

/**
 * Zod schema for Discord.js v14 ClientOptions interface.
 * Provides type-safe configuration for Discord client instantiation.
 *
 * @see https://discord.js.org/docs/packages/discord.js/main/ClientOptions:Interface
 */
export const DiscordClientOptionsSchema = z
    .object({
        /**
         * Gateway intents to enable for this connection.
         * Can be an array of intent strings/numbers, a single number, or omitted for empty array.
         *
         * @example ['Guilds', 'GuildMessages', 'MessageContent']
         * @example 32767 // All intents
         */
        intents: z
            .union([
                z.array(z.union([z.string(), z.number()])),
                z.number(),
                z.unknown(), // Allow any type to be flexible with Discord.js types
            ])
            .optional(),

        /**
         * Initial presence data for the client.
         * Controls the bot's status and activity display.
         */
        presence: z
            .object({
                status: z.enum(['online', 'idle', 'dnd', 'invisible']).optional(),
                activities: z
                    .array(
                        z.object({
                            name: z.string(),
                            type: z.number().int().min(0).max(5).optional(), // ActivityType enum values
                            url: z.url().optional(), // For streaming activities
                        })
                    )
                    .optional(),
            })
            .optional(),

        /**
         * Controls what mentions the bot is allowed to make.
         * Helps prevent accidental mass mentions.
         */
        allowedMentions: z
            .object({
                parse: z.array(z.enum(['users', 'roles', 'everyone'])).optional(),
                users: z.array(z.string().regex(/^\d{17,20}$/)).optional(), // User snowflakes
                roles: z.array(z.string().regex(/^\d{17,20}$/)).optional(), // Role snowflakes
                repliedUser: z.boolean().optional(),
            })
            .optional(),

        /**
         * Structures allowed to be partial.
         * Allows handling of incomplete Discord objects in events.
         */
        partials: z.array(z.number().int()).optional(),

        /**
         * Time in milliseconds to wait for the WebSocket close frame.
         * Recommended: 2000-6000ms
         */
        closeTimeout: z.number().int().min(1000).max(30000).default(5000),

        /**
         * Time in milliseconds to wait for missing guilds before being ready.
         * Only applies to clients with GatewayIntentBits.Guilds intent.
         */
        waitGuildTimeout: z.number().int().min(1000).max(60000).default(15000),

        /**
         * Default value for operations that can fail if the target doesn't exist.
         * When true, operations throw errors for missing entities.
         */
        failIfNotExists: z.boolean().default(true),

        /**
         * Whether to enforce nonce validation on message creation.
         * Helps prevent duplicate message issues.
         */
        enforceNonce: z.boolean().default(false),

        /**
         * WebSocket manager options for advanced configuration.
         * Most users don't need to modify this.
         */
        ws: z
            .object({
                compress: z.boolean().optional(),
                properties: z.record(z.string(), z.unknown()).optional(),
            })
            .optional(),

        /**
         * REST API configuration options.
         * Controls rate limiting, retries, and other HTTP behavior.
         */
        rest: z
            .object({
                offset: z.number().optional(),
                timeout: z.number().int().min(1000).optional(),
                retries: z.number().int().min(0).max(10).optional(),
            })
            .optional(),
    })
    .default({
        closeTimeout: 5000,
        waitGuildTimeout: 15000,
        failIfNotExists: true,
        enforceNonce: false,
    });
