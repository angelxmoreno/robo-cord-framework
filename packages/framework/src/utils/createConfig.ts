import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';
import { BaseConfigSchema } from '../schemas';
import type { ExtendedConfig, LoggerOptions } from '../types';
import { deepMerge } from './deepMerge';

/**
 * Creates environment-based logger configuration defaults.
 */
function createLoggerDefaults(isDevelopment: boolean) {
    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    const logFile = path.join(logsDir, isDevelopment ? 'development.log' : 'production.log');

    if (isDevelopment) {
        // Development: pino-pretty for console, debug level
        return {
            level: 'debug',
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                    destination: logFile,
                },
            },
        };
    } else {
        // Production: JSON format to file, info level
        return {
            level: 'info',
            destination: logFile,
        };
    }
}

/**
 * Creates and validates a configuration object for the bot application.
 *
 * This function merges the framework's base configuration requirements with a
 * user-provided Zod schema. It then parses environment variables against the
 * combined schema, providing a type-safe configuration object. All paths are
 * resolved to absolute paths based on the calling application's directory.
 *
 * @param userSchema - A Zod schema defining the user-specific configuration.
 * @param overrides - Config overrides and defaults to merge with environment variables.
 * @param options - Configuration options. Set shouldExit to false to throw errors instead of exiting process.
 * @returns A validated, type-safe configuration object with resolved absolute paths.
 */
export function createConfig<T extends z.ZodObject<z.ZodRawShape>>(
    userSchema: T,
    overrides?: Partial<z.infer<T> & z.infer<typeof BaseConfigSchema>>,
    options: { shouldExit?: boolean } = { shouldExit: true }
): ExtendedConfig<z.infer<T>> {
    // Load .env file from the calling app's directory
    dotenv.config();

    const MergedSchema = BaseConfigSchema.and(userSchema);

    const isDevelopment = process.env.NODE_ENV !== 'production';
    // Build base config from environment variables
    const baseConfig = {
        isDevelopment,
        discord: {
            ...(process.env.DISCORD_TOKEN && { token: process.env.DISCORD_TOKEN }),
            ...(process.env.DISCORD_CLIENT_ID && { clientId: process.env.DISCORD_CLIENT_ID }),
            ...(process.env.DISCORD_GUILD_ID && { guildId: process.env.DISCORD_GUILD_ID }),
        },
        database: {
            ...(process.env.DB_HOST && { host: process.env.DB_HOST }),
            ...(process.env.DB_PORT && { port: parseInt(process.env.DB_PORT, 10) }),
            ...(process.env.DB_DATABASE && { database: process.env.DB_DATABASE }),
            ...(process.env.DB_USERNAME && { username: process.env.DB_USERNAME }),
            ...(process.env.DB_PASSWORD && { password: process.env.DB_PASSWORD }),
            ...(process.env.DB_SYNCHRONIZE && { synchronize: process.env.DB_SYNCHRONIZE === 'true' }),
            ...(process.env.DB_LOGGING && { logging: process.env.DB_LOGGING === 'true' }),
        },
        // Empty paths object - defaults come from PathsConfigSchema
        paths: {},
        logger: createLoggerDefaults(isDevelopment) as LoggerOptions,
    };

    // Deep merge base config with overrides
    const mergedConfig = overrides ? deepMerge(baseConfig, overrides) : baseConfig;

    try {
        const parsedConfig = MergedSchema.parse(mergedConfig);

        // Resolve relative paths to absolute paths based on calling app's directory
        const resolvedConfig = {
            ...parsedConfig,
            paths: {
                entities: path.resolve(process.cwd(), parsedConfig.paths.entities),
                commands: path.resolve(process.cwd(), parsedConfig.paths.commands),
                jobs: path.resolve(process.cwd(), parsedConfig.paths.jobs),
                events: path.resolve(process.cwd(), parsedConfig.paths.events),
                services: path.resolve(process.cwd(), parsedConfig.paths.services),
            },
        };

        return resolvedConfig as ExtendedConfig<z.infer<T>>;
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
