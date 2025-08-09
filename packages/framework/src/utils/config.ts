import dotenv from 'dotenv';
import { z } from 'zod';
import { BaseConfigSchema } from '../schemas';
import { deepMerge } from './deepMerge';

/**
 * Creates and validates a configuration object for the bot application.
 *
 * This function merges the framework's base configuration requirements with a
 * user-provided Zod schema. It then parses environment variables against the
 * combined schema, providing a type-safe configuration object.
 *
 * @param userSchema - A Zod schema defining the user-specific configuration.
 * @param overrides - config overrides
 * @param options - Configuration options. Set shouldExit to false to throw errors instead of exiting process.
 * @returns A validated, type-safe configuration object.
 */
export function createConfig<T extends z.ZodObject<z.ZodRawShape>>(
    userSchema: T,
    overrides?: Partial<z.infer<T> & z.infer<typeof BaseConfigSchema>>,
    options: { shouldExit?: boolean } = { shouldExit: true }
): z.infer<T> & z.infer<typeof BaseConfigSchema> {
    // Load .env file from the calling app's directory
    dotenv.config();

    const MergedSchema = BaseConfigSchema.and(userSchema);

    // Build base config from environment variables
    const baseConfig = {
        isDevelopment: process.env.NODE_ENV !== 'production',
        discord: {
            ...(process.env.DISCORD_TOKEN && { token: process.env.DISCORD_TOKEN }),
        },
        database: {
            ...(process.env.DB_HOST && { host: process.env.DB_HOST }),
            ...(process.env.DB_PORT && { port: parseInt(process.env.DB_PORT, 10) }),
            ...(process.env.DB_DATABASE && { database: process.env.DB_DATABASE }),
            ...(process.env.DB_USERNAME && { username: process.env.DB_USERNAME }),
            ...(process.env.DB_PASSWORD && { password: process.env.DB_PASSWORD }),
        },
    };

    // Deep merge base config with overrides
    const mergedConfig = overrides ? deepMerge(baseConfig, overrides) : baseConfig;

    try {
        const parsedConfig = MergedSchema.parse(mergedConfig);

        return parsedConfig as z.infer<typeof MergedSchema>;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Configuration validation failed!\n');
            for (const issue of error.issues) {
                console.error(`  • Path: ${issue.path.join('.')}`);
                console.error(`    Message: ${issue.message}\n`);
            }
            if (options.shouldExit) {
                process.exit(1);
            } else {
                throw error;
            }
        }
        throw error;
    }
}
