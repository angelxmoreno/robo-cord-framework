import type { z } from 'zod';
import type {
    BaseConfigSchema,
    DatabaseConfigSchema,
    DiscordConfigSchema,
    LoggerOptionsSchema,
    PathsConfigSchema,
} from '../schemas';

/**
 * Type for Discord bot configuration settings.
 */
export type DiscordConfig = z.infer<typeof DiscordConfigSchema>;

/**
 * Type for database connection configuration.
 */
export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

/**
 * Type for file system paths used by discovery utilities.
 */
export type PathsConfig = z.infer<typeof PathsConfigSchema>;

/**
 * Type for logger configuration options.
 */
export type LoggerOptions = z.infer<typeof LoggerOptionsSchema>;

/**
 * Type for the complete base configuration schema.
 * This includes all framework-required configuration.
 */
export type BaseConfig = z.infer<typeof BaseConfigSchema>;

/**
 * Generic type for extended configuration that combines base config with user schema.
 * Use this type when you need to reference a configuration that extends the base.
 */
export type ExtendedConfig<T extends Record<string, unknown> = Record<string, unknown>> = BaseConfig & T;
