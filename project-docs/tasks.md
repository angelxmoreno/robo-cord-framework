# Discord Bot Framework - Development Tasks

## Phase 1: Monorepo Setup & Foundation

### Task 1: Monorepo Structure & Configuration
**Priority: CRITICAL**  
**Dependencies: None**  
**Estimated Time: 3-4 hours**

- [X] Initialize root workspace with `bun init`
- [X] Create monorepo directory structure (`packages/framework/`, `apps/example-bot/`)
- [X] Set up root `package.json` with workspace configuration
- [ ] Set up framework `package.json` as private GitHub registry package
- [X] Set up example-bot `package.json` with workspace dependency
- [X] Configure individual `tsconfig.json` files for framework and bot
- [X] Create `.env.example` templates for bot applications
- [X] Set up `docker-compose.yml` for shared development services
- [ ] Create workspace-level scripts for development and publishing

**Files to create:**
- `package.json` (root workspace)
- `packages/framework/package.json`
- `apps/example-bot/package.json`
- `tsconfig.json` (root and individual)
- `apps/example-bot/.env.example`
- `docker-compose.yml`
- `.gitignore`

### Task 2: Framework Package Structure & Config System
**Priority: HIGH**  
**Dependencies: Task 1**  
**Estimated Time: 4-5 hours**

- [X] Create `packages/framework/src/` directory structure
- [X] Create `packages/framework/src/utils/config.ts` with Zod schema
- [X] Implement `createConfig()` function for extensible configuration
- [X] Add environment-based defaults (dev vs prod)
- [X] Create type exports in `packages/framework/src/types/index.ts`
- [X] Test config validation with missing/invalid values
- [X] Create example bot config in `apps/example-bot/src/config.ts`
- [X] Set up framework exports in `packages/framework/src/index.ts`

**Files to create:**
- `packages/framework/src/utils/config.ts`
- `packages/framework/src/types/index.ts`
- `packages/framework/src/index.ts`
- `apps/example-bot/src/config.ts`

## Phase 2: Database Layer (Core Infrastructure)

### Task 3: Framework Database Entities & Connection
**Priority: HIGH**  
**Dependencies: Task 2**  
**Estimated Time: 5-6 hours**

- [X] Create all framework entities in `packages/framework/src/entities/`:
    - `UserEntity.ts`
    - `GuildEntity.ts`
    - `GuildMemberEntity.ts`
    - `MessageEntity.ts`
    - `LogEntity.ts`
    - `CommandUsageEntity.ts`
    - `BaseGuildSettingsEntity.ts`
    - `BaseUserSettingsEntity.ts`
- [X] Set up TypeORM DataSource configuration in framework
- [X] Create `DatabaseService.ts` for connection management
- [X] Test database connection with example bot
- [X] Add database entities to framework exports

**Files to create:**
- `packages/framework/src/entities/*.ts` (8 files)
- `packages/framework/src/services/DatabaseService.ts`
- `packages/framework/src/database/data-source.ts`

### Task 4: Queue System with pg-boss
**Priority: HIGH**  
**Dependencies: Task 3**  
**Estimated Time: 4-5 hours**

- [ ] Create `QueueService.ts` in framework with pg-boss wrapper
- [ ] Implement typed job registry system with Zod
- [ ] Create `BaseJob.ts` base class in framework
- [ ] Add job-related types and exports
- [ ] Test job sending and processing between bot and worker
- [ ] Create example job in `apps/example-bot/src/jobs/WelcomeJob.ts`
- [ ] Add error handling and logging for queue operations

**Files to create:**
- `packages/framework/src/services/QueueService.ts`
- `packages/framework/src/base/BaseJob.ts`
- `apps/example-bot/src/jobs/WelcomeJob.ts`

## Phase 3: Discord Integration & Base Classes

### Task 5: Discord Service & Base Command
**Priority: HIGH**  
**Dependencies: Task 3**  
**Estimated Time: 5-6 hours**

- [ ] Create `DiscordService.ts` for client management in framework
- [ ] Create `BaseEvent.ts` for Discord event handling in framework
- [ ] Create `SlashCommand.ts` base class in framework
- [ ] Implement basic command registration system
- [ ] Add Discord-related exports to framework
- [ ] Test Discord connection with example bot
- [ ] Create example command in `apps/example-bot/src/commands/PingCommand.ts`

**Files to create:**
- `packages/framework/src/services/DiscordService.ts`
- `packages/framework/src/base/BaseEvent.ts`
- `packages/framework/src/base/SlashCommand.ts`
- `apps/example-bot/src/commands/PingCommand.ts`

### Task 6: Logging Service
**Priority: MEDIUM**  
**Dependencies: Task 3**  
**Estimated Time: 3-4 hours**

- [ ] Create `LoggerService.ts` with Pino in framework
- [ ] Implement database logging integration
- [ ] Add different log levels and structured logging
- [ ] Test logging to both console and database
- [ ] Add logger to framework exports
- [ ] Integrate logging throughout existing services

**Files to create:**
- `packages/framework/src/services/LoggerService.ts`

## Phase 4: Auto-Discovery System (The Magic)

### Task 7: Convention-Based Discovery
**Priority: HIGH**  
**Dependencies: Task 5**  
**Estimated Time: 6-7 hours**

- [ ] Create `discovery.ts` utility in framework for auto-scanning files
- [ ] Create `conventions.ts` for naming rules (PingCommand → "ping")
- [ ] Implement command auto-discovery and registration
- [ ] Implement job auto-discovery and registration
- [ ] Implement event auto-discovery and registration
- [ ] Add discovery utilities to framework exports
- [ ] Test with multiple commands, jobs, and events in example bot

**Files to create:**
- `packages/framework/src/utils/discovery.ts`
- `packages/framework/src/utils/conventions.ts`
- `packages/framework/src/utils/automagic.ts`

### Task 8: Command Service & Registration
**Priority: HIGH**  
**Dependencies: Task 7**  
**Estimated Time: 4-5 hours**

- [ ] Create `CommandService.ts` for command management in framework
- [ ] Implement slash command registration with Discord API
- [ ] Add command prefix support
- [ ] Handle command name conflicts and validation
- [ ] Add command service to framework exports
- [ ] Create deployment script for commands in workspace scripts
- [ ] Test command registration with example bot

**Files to create:**
- `packages/framework/src/services/CommandService.ts`
- `scripts/deploy-commands.ts`

## Phase 5: Middleware System

### Task 9: Base Middleware & Common Decorators
**Priority: MEDIUM**  
**Dependencies: Task 8**  
**Estimated Time: 5-6 hours**

- [ ] Create `BaseMiddleware.ts` interface in framework
- [ ] Create `MiddlewareService.ts` for orchestration in framework
- [ ] Implement decorator-based middleware application system
- [ ] Create common decorators in framework:
    - `AdminOnly.ts`
    - `RateLimit.ts`
    - `LogUsage.ts`
- [ ] Create decorator index file for exports
- [ ] Test middleware pipeline with example bot commands
- [ ] Add middleware exports to framework

**Files to create:**
- `packages/framework/src/base/BaseMiddleware.ts`
- `packages/framework/src/services/MiddlewareService.ts`
- `packages/framework/src/decorators/AdminOnly.ts`
- `packages/framework/src/decorators/RateLimit.ts`
- `packages/framework/src/decorators/LogUsage.ts`
- `packages/framework/src/decorators/index.ts`

## Phase 6: Application Classes

### Task 10: BotApp Class
**Priority: HIGH**  
**Dependencies: Task 8, Task 9**  
**Estimated Time: 5-6 hours**

- [ ] Create `BotApp.ts` main application class in framework
- [ ] Implement auto-discovery integration for commands and events
- [ ] Add graceful startup and shutdown procedures
- [ ] Integrate all services (Database, Discord, Commands, etc.)
- [ ] Add BotApp to framework exports
- [ ] Create bot startup script in `apps/example-bot/src/apps/bot.ts`
- [ ] Test full bot initialization and command handling

**Files to create:**
- `packages/framework/src/apps/BotApp.ts`
- `apps/example-bot/src/apps/bot.ts`

### Task 11: WorkerApp Class
**Priority: HIGH**  
**Dependencies: Task 4, Task 10**  
**Estimated Time: 4-5 hours**

- [ ] Create `WorkerApp.ts` worker application class in framework
- [ ] Implement job processing with auto-discovery
- [ ] Add worker health monitoring and graceful shutdown
- [ ] Add WorkerApp to framework exports
- [ ] Create worker startup script in `apps/example-bot/src/apps/worker.ts`
- [ ] Test job processing pipeline between bot and worker
- [ ] Add workspace scripts for running workers

**Files to create:**
- `packages/framework/src/apps/WorkerApp.ts`
- `apps/example-bot/src/apps/worker.ts`

## Phase 7: Dependency Injection & Container

### Task 12: TSyringe Integration
**Priority: MEDIUM**  
**Dependencies: Task 11**  
**Estimated Time: 4-5 hours**

- [ ] Set up TSyringe container configuration in framework
- [ ] Register all framework services in container
- [ ] Create container setup utilities
- [ ] Add DI exports to framework
- [ ] Create user container setup in `apps/example-bot/src/container.ts`
- [ ] Update all services to use dependency injection
- [ ] Test DI throughout the application stack

**Files to create:**
- `packages/framework/src/container.ts`
- `apps/example-bot/src/container.ts`

## Phase 8: Hot Reloading & Development Experience

### Task 13: Hot Reloading System
**Priority: MEDIUM**  
**Dependencies: Task 12**  
**Estimated Time: 5-7 hours**

- [ ] Implement file watching for commands, jobs, events in framework
- [ ] Create hot-reload mechanism that preserves Discord connection
- [ ] Add hot-reload for middleware and custom services
- [ ] Add development-only safety checks and warnings
- [ ] Test hot-reload stability with example bot
- [ ] Add hot-reload utilities to framework exports

**Files to create:**
- `packages/framework/src/utils/hot-reload.ts`

### Task 14: Framework Exports & Example Bot Completion
**Priority: MEDIUM**  
**Dependencies: Task 13**  
**Estimated Time: 3-4 hours**

- [ ] Complete `packages/framework/src/index.ts` with all exports
- [ ] Create comprehensive example commands in example bot
- [ ] Create example jobs with different schemas in example bot
- [ ] Create example events in example bot
- [ ] Create example middleware in example bot
- [ ] Add example custom entities to example bot
- [ ] Update workspace scripts for complete development workflow

**Files to create:**
- Complete `packages/framework/src/index.ts`
- Multiple example files in `apps/example-bot/src/`
- Additional example entities, services, middleware

## Phase 9: Additional Bot Applications & Framework Validation

### Task 15: Second Bot Application
**Priority: MEDIUM**  
**Dependencies: Task 14**  
**Estimated Time: 4-5 hours**

- [ ] Create `apps/moderation-bot/` with different use case
- [ ] Set up moderation bot package.json and config
- [ ] Create moderation-specific commands and jobs
- [ ] Test framework flexibility with different bot patterns
- [ ] Add workspace scripts for moderation bot
- [ ] Validate framework APIs work across different use cases

**Files to create:**
- Complete `apps/moderation-bot/` structure
- Moderation-specific commands, jobs, events

### Task 16: Framework Publishing & Documentation
**Priority: LOW**  
**Dependencies: Task 15**  
**Estimated Time: 4-5 hours**

- [ ] Set up GitHub Package Registry configuration
- [ ] Create publishing scripts and CI/CD workflows
- [ ] Add comprehensive JSDoc comments to framework code
- [ ] Create framework README with API documentation
- [ ] Create migration guides and best practices
- [ ] Test framework publishing to private registry
- [ ] Performance testing and optimization across multiple bots

**Files to create:**
- Publishing and CI/CD configuration
- Comprehensive documentation
- Performance benchmarks

---

## 📋 Development Tips

**Start Simple:** Begin with Task 1 and work sequentially. The monorepo structure is critical to get right first.

**Test Immediately:** After each framework task, test the changes with the example bot to ensure everything works.

**Multiple Apps:** After Task 14, create additional bot applications to validate framework flexibility.

**Version Control:** Use workspace versioning to manage framework updates across multiple bot applications.

**Total Estimated Time:** 65-80 hours of development work

The tasks are ordered for monorepo development where you build the framework package and test it immediately with bot applications, ensuring real-world validation at every step.