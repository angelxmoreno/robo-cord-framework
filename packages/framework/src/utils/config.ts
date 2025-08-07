import { BaseConfigSchema } from '@framework/schemas';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

/**
 * Creates and validates a configuration object for the bot application.
 *
 * This function merges the framework's base configuration requirements with a
 * user-provided Zod schema. It then parses environment variables against the
 * combined schema, providing a type-safe configuration object.
 *
 * @param userSchema - A Zod schema defining the user-specific configuration.
 * @param overrides - config overrides
 * @returns A validated, type-safe configuration object.
 */
export function createConfig<T extends z.ZodObject<z.ZodRawShape>>(
    userSchema: T,
    overrides?: Partial<z.infer<T> & z.infer<typeof BaseConfigSchema>>
): z.infer<T> & z.infer<typeof BaseConfigSchema> {
    const MergedSchema = BaseConfigSchema.and(userSchema);
    const configOverrides = overrides ?? {};

    type BaseConfig = z.infer<typeof BaseConfigSchema>;
    type MergedConfig = z.infer<T> & BaseConfig;

    const defaultValues = {
        discord: {
            token: process.env.DISCORD_TOKEN ?? (configOverrides as Partial<MergedConfig>)?.discord?.token,
        },
        database: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
            database: process.env.DB_DATABASE,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
        },
        ...process.env,
        ...configOverrides,
    };

    const mergedValues = {
        ...defaultValues,
        discord: {
            ...defaultValues.discord,
            ...((configOverrides as Partial<MergedConfig>)?.discord || {}),
        },
        database: {
            ...defaultValues.database,
            ...((configOverrides as Partial<MergedConfig>)?.database || {}),
        },
    };

    try {
        const parsedConfig = MergedSchema.parse(mergedValues);

        return parsedConfig as z.infer<typeof MergedSchema>;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Configuration validation failed!\n');
            for (const issue of error.issues) {
                console.error(`  • Path: ${issue.path.join('.')}`);
                console.error(`    Message: ${issue.message}\n`);
            }
            process.exit(1);
        }
        throw error;
    }
}
