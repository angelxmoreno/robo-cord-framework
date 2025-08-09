import { z } from 'zod';

export const LoggerOptionsSchema = z
    .object({
        level: z.string().optional(),
        name: z.string().optional(),
        enabled: z.boolean().optional(),
        transport: z
            .object({
                target: z.string(),
                options: z.record(z.string(), z.any()).optional(),
            })
            .optional(),
    })
    .default({});
