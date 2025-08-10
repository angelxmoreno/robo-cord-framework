import { z } from 'zod';

/**
 * Configuration schema for directory paths used by the discovery system.
 * These paths are used to automatically discover and register user code
 * following the framework's convention-over-configuration approach.
 */
export const PathsConfigSchema = z.object({
    /**
     * Path to user entity classes (extends framework base entities)
     * @default './src/entities'
     */
    entities: z.string().default('./src/entities'),

    /**
     * Path to user command classes (extends SlashCommand)
     * @default './src/commands'
     */
    commands: z.string().default('./src/commands'),

    /**
     * Path to user job classes (extends BaseJob)
     * @default './src/jobs'
     */
    jobs: z.string().default('./src/jobs'),

    /**
     * Path to user event handler classes (extends BaseEvent)
     * @default './src/events'
     */
    events: z.string().default('./src/events'),

    /**
     * Path to user custom service classes (for future service discovery)
     * @default './src/services'
     */
    services: z.string().default('./src/services'),
});
