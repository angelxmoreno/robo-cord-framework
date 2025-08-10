import { z } from 'zod';

/**
 * Configuration schema for Discord bot settings.
 * Includes bot token and optional development settings.
 */
export const DiscordConfigSchema = z.object({
    token: z.string().min(1, 'Discord bot token is required'),
    clientId: z.string().optional(), // For slash command registration
    guildId: z.string().optional(), // For guild-specific development
});
