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

## Phase 2: Core Utilities (Foundation)

### Task 3: Discovery & Convention Utilities
**Priority: HIGH**  
**Dependencies: Task 2**  
**Status: PARTIALLY COMPLETE** ✅  
**Estimated Time: 4-5 hours** (3 hours completed)

**Discovery System Implementation:**
- [X] Create `packages/framework/src/services/DiscoveryService.ts` with `DiscoveryService` class
- [X] Implement entity discovery with `DiscoveryService.discoverEntities()` 
- [X] Implement command discovery with `DiscoveryService.discoverCommands()`
- [X] Implement job discovery with `DiscoveryService.discoverJobs()`
- [X] Implement event discovery with `DiscoveryService.discoverEvents()`
- [X] Add proper TypeScript types (`ClassConstructor`, type guards)
- [X] Support both `.ts` and `.js` files for development and production
- [X] Add comprehensive error handling and logging
- [X] Create class validation methods for all discovery types
- [X] Add utilities to framework exports
- [X] Update all documentation to use `DiscoveryService` API

**Still Needed:**
- [ ] Create `packages/framework/src/utils/automagic.ts` for auto-registration (deferred until DiscordService available)
- [ ] Test utilities with example file structures in summarizer-bot

**Files completed:**
- ✅ `packages/framework/src/services/DiscoveryService.ts` - Full `DiscoveryService` implementation
- ✅ `packages/framework/src/services/index.ts` - Added DiscoveryService export
- ✅ `packages/framework/src/types/index.ts` - Added `ClassConstructor` type export
- ✅ `packages/framework/src/utils/conventions.ts` - Naming pattern utilities
- ✅ `packages/framework/src/utils/index.ts` - Added conventions export

**Files still to create:**
- `packages/framework/src/utils/automagic.ts` (deferred - needs DiscordService)

**Key Implementation Details:**
- **Service Architecture**: `DiscoveryService` in services directory with logger state for debugging
- **Configurable Paths**: Uses `config.paths.*` resolved to absolute paths by `createConfig()`
- **Type Safety**: All methods return `ClassConstructor[]` with proper type guards
- **Convention-based**: Discovers files matching `*Entity.{ts,js}`, `*Command.{ts,js}`, etc.
- **Production Ready**: Supports both TypeScript development and compiled JavaScript
- **Framework Service**: Exported from `services/index.ts` alongside other framework services

### Task 4: Framework Database Entities & Connection
**Priority: HIGH**  
**Dependencies: Task 3**  
**Estimated Time: 4-5 hours**

- [X] Create all framework entities in `packages/framework/src/entities/`:
    - `UserEntity.ts`
    - `GuildEntity.ts`
    - `GuildMemberEntity.ts`
    - `MessageEntity.ts`
    - `LogEntity.ts`
    - `CommandUsageEntity.ts`
    - `BaseGuildSettingsEntity.ts`
    - `BaseUserSettingsEntity.ts`
- [ ] Update `DatabaseService.ts` to accept entities array in constructor
- [X] Test database connection with example bot
- [X] Add database entities to framework exports
- [ ] Remove `packages/framework/src/database/data-source.ts` (no longer needed)

**Files to create:**
- `packages/framework/src/entities/*.ts` (8 files)
- `packages/framework/src/services/DatabaseService.ts`

**Files to remove:**
- `packages/framework/src/database/data-source.ts`

## Phase 3: Base Classes & Services

### Task 5: Base Classes for User Extension
**Priority: HIGH**  
**Dependencies: Task 4**  
**Estimated Time: 3-4 hours**

- [ ] Create `SlashCommand.ts` base class in framework
- [ ] Create `BaseEvent.ts` for Discord event handling in framework
- [ ] Create `BaseJob.ts` base class in framework
- [ ] Create `BaseMiddleware.ts` interface in framework
- [ ] Add base class exports to framework
- [ ] Test base classes with example implementations

**Files to create:**
- `packages/framework/src/base/SlashCommand.ts`
- `packages/framework/src/base/BaseEvent.ts`
- `packages/framework/src/base/BaseJob.ts`
- `packages/framework/src/base/BaseMiddleware.ts`

### Task 6: Logging Service
**Priority: HIGH**  
**Dependencies: Task 4**  
**Estimated Time: 3-4 hours**

- [X] Create `LoggerService.ts` with Pino in framework
- [ ] Implement database logging integration with LogEntity
- [X] Add different log levels and structured logging
- [X] Test logging to console
- [ ] Test logging to database
- [X] Add logger to framework exports
- [ ] Integrate logging throughout existing services

**Files to create:**
- `packages/framework/src/services/LoggerService.ts`

### Task 7: Common Decorators & Middleware System
**Priority: HIGH**  
**Dependencies: Task 5, Task 6**  
**Estimated Time: 4-5 hours**

- [ ] Create common decorators in framework:
    - `AdminOnly.ts`
    - `RateLimit.ts`
    - `LogUsage.ts`
- [ ] Create `BaseMiddleware.ts` interface in framework
- [ ] Create `MiddlewareService.ts` for orchestration in framework
- [ ] Implement decorator-based middleware application system
- [ ] Create decorator index file for exports
- [ ] Add middleware exports to framework
- [ ] Test middleware pipeline with mock implementations

**Files to create:**
- `packages/framework/src/decorators/AdminOnly.ts`
- `packages/framework/src/decorators/RateLimit.ts`
- `packages/framework/src/decorators/LogUsage.ts`
- `packages/framework/src/decorators/index.ts`
- `packages/framework/src/services/MiddlewareService.ts`

### Task 8: Core Services (Discord, Queue, Commands)
**Priority: HIGH**  
**Dependencies: Task 7**  
**Estimated Time: 5-6 hours**

- [ ] Create `DiscordService.ts` for client management in framework
- [ ] Create `QueueService.ts` in framework with pg-boss wrapper
- [ ] Create `CommandService.ts` for command management in framework
- [ ] Implement typed job registry system with Zod
- [ ] Implement command registration with Discord API
- [ ] Integrate middleware system with CommandService
- [ ] Add services to framework exports
- [ ] Test services individually with middleware

**Files to create:**
- `packages/framework/src/services/DiscordService.ts`
- `packages/framework/src/services/QueueService.ts`
- `packages/framework/src/services/CommandService.ts`

## Phase 4: RoboCordApp Base Class (Core Architecture)

### Task 9: RoboCordApp Abstract Base Class
**Priority: CRITICAL**  
**Dependencies: Task 8**  
**Estimated Time: 5-6 hours**

- [ ] Create abstract `RoboCordApp.ts` base class in framework
- [ ] Implement shared initialization logic (logger, database, entities)
- [ ] Add template methods for app-specific services
- [ ] Integrate with discovery utilities for entity/command/job scanning
- [ ] Add service lifecycle management (startup/shutdown)
- [ ] Add graceful error handling and logging
- [ ] Test base class functionality with mock implementations
- [ ] Add RoboCordApp to framework exports

**Files to create:**
- `packages/framework/src/apps/RoboCordApp.ts`

### Task 10: BotApp Implementation
**Priority: HIGH**  
**Dependencies: Task 9**  
**Estimated Time: 3-4 hours**

- [ ] Convert existing `BotApp.ts` to extend RoboCordApp
- [ ] Implement Discord-specific template methods
- [ ] Remove initialization duplication (inherited from base)
- [ ] Add command and event auto-discovery integration
- [ ] Test Discord integration with base class
- [ ] Update example bot to use new inheritance pattern

**Files to update:**
- `packages/framework/src/apps/BotApp.ts`
- `apps/example-bot/src/index.ts`

### Task 11: WorkerApp Implementation  
**Priority: HIGH**  
**Dependencies: Task 9**  
**Estimated Time: 3-4 hours**

- [ ] Convert existing `WorkerApp.ts` to extend RoboCordApp
- [ ] Implement queue-specific template methods
- [ ] Remove initialization duplication (inherited from base)
- [ ] Add job auto-discovery integration
- [ ] Test job processing with base class
- [ ] Create worker startup example

**Files to update:**
- `packages/framework/src/apps/WorkerApp.ts`

**Files to create:**
- `apps/example-bot/src/apps/worker.ts`

## Phase 6: Example Implementation & Testing

### Task 12: Complete Example Bot
**Priority: MEDIUM**  
**Dependencies: Task 11**  
**Estimated Time: 4-5 hours**

- [ ] Create comprehensive example commands in example bot
- [ ] Create example jobs with different schemas in example bot
- [ ] Create example events in example bot
- [ ] Create example middleware in example bot
- [ ] Create example custom entities extending base entities
- [ ] Test full inheritance workflow with RoboCordApp
- [ ] Update workspace scripts for complete development workflow

**Files to create:**
- Multiple example files in `apps/example-bot/src/`
- Additional example entities, services, middleware
- `apps/example-bot/src/apps/bot.ts`
- `apps/example-bot/src/apps/worker.ts`

## Phase 5: Advanced Features & Validation

### Task 13: Hot Reloading System (Optional)
**Priority: LOW**  
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

### Task 14: Second Bot Application (Framework Validation)
**Priority: MEDIUM**  
**Dependencies: Task 12**  
**Estimated Time: 4-5 hours**

- [ ] Create `apps/moderation-bot/` with different use case
- [ ] Set up moderation bot package.json and config
- [ ] Create moderation-specific commands and jobs using RoboCordApp
- [ ] Test framework inheritance flexibility with different bot patterns
- [ ] Add workspace scripts for moderation bot
- [ ] Validate RoboCordApp works across different use cases

**Files to create:**
- Complete `apps/moderation-bot/` structure
- Moderation-specific commands, jobs, events
- `apps/moderation-bot/src/apps/bot.ts` (extends RoboCordApp)
- `apps/moderation-bot/src/apps/worker.ts` (extends RoboCordApp)

### Task 15: Framework Exports & Documentation
**Priority: MEDIUM**  
**Dependencies: Task 14**  
**Estimated Time: 3-4 hours**

- [ ] Complete `packages/framework/src/index.ts` with all exports
- [ ] Add comprehensive JSDoc comments to RoboCordApp and services
- [ ] Update framework README with inheritance patterns
- [ ] Create migration guides for inheritance approach
- [ ] Update workspace scripts for complete development workflow

**Files to update:**
- `packages/framework/src/index.ts`
- `packages/framework/README.md`

## Phase 6: Future Enhancements

### Task 16: ApiApp Implementation (Future)
**Priority: LOW**  
**Dependencies: Task 15**  
**Estimated Time: 4-5 hours**

- [ ] Create `ApiApp.ts` extending RoboCordApp
- [ ] Implement HTTP server-specific template methods
- [ ] Add route discovery and registration
- [ ] Create example API bot application
- [ ] Test three-app architecture (Bot, Worker, API)

**Files to create:**
- `packages/framework/src/apps/ApiApp.ts`
- `apps/api-bot/` structure

### Task 17: Framework Publishing & CI/CD
**Priority: LOW**  
**Dependencies: Task 15**  
**Estimated Time: 4-5 hours**

- [ ] Set up GitHub Package Registry configuration
- [ ] Create publishing scripts and CI/CD workflows
- [ ] Create framework README with API documentation
- [ ] Test framework publishing to private registry
- [ ] Performance testing and optimization across multiple bots

**Files to create:**
- Publishing and CI/CD configuration
- Comprehensive documentation
- Performance benchmarks

---

## 📋 Development Tips

**Dependency Order:** Build low-level utilities first (discovery, conventions), then services that depend on them, then the RoboCordApp that orchestrates everything.

**Test Immediately:** After each framework task, test the changes with the example bot to ensure everything works.

**Template Method Pattern:** Focus on the RoboCordApp base class (Task 8) - this is the core architecture that eliminates duplication.

**Inheritance Testing:** After Task 9-10, create additional bot applications to validate the inheritance approach works across different use cases.

**Version Control:** Use workspace versioning to manage framework updates across multiple bot applications.

**Total Estimated Time:** 45-60 hours of development work (reduced due to inheritance eliminating duplication)

The tasks are ordered for dependency-driven development: utilities → services → base class → concrete apps, ensuring each layer builds properly on the previous foundation.