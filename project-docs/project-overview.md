# Discord Bot Enterprise Framework

A production-ready Discord bot framework built with TypeScript, featuring database access, worker queues, slash command routing, and enterprise-level architecture with convention-over-configuration design principles. Developed as a monorepo with the framework as a private package and multiple bot applications for real-world testing.

## 🚀 Features

- **Two-App Architecture**: Separate bot and worker processes sharing resources
- **Database Integration**: PostgreSQL with TypeORM and auto-migrations
- **Worker Queue System**: Background job processing with pg-boss
- **Slash Command Routing**: Auto-discovered modular command system
- **Event System**: Auto-registered Discord event handlers
- **Middleware Pipeline**: Decorator-based command middleware
- **Dependency Injection**: Clean architecture with TSyringe
- **Type Safety**: Full TypeScript + Zod validation with strict typing
- **Hot Reloading**: Commands, jobs, and events refresh without restart
- **Convention Over Configuration**: Automagic discovery and registration
- **Enterprise Logging**: Pino logger with database storage
- **Extensible Config**: Strongly typed configuration system
- **Monorepo Structure**: Framework package + multiple bot applications

## 📁 Monorepo Structure

```
discord-bot-framework/
├── packages/
│   └── framework/                          # Framework package
│       ├── src/
│       │   ├── apps/
│       │   │   ├── BotApp.ts              # Main bot application class
│       │   │   └── WorkerApp.ts           # Worker queue application class
│       │   ├── base/
│       │   │   ├── SlashCommand.ts        # Base slash command class
│       │   │   ├── BaseJob.ts             # Base job processor class
│       │   │   ├── BaseEvent.ts           # Base Discord event handler
│       │   │   └── BaseMiddleware.ts      # Base command middleware
│       │   ├── services/
│       │   │   ├── CommandService.ts      # Command registration & management
│       │   │   ├── QueueService.ts        # pg-boss queue wrapper
│       │   │   ├── DatabaseService.ts     # TypeORM connection management
│       │   │   ├── LoggerService.ts       # Pino logger setup
│       │   │   ├── MiddlewareService.ts   # Middleware orchestration
│       │   │   └── DiscordService.ts      # Discord client wrapper
│       │   ├── decorators/
│       │   │   ├── AdminOnly.ts           # Admin-only command decorator
│       │   │   ├── RateLimit.ts           # Rate limiting decorator
│       │   │   ├── LogUsage.ts            # Usage logging decorator
│       │   │   └── index.ts               # Decorator exports
│       │   ├── entities/
│       │   │   ├── LogEntity.ts           # Application logs
│       │   │   ├── CommandUsageEntity.ts  # Command usage analytics
│       │   │   ├── UserEntity.ts          # Discord users
│       │   │   ├── GuildEntity.ts         # Discord guilds
│       │   │   ├── MessageEntity.ts       # Discord messages
│       │   │   ├── GuildSettingsEntity.ts # Per-guild configuration
│       │   │   └── UserSettingsEntity.ts  # Per-user preferences
│       │   ├── utils/
│       │   │   ├── discovery.ts           # Auto-discovery system
│       │   │   ├── conventions.ts         # Naming convention handlers
│       │   │   ├── automagic.ts           # Auto-registration utilities
│       │   │   └── config.ts              # Config system utilities
│       │   ├── types/
│       │   │   └── index.ts               # Framework type definitions
│       │   └── index.ts                   # Framework exports
│       ├── package.json                   # Framework package config
│       └── tsconfig.json                  # Framework TypeScript config
├── apps/
│   ├── example-bot/                       # Primary test application
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   │   ├── PingCommand.ts         # Example: /ping command
│   │   │   │   ├── BanCommand.ts          # Example: /ban command
│   │   │   │   └── UserInfoCommand.ts     # Example: /user-info command
│   │   │   ├── jobs/
│   │   │   │   ├── WelcomeJob.ts          # Welcome new users
│   │   │   │   ├── ModerationJob.ts       # Process moderation actions
│   │   │   │   └── AnalyticsJob.ts        # Generate analytics
│   │   │   ├── events/
│   │   │   │   ├── MessageCreateEvent.ts  # Handle message creation
│   │   │   │   ├── GuildJoinEvent.ts      # Handle guild joins
│   │   │   │   └── MemberJoinEvent.ts     # Handle member joins
│   │   │   ├── middleware/
│   │   │   │   ├── CustomAuthMiddleware.ts # Custom authentication
│   │   │   │   └── LoggingMiddleware.ts   # Custom logging
│   │   │   ├── entities/
│   │   │   │   ├── CustomEntity.ts        # Custom entities
│   │   │   │   └── GameStatsEntity.ts     # Game statistics
│   │   │   ├── services/
│   │   │   │   ├── MyCustomService.ts     # Custom services
│   │   │   │   └── ExternalAPIService.ts  # External API integrations
│   │   │   ├── apps/
│   │   │   │   ├── bot.ts                 # Bot startup script
│   │   │   │   └── worker.ts              # Worker startup script
│   │   │   ├── config.ts                  # Bot configuration
│   │   │   └── container.ts               # Dependency injection setup
│   │   ├── .env.example                   # Environment variables
│   │   ├── package.json                   # Bot dependencies
│   │   └── tsconfig.json                  # Bot TypeScript config
│   ├── moderation-bot/                    # Specialized moderation bot
│   ├── music-bot/                         # Music streaming bot
│   └── analytics-bot/                     # Analytics and reporting bot
├── scripts/
│   ├── deploy-commands.ts                 # Register slash commands
│   ├── migrate.ts                         # Run database migrations
│   └── publish-framework.ts               # Publish to GitHub registry
├── docker/
│   ├── docker-compose.yml                # Development services
│   └── Dockerfile.bot                    # Bot container template
├── tests/
│   ├── framework/                         # Framework tests
│   └── integration/                       # Cross-app integration tests
├── package.json                          # Root workspace config
├── tsconfig.json                          # Root TypeScript config
└── README.md                              # Documentation
```

## 🔧 TypeScript Path Mapping

```json
// Root tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@discord-bot-framework/*": ["packages/framework/src/*"],
      "@discord-bot-framework": ["packages/framework/src/index.ts"]
    }
  }
}

// Bot app tsconfig.json (extends root)
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

## 📦 Package Configuration

```json
// Root package.json - Workspace management
{
  "name": "discord-bot-monorepo",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "build": "bun run --filter='@yourname/discord-bot-framework' build",
    "dev:example": "bun run --filter=example-bot dev:bot",
    "dev:moderation": "bun run --filter=moderation-bot dev:bot",
    "publish:framework": "cd packages/framework && npm publish",
    "test": "bun test"
  }
}

// packages/framework/package.json - Framework package
{
  "name": "@yourname/discord-bot-framework",
  "version": "0.1.0",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "dependencies": {
    "discord.js": "^14.14.1",
    "typeorm": "^0.3.17",
    "pg-boss": "^9.0.3",
    "zod": "^3.22.4",
    "tsyringe": "^4.8.0",
    "pino": "^8.16.2"
  }
}

// apps/example-bot/package.json - Bot application
{
  "name": "example-bot",
  "private": true,
  "scripts": {
    "dev:bot": "bun run --hot src/apps/bot.ts",
    "dev:worker": "bun run --hot src/apps/worker.ts",
    "build": "tsc",
    "start:bot": "bun run dist/apps/bot.js"
  },
  "dependencies": {
    "@yourname/discord-bot-framework": "workspace:*"
  }
}
```

## 🎯 Development Workflow

### Framework Development
```bash
# Work on framework
cd packages/framework
# Make changes, test with example bot

# Test changes immediately
cd ../../apps/example-bot
bun run dev:bot
```

### Bot Development
```bash
# Create new bot
mkdir apps/my-new-bot
cd apps/my-new-bot

# Use framework
import { BotApp, SlashCommand } from '@yourname/discord-bot-framework';
```

### Publishing (Private)
```bash
# When ready to share framework
bun run publish:framework
```

## 📋 Usage Examples

### Creating a Command in a Bot App
```typescript
// apps/example-bot/src/commands/PingCommand.ts
import { SlashCommand, AdminOnly, RateLimit } from '@yourname/discord-bot-framework';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

@AdminOnly()
@RateLimit(5, '1m')
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

### Creating a Job in a Bot App
```typescript
// apps/example-bot/src/jobs/WelcomeJob.ts
import { BaseJob } from '@yourname/discord-bot-framework';
import { z } from 'zod';

const WelcomeJobSchema = z.object({
  userId: z.string(),
  guildId: z.string(),
  welcomeMessage: z.string().optional()
});

export class WelcomeJob extends BaseJob<typeof WelcomeJobSchema> {
  name = 'welcome';
  schema = WelcomeJobSchema;
  
  async execute(data: z.infer<typeof WelcomeJobSchema>): Promise<void> {
    // Send welcome message logic
  }
}
```

### Bot Application Startup
```typescript
// apps/example-bot/src/apps/bot.ts
import { BotApp, createConfig } from '@yourname/discord-bot-framework';
import { z } from 'zod';

const MyConfigSchema = z.object({
  openai: z.object({
    apiKey: z.string().min(1, 'OpenAI API key required'),
    model: z.string().default('gpt-3.5-turbo'),
  }),
});

const config = createConfig(MyConfigSchema);

const bot = new BotApp({
  config,
  commandsPath: './src/commands',
  eventsPath: './src/events',
  entitiesPath: './src/entities',
});

bot.start();
```

## 🚀 Quick Start

1. **Clone the monorepo**:
   ```bash
   git clone https://github.com/yourname/discord-bot-framework
   cd discord-bot-framework
   bun install
   ```

2. **Set up example bot**:
   ```bash
   cd apps/example-bot
   cp .env.example .env
   # Edit .env with your Discord bot token
   ```

3. **Start development services**:
   ```bash
   docker-compose up -d postgres
   ```

4. **Run the example bot**:
   ```bash
   bun run dev:example
   ```

## 🔄 Update Strategy

Updates are handled through the monorepo structure:

- **Framework updates**: Modify `packages/framework/`, test with existing apps
- **Breaking changes**: Update all apps in the monorepo to maintain compatibility
- **Version bumping**: Use workspace dependency updates
- **Distribution**: Publish framework to GitHub Package Registry when stable

This approach allows rapid iteration while maintaining multiple real-world test applications, ensuring the framework meets practical needs before any public release.