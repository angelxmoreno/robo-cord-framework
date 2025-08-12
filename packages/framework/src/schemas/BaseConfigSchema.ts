import { z } from 'zod';
import { DatabaseConfigSchema } from './DatabaseConfigSchema';
import { DiscordConfigSchema } from './DiscordConfigSchema';
import { LoggerOptionsSchema } from './LoggerOptionsSchema';
import { PathsConfigSchema } from './PathsConfigSchema';

/**
 * Defines the base configuration schema required by the framework.
 * Composed of modular configuration schemas for maintainability.
 */
export const BaseConfigSchema = z
    .object({
        isDevelopment: z.boolean().default(true),
        discord: DiscordConfigSchema,
        database: DatabaseConfigSchema,
        paths: PathsConfigSchema,
        logger: LoggerOptionsSchema,
    })
    .refine(
        (data) => {
            // Prevent database synchronization in production environments
            return !(!data.isDevelopment && data.database.synchronize);
        },
        {
            message: 'Database synchronization must be disabled in production environments (isDevelopment: false)',
            path: ['database', 'synchronize'],
        }
    );
