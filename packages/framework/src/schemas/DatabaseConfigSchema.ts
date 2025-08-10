import { z } from 'zod';

/**
 * Configuration schema for database connection settings.
 * Supports PostgreSQL configuration with TypeORM options.
 */
export const DatabaseConfigSchema = z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().int().min(1).max(65535).default(5432),
    database: z.string().min(1, 'Database name is required'),
    username: z.string().min(1, 'Database username is required'),
    password: z.string().min(1, 'Database password is required'),
    synchronize: z.coerce.boolean().default(false),
    logging: z.coerce.boolean().default(false),
});
