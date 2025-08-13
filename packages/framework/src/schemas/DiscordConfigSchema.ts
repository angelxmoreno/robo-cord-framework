import { z } from 'zod';
import { DiscordClientOptionsSchema } from './DiscordClientOptionsSchema';

/**
 * Configuration schema for Discord bot settings.
 * Includes bot token and optional development settings.
 */
export const DiscordConfigSchema = z.object({
    token: z.string().trim().min(1, 'Discord bot token is required'),
    clientId: z
        .string()
        .trim()
        .regex(/^\d{17,20}$/, 'Client ID must be a valid Discord snowflake')
        .optional(), // For slash command registration
    guildId: z
        .string()
        .trim()
        .regex(/^\d{17,20}$/, 'Guild ID must be a valid Discord snowflake')
        .optional(), // For guild-specific development
    clientOptions: DiscordClientOptionsSchema,
});
