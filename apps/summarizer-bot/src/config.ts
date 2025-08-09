import { createConfig } from '@robo-cord/framework';
import { z } from 'zod';

const ConfigSchema = z.object({
    ollamaUrl: z.url(),
});

export const config = createConfig(ConfigSchema, {
    ollamaUrl: process.env.OLLAMA_URL || '',
    database: {
        logging: false,
    },
});
