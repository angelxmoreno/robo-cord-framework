import { createConfig } from '@robo-cord/framework';
import { z } from 'zod';

const ConfigSchema = z.object({
    ollamaUrl: z.url(),
});

const config = createConfig(ConfigSchema, {
    ollamaUrl: process.env.OLLAMA_URL || '',
});

console.log({ c: config.ollamaUrl });
