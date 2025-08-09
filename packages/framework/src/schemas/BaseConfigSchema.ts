import { z } from 'zod';

/**
 * Defines the base configuration schema required by the framework.
 * These are the minimum environment variables needed for the bot to start.
 */
export const BaseConfigSchema = z.object({
    isDevelopment: z.boolean().default(true),
    discord: z.object({
        token: z.string().min(1, 'Discord bot token is required'),
    }),
    database: z.object({
        host: z.string().default('localhost'),
        port: z.number().default(5432),
        database: z.string().min(1, 'Database name is required'),
        username: z.string().min(1, 'Database username is required'),
        password: z.string().min(1, 'Database password is required'),
        synchronize: z.boolean().optional(),
        logging: z.boolean().optional(),
    }),
});
