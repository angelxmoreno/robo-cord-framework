import { createConfig } from '@robo-cord/framework';
import { z } from 'zod';

const ConfigSchema = z.object({
    ollamaUrl: z.url(),
});

const config = createConfig(ConfigSchema);
console.log({ c: config.ollamaUrl });
