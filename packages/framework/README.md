# @robo-cord/framework

An enterprise-grade TypeScript framework for building Discord bots using inheritance-based architecture. Create Bot, Worker, and API applications that share 98% of their infrastructure through the abstract `RoboCordApp` base class.

## Installation

```bash
bun install @robo-cord/framework
```

## Quick Start

### 1. Create Your Bot Application

```typescript
// src/apps/bot.ts
import { BotApp, createConfig } from '@robo-cord/framework';
import { z } from 'zod';

// Define your bot-specific configuration
const ConfigSchema = z.object({
  openai: z.object({
    apiKey: z.string(),
    model: z.string().default('gpt-4'),
  }),
});

const config = createConfig(ConfigSchema);
const bot = new BotApp(config);

// Start your bot - everything is handled automatically
await bot.start();

// Bot automatically:
// - Initializes logger and database with discovered entities
// - Connects to Discord
// - Discovers and registers commands from ./src/commands/
// - Sets up event handlers from ./src/events/
```

### 2. Create Commands

```typescript
// src/commands/PingCommand.ts
import { SlashCommand } from '@robo-cord/framework';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export class PingCommand extends SlashCommand {
  constructor() {
    super();
    this.data = new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!');
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply('Pong!');
  }
}
```

### 3. Create Background Jobs

```typescript
// src/jobs/WelcomeJob.ts
import { BaseJob } from '@robo-cord/framework';
import { z } from 'zod';

const WelcomeJobSchema = z.object({
  userId: z.string(),
  guildId: z.string(),
});

export class WelcomeJob extends BaseJob<typeof WelcomeJobSchema> {
  name = 'welcome';
  schema = WelcomeJobSchema;
  
  async execute(data: z.infer<typeof WelcomeJobSchema>): Promise<void> {
    // Send welcome message logic
  }
}
```

### 4. Create Worker Application

```typescript
// src/apps/worker.ts
import { WorkerApp } from '@robo-cord/framework';
import { config } from '../config';

const worker = new WorkerApp(config);
await worker.start();

// Worker automatically:
// - Initializes logger and database (shared with bot)
// - Connects to job queue
// - Discovers and registers jobs from ./src/jobs/
// - Starts processing background tasks
```

## Inheritance-Based Architecture

The framework uses the **Template Method Pattern** through an abstract `RoboCordApp` base class that eliminates 98% of code duplication across different application types.

### How It Works

```typescript
// All apps follow the same initialization sequence
abstract class RoboCordApp {
  async start(): Promise<void> {
    await this.initializeCore();              // 98% shared logic
    await this.initializeSpecificServices(); // 2% app-specific
    await this.startApp();                    // App-specific startup
  }
  
  // Template methods implemented by concrete apps
  protected abstract initializeSpecificServices(): Promise<void>;
  protected abstract startApp(): Promise<void>;
}

// BotApp focuses only on Discord-specific logic
class BotApp extends RoboCordApp {
  protected async initializeSpecificServices(): Promise<void> {
    // Initialize Discord service
  }
  
  protected async startApp(): Promise<void> {
    // Discover and register commands
  }
}
```

### Benefits Over Alternative Architectures

1. **No Code Duplication**: Shared initialization across Bot, Worker, API applications
2. **Direct Service Access**: No dependency injection container complexity
3. **Simple Developer Experience**: One line to start any app type: `await new BotApp(config).start()`
4. **Template Method Pattern**: Clean separation of shared vs app-specific logic
5. **Service Discovery Integration**: Uses framework utilities for auto-discovery

### Framework Utilities Integration

The base class orchestrates but delegates to focused utilities:

- **`utils/discovery.ts`**: File scanning and class loading
- **`utils/conventions.ts`**: Naming patterns (PingCommand → "ping") 
- **`utils/automagic.ts`**: Auto-registration logic
- **`services/*`**: Individual service implementations

```typescript
// RoboCordApp delegates to utilities using configurable paths
protected async scanCommands(): Promise<any[]> {
  return discoverCommands(this.config); // Uses config.paths.commands resolved to absolute path
}
```

## Configuration System

### Basic Configuration

```typescript
import { createConfig } from '@robo-cord/framework';
import { z } from 'zod';

const MyConfigSchema = z.object({
  openai: z.object({
    apiKey: z.string(),
    model: z.string().default('gpt-4'),
  }),
});

const config = createConfig(MyConfigSchema);
```

### Configuration Overrides

```typescript
const config = createConfig(MyConfigSchema, {
  // Override environment variables or provide defaults
  openai: {
    model: 'gpt-3.5-turbo', // Override default
  },
  
  // Override base config if needed
  discord: {
    token: process.env.CUSTOM_DISCORD_TOKEN,
  },
});
```

### Base Configuration Requirements

The framework automatically includes:
- **Discord**: `token` (required), `clientId`, `guildId`
- **Database**: `host`, `port`, `username`, `password`, `database`
- **Logger**: Level, transports, and formatting options
- **Paths**: Discovery paths for entities, commands, jobs, events, and services

### Path Configuration

```typescript
// Default paths (all resolved to absolute paths)
const config = createConfig(MyConfigSchema);
// config.paths.entities   -> /absolute/path/to/src/entities
// config.paths.commands   -> /absolute/path/to/src/commands  
// config.paths.jobs       -> /absolute/path/to/src/jobs
// config.paths.events     -> /absolute/path/to/src/events
// config.paths.services   -> /absolute/path/to/src/services

// Override paths if needed
const config = createConfig(MyConfigSchema, {
  paths: {
    commands: './custom/commands/dir',
    jobs: './custom/jobs/dir',
    // entities, events, services use defaults
  }
});
```

## API Reference

### Application Classes

#### RoboCordApp (Abstract Base)
```typescript
abstract class RoboCordApp {
  constructor(config: ExtendedConfig)
  
  // Main lifecycle methods
  async start(): Promise<void>
  async stop(): Promise<void>
  
  // Template methods (implemented by subclasses)
  protected abstract initializeSpecificServices(): Promise<void>
  protected abstract startApp(): Promise<void>
  protected abstract stopApp(): Promise<void>
  
  // Utility methods (delegates to framework utilities using configurable paths)
  protected async scanCommands(): Promise<any[]>
  protected async scanJobs(): Promise<any[]>
  protected async scanEvents(): Promise<any[]>
}
```

#### BotApp
```typescript
class BotApp extends RoboCordApp {
  constructor(config: ExtendedConfig)
  
  // Inherits start()/stop() from RoboCordApp
  // Implements Discord-specific template methods
}
```

#### WorkerApp
```typescript
class WorkerApp extends RoboCordApp {
  constructor(config: ExtendedConfig)
  
  // Inherits start()/stop() from RoboCordApp  
  // Implements queue-specific template methods
}
```

### Base Classes for Extension

#### SlashCommand
```typescript
abstract class SlashCommand {
  abstract data: SlashCommandBuilder
  abstract execute(interaction: ChatInputCommandInteraction): Promise<void>
}
```

#### BaseJob
```typescript
abstract class BaseJob<T extends z.ZodObject<z.ZodRawShape>> {
  abstract name: string
  abstract schema: T
  abstract execute(data: z.infer<T>): Promise<void>
}
```

### Configuration API

```typescript
function createConfig<T extends z.ZodObject<z.ZodRawShape>>(
  userSchema: T,
  overrides?: Partial<z.infer<T> & z.infer<typeof BaseConfigSchema>>,
  options: { shouldExit?: boolean } = { shouldExit: true }
): z.infer<T> & z.infer<typeof BaseConfigSchema>
```

## Creating Custom App Types

You can extend `RoboCordApp` to create custom application types:

```typescript
// src/apps/ApiApp.ts
import { RoboCordApp } from '@robo-cord/framework';

export class ApiApp extends RoboCordApp {
  private httpServer: HttpServer;
  
  protected async initializeSpecificServices(): Promise<void> {
    // Initialize HTTP server
    this.httpServer = new HttpServer(this.config.api);
  }
  
  protected async startApp(): Promise<void> {
    // Discover and register routes (future functionality)
    // const routes = await this.scanRoutes(); // Will use config.paths.routes
    // this.httpServer.registerRoutes(routes);
    await this.httpServer.listen();
  }
  
  protected async stopApp(): Promise<void> {
    await this.httpServer.close();
  }
}
```

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

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
