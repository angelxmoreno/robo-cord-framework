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
 * @returns A validated, type-safe configuration object.
 */
export function createConfig<T extends z.ZodObject<z.ZodRawShape>>(
    userSchema: T
): z.infer<T> & z.infer<typeof BaseConfigSchema> {
    const MergedSchema = BaseConfigSchema.and(userSchema);

    try {
        // Here, you might need a more sophisticated way to map flat .env variables
        // to the nested schema structure, but for now, we'll assume they are prefixed
        // e.g., DISCORD_TOKEN, DATABASE_HOST
        const parsedConfig = MergedSchema.parse({
            discord: {
                token: process.env.DISCORD_TOKEN,
            },
            database: {
                host: process.env.DATABASE_HOST,
                port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : undefined,
                database: process.env.DATABASE_NAME,
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
            },
            // Pass all env vars to be parsed for the user schema part
            ...process.env,
        });

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
