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
    entities: z.string().min(1, 'Entities path cannot be empty').default('./src/entities'),

    /**
     * Path to user command classes (extends SlashCommand)
     * @default './src/commands'
     */
    commands: z.string().min(1, 'Commands path cannot be empty').default('./src/commands'),

    /**
     * Path to user job classes (extends BaseJob)
     * @default './src/jobs'
     */
    jobs: z.string().min(1, 'Jobs path cannot be empty').default('./src/jobs'),

    /**
     * Path to user event handler classes (extends BaseEvent)
     * @default './src/events'
     */
    events: z.string().min(1, 'Events path cannot be empty').default('./src/events'),

    /**
     * Path to user custom service classes (for future service discovery)
     * @default './src/services'
     */
    services: z.string().min(1, 'Services path cannot be empty').default('./src/services'),
});
