# summarizer-bot

A Discord bot built with the @robo-cord/framework that provides text summarization capabilities.

## Configuration

This bot uses the framework's configuration system. Create a `.env` file with the following variables:

```env
# Required base configuration
DISCORD_TOKEN=your_discord_bot_token
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=summarizer_db
DB_USERNAME=db_user
DB_PASSWORD=db_password

# Bot-specific configuration
OLLAMA_URL=http://localhost:11434
```

The bot uses `createConfig` with overrides for clean configuration:

```typescript
import { createConfig } from '@robo-cord/framework';

const config = createConfig(ConfigSchema, {
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
});
```

## Development

To install dependencies:

```bash
bun install
```

To run in development:

```bash
bun run dev
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
