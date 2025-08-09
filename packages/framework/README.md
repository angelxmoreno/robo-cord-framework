# @robo-cord/framework

A TypeScript framework for building Discord bots with configuration validation and schema merging.

## Installation

```bash
bun install @robo-cord/framework
```

## Configuration

The framework provides a `createConfig` function that validates and merges base configuration requirements with your custom schema.

### Basic Usage

```typescript
import { createConfig } from '@robo-cord/framework';
import { z } from 'zod';

// Define your bot-specific configuration schema
const BotConfigSchema = z.object({
  ollamaUrl: z.string().url('Invalid URL format'),
  customSetting: z.string().optional(),
});

// Create validated configuration
const config = createConfig(BotConfigSchema);

// Access both base and custom config
console.log(config.discord.token); // From base schema
console.log(config.database.host);  // From base schema
console.log(config.ollamaUrl);      // From your schema
```

### Using Configuration Overrides

Instead of complex schema preprocessing, use the `overrides` parameter for cleaner configuration:

```typescript
const config = createConfig(BotConfigSchema, {
  // Override environment variables or provide defaults
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  customSetting: 'my-default-value',
  
  // Override base config if needed
  discord: {
    token: process.env.CUSTOM_DISCORD_TOKEN,
  },
  database: {
    host: 'custom-db-host',
    port: 3306,
  }
});
```

### Library Usage (Non-Exit Behavior)

By default, configuration validation failures call `process.exit(1)`. For library usage or testing, disable this behavior:

```typescript
try {
  const config = createConfig(BotConfigSchema, overrides, { shouldExit: false });
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation errors gracefully
    console.log('Config validation failed:', error.issues);
  }
}
```

### API Reference

```typescript
function createConfig<T extends z.ZodObject<z.ZodRawShape>>(
  userSchema: T,
  overrides?: Partial<z.infer<T> & z.infer<typeof BaseConfigSchema>>,
  options: { shouldExit?: boolean } = { shouldExit: true }
): z.infer<T> & z.infer<typeof BaseConfigSchema>
```

**Parameters:**
- `userSchema`: Your Zod schema defining bot-specific configuration
- `overrides`: Optional configuration overrides and defaults
- `options.shouldExit`: Whether to exit process on validation failure (default: `true`)

**Returns:** Validated configuration object with merged base and user schemas

### Base Configuration

The framework automatically includes these base configuration requirements:

- `discord.token`: Discord bot token (from `DISCORD_TOKEN` env var)
- `database.host`: Database host (from `DB_HOST` env var, default: 'localhost')
- `database.port`: Database port (from `DB_PORT` env var, default: 5432)
- `database.database`: Database name (from `DB_DATABASE` env var, required)
- `database.username`: Database username (from `DB_USERNAME` env var, required)
- `database.password`: Database password (from `DB_PASSWORD` env var, required)

## Development

To install dependencies:

```bash
bun install
```

To run tests:

```bash
bun test
```

To run type checking:

```bash
bun run typecheck
```

To build:

```bash
bun run build
```

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
