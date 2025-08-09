# Discord Bot Framework - Database Schema

> **🚧 Status: Active Development - Implementation in Progress**
> 
> This document describes the database schema currently being implemented for the framework. The TypeORM entities are being developed in this branch based on this design specification.

## Framework Tables (Always Included)

### 1. UserEntity

| Column Name | Index Type | Column Type | Default Value | Nullable | Description |
|-------------|------------|-------------|---------------|----------|-------------|
| id | Primary Key | VARCHAR(20) | - | No | Discord user ID (snowflake) |
| username | Index | VARCHAR(32) | - | No | Discord username |
| global_name | None | VARCHAR(32) | NULL | Yes | User's global display name |
| discriminator | None | VARCHAR(4) | NULL | Yes | User's discriminator (legacy) |
| avatar_hash | None | VARCHAR(255) | NULL | Yes | Discord avatar hash |
| avatar_url | None | TEXT | NULL | Yes | Full avatar URL |
| is_bot | Index | BOOLEAN | false | No | Whether the user is a bot |
| is_system | None | BOOLEAN | false | No | Whether the user is a Discord system user |
| public_flags | None | INTEGER | 0 | No | Discord user public flags (badges) |
| account_created_at | Index | TIMESTAMP | NULL | Yes | When Discord account was created |
| last_seen_at | Index | TIMESTAMP | NULL | Yes | Last time user was seen globally |
| created_at | Index | TIMESTAMP | NOW() | No | When record was created |
| updated_at | None | TIMESTAMP | NOW() | No | When record was last updated |

### 2. GuildEntity

| Column Name | Index Type | Column Type | Default Value | Nullable | Description |
|-------------|------------|-------------|---------------|----------|-------------|
| id | Primary Key | VARCHAR(20) | - | No | Discord guild ID (snowflake) |
| name | Index | VARCHAR(100) | - | No | Guild name |
| icon_hash | None | VARCHAR(255) | NULL | Yes | Guild icon hash |
| icon_url | None | TEXT | NULL | Yes | Full icon URL |
| owner_id | Index | VARCHAR(20) | - | No | Guild owner's user ID |
| member_count | None | INTEGER | 0 | No | Approximate member count |
| is_large | None | BOOLEAN | false | No | Whether guild is considered large |
| verification_level | None | INTEGER | 0 | No | Guild verification level |
| joined_at | Index | TIMESTAMP | NOW() | No | When bot joined this guild |
| left_at | Index | TIMESTAMP | NULL | Yes | When bot left this guild (if applicable) |
| is_active | Index | BOOLEAN | true | No | Whether bot is currently in guild |
| created_at | Index | TIMESTAMP | NOW() | No | When record was created |
| updated_at | None | TIMESTAMP | NOW() | No | When record was last updated |

### 3. GuildMemberEntity

| Column Name | Index Type | Column Type | Default Value | Nullable | Description |
|-------------|------------|-------------|---------------|----------|-------------|
| id | Primary Key | UUID | gen_random_uuid() | No | Unique guild member record ID |
| user_id | Index | VARCHAR(20) | - | No | Discord user ID (FK to UserEntity) |
| guild_id | Index | VARCHAR(20) | - | No | Discord guild ID (FK to GuildEntity) |
| nickname | Index | VARCHAR(32) | NULL | Yes | Guild-specific nickname |
| joined_at | Index | TIMESTAMP | - | No | When user joined this guild |
| left_at | Index | TIMESTAMP | NULL | Yes | When user left this guild |
| is_owner | Index | BOOLEAN | false | No | Whether user is guild owner |
| is_active | Index | BOOLEAN | true | No | Whether user is currently in guild |
| roles | None | JSONB | '[]' | No | Array of role IDs user has in guild |
| boost_since | None | TIMESTAMP | NULL | Yes | When user started boosting guild |
| timeout_until | Index | TIMESTAMP | NULL | Yes | When user's timeout expires |
| avatar_hash | None | VARCHAR(255) | NULL | Yes | Guild-specific avatar hash |
| avatar_url | None | TEXT | NULL | Yes | Guild-specific avatar URL |
| voice_channel_id | Index | VARCHAR(20) | NULL | Yes | Current voice channel (if connected) |
| voice_joined_at | None | TIMESTAMP | NULL | Yes | When user joined current voice channel |
| created_at | Index | TIMESTAMP | NOW() | No | When record was created |
| updated_at | None | TIMESTAMP | NOW() | No | When record was last updated |

### 4. MessageEntity

| Column Name | Index Type | Column Type | Default Value | Nullable | Description |
|-------------|------------|-------------|---------------|----------|-------------|
| id | Primary Key | VARCHAR(20) | - | No | Discord message ID (snowflake) |
| channel_id | Index | VARCHAR(20) | - | No | Discord channel ID where message was sent |
| guild_id | Index | VARCHAR(20) | NULL | Yes | Discord guild ID (null for DMs) |
| author_id | Index | VARCHAR(20) | - | No | User ID of message author |
| content | None | TEXT | '' | No | Message content |
| clean_content | None | TEXT | '' | No | Message content with mentions cleaned |
| embed_count | None | INTEGER | 0 | No | Number of embeds in message |
| attachment_count | None | INTEGER | 0 | No | Number of attachments in message |
| mention_count | None | INTEGER | 0 | No | Number of user mentions in message |
| reaction_count | None | INTEGER | 0 | No | Number of reactions on message |
| is_pinned | Index | BOOLEAN | false | No | Whether message is pinned |
| is_tts | None | BOOLEAN | false | No | Whether message is text-to-speech |
| is_edited | Index | BOOLEAN | false | No | Whether message has been edited |
| edited_at | Index | TIMESTAMP | NULL | Yes | When message was last edited |
| deleted_at | Index | TIMESTAMP | NULL | Yes | When message was deleted |
| sent_at | Index | TIMESTAMP | - | No | When message was sent (Discord timestamp) |
| created_at | Index | TIMESTAMP | NOW() | No | When record was created |

### 5. LogEntity

| Column Name | Index Type | Column Type | Default Value | Nullable | Description |
|-------------|------------|-------------|---------------|----------|-------------|
| id | Primary Key | UUID | gen_random_uuid() | No | Unique log entry ID |
| level | Index | VARCHAR(10) | 'info' | No | Log level (error, warn, info, debug) |
| message | None | TEXT | - | No | Log message |
| service | Index | VARCHAR(50) | 'general' | No | Service that generated the log |
| category | Index | VARCHAR(50) | 'general' | No | Log category |
| user_id | Index | VARCHAR(20) | NULL | Yes | Associated user ID (if applicable) |
| guild_id | Index | VARCHAR(20) | NULL | Yes | Associated guild ID (if applicable) |
| command_name | Index | VARCHAR(50) | NULL | Yes | Associated command name (if applicable) |
| job_name | Index | VARCHAR(50) | NULL | Yes | Associated job name (if applicable) |
| error_stack | None | TEXT | NULL | Yes | Error stack trace (for error logs) |
| metadata | None | JSONB | '{}' | No | Additional log metadata |
| created_at | Index | TIMESTAMP | NOW() | No | When log entry was created |

### 6. CommandUsageEntity

| Column Name | Index Type | Column Type | Default Value | Nullable | Description |
|-------------|------------|-------------|---------------|----------|-------------|
| id | Primary Key | UUID | gen_random_uuid() | No | Unique usage record ID |
| command_name | Index | VARCHAR(50) | - | No | Name of the executed command |
| user_id | Index | VARCHAR(20) | - | No | User who executed the command |
| guild_id | Index | VARCHAR(20) | NULL | Yes | Guild where command was executed |
| channel_id | Index | VARCHAR(20) | - | No | Channel where command was executed |
| success | Index | BOOLEAN | true | No | Whether command executed successfully |
| execution_time_ms | None | INTEGER | 0 | No | Command execution time in milliseconds |
| error_message | None | TEXT | NULL | Yes | Error message if command failed |
| parameters | None | JSONB | '{}' | No | Command parameters used |
| response_type | None | VARCHAR(20) | 'reply' | No | Type of response (reply, followup, etc) |
| created_at | Index | TIMESTAMP | NOW() | No | When command was executed |

### 7. GuildSettingsEntity

| Column Name | Index Type | Column Type | Default Value | Nullable | Description |
|-------------|------------|-------------|---------------|----------|-------------|
| id | Primary Key | UUID | gen_random_uuid() | No | Unique settings ID |
| guild_id | Unique | VARCHAR(20) | - | No | Guild ID these settings belong to |
| prefix | None | VARCHAR(10) | '!' | No | Command prefix for this guild |
| language | None | VARCHAR(5) | 'en' | No | Preferred language for responses |
| timezone | None | VARCHAR(50) | 'UTC' | No | Guild's timezone |
| welcome_enabled | None | BOOLEAN | false | No | Whether welcome messages are enabled |
| welcome_channel_id | None | VARCHAR(20) | NULL | Yes | Channel for welcome messages |
| welcome_message | None | TEXT | NULL | Yes | Custom welcome message template |
| moderation_enabled | None | BOOLEAN | false | No | Whether moderation features are enabled |
| moderation_log_channel_id | None | VARCHAR(20) | NULL | Yes | Channel for moderation logs |
| auto_role_enabled | None | BOOLEAN | false | No | Whether auto-role is enabled |
| auto_role_id | None | VARCHAR(20) | NULL | Yes | Role ID to assign to new members |
| settings | None | JSONB | '{}' | No | Additional custom settings |
| created_at | Index | TIMESTAMP | NOW() | No | When settings were created |
| updated_at | None | TIMESTAMP | NOW() | No | When settings were last updated |

### 7. BaseGuildSettingsEntity (Framework Base Entity)

| Column Name | Index Type | Column Type | Default Value | Nullable | Description |
|-------------|------------|-------------|---------------|----------|-------------|
| id | Primary Key | UUID | gen_random_uuid() | No | Unique settings ID |
| guild_id | Unique | VARCHAR(20) | - | No | Guild ID these settings belong to |
| metadata | None | JSONB | '{}' | No | Additional framework metadata |
| created_at | Index | TIMESTAMP | NOW() | No | When settings were created |
| updated_at | None | TIMESTAMP | NOW() | No | When settings were last updated |

**Note:** This is the base entity that user apps extend. Example user extension:
```typescript
// Framework provides
export abstract class BaseGuildSettingsEntity { ... }

// User extends
@Entity('guild_settings')
export class GuildSettingsEntity extends BaseGuildSettingsEntity {
  @Column({ default: '!' })
  prefix: string;
  
  @Column({ default: 'en' })
  language: string;
  
  @Column({ default: true })
  welcome_enabled: boolean;
  
  // ... other app-specific settings
}
```

### 8. BaseUserSettingsEntity (Framework Base Entity)

| Column Name | Index Type | Column Type | Default Value | Nullable | Description |
|-------------|------------|-------------|---------------|----------|-------------|
| id | Primary Key | UUID | gen_random_uuid() | No | Unique settings ID |
| user_id | Unique | VARCHAR(20) | - | No | User ID these settings belong to |
| metadata | None | JSONB | '{}' | No | Additional framework metadata |
| created_at | Index | TIMESTAMP | NOW() | No | When settings were created |
| updated_at | None | TIMESTAMP | NOW() | No | When settings were last updated |

**Note:** This is the base entity that user apps extend. Example user extension:
```typescript
// Framework provides
export abstract class BaseUserSettingsEntity { ... }

// User extends
@Entity('user_settings')
export class UserSettingsEntity extends BaseUserSettingsEntity {
  @Column({ default: 'en' })
  language: string;
  
  @Column({ default: 'UTC' })
  timezone: string;
  
  @Column({ default: true })
  dm_enabled: boolean;
  
  @Column({ default: true })
  notifications_enabled: boolean;
  
  // ... other app-specific settings
}
```

## Index Strategy

### Composite Indexes (for performance)

- **guild_members_user_guild_idx**: `(user_id, guild_id)` - Unique constraint for user per guild
- **guild_members_guild_active_idx**: `(guild_id, is_active)` - For active members in guild
- **guild_members_roles_idx**: `(guild_id, roles)` - For role-based queries using GIN index
- **messages_guild_channel_idx**: `(guild_id, channel_id)` - For channel message queries
- **messages_author_date_idx**: `(author_id, created_at)` - For user message history
- **logs_service_level_idx**: `(service, level, created_at)` - For service-specific log queries
- **command_usage_stats_idx**: `(command_name, created_at)` - For usage analytics
- **command_usage_user_guild_idx**: `(user_id, guild_id, created_at)` - For user usage tracking

### Partial Indexes

- **active_guilds_idx**: `WHERE is_active = true` on guilds - For active guild queries
- **error_logs_idx**: `WHERE level = 'error'` on logs - For error monitoring
- **failed_commands_idx**: `WHERE success = false` on command_usage - For failure tracking

## Entity Discovery Flow

### RoboCordApp Integration

The abstract `RoboCordApp` base class handles entity discovery and registration automatically:

1. **Framework Entities**: Always included (UserEntity, GuildEntity, etc.)
2. **User Entities**: Discovered from `./src/entities/` using `utils/discovery.ts`
3. **Combined Registration**: All entities passed to DatabaseService constructor
4. **TypeORM Configuration**: DataSource created with discovered entities

### Discovery Process
```typescript
// In RoboCordApp.initializeCore()
private async discoverAllEntities(): Promise<any[]> {
  const frameworkEntities = [
    UserEntity, GuildEntity, GuildMemberEntity, 
    MessageEntity, LogEntity, CommandUsageEntity
  ];
  
  // Uses utils/discovery.ts to scan user's entities directory
  const userEntities = await discoverEntities('./src/entities');
  
  return [...frameworkEntities, ...userEntities];
}

// Entities passed to DatabaseService
this.dbService = new DatabaseService(this.config, entities);
```

### User Entity Extension Pattern
```typescript
// User extends framework base entities
@Entity('guild_settings')
export class GuildSettingsEntity extends BaseGuildSettingsEntity {
  @Column({ default: '!' })
  prefix: string;
  
  @Column({ default: true })
  welcome_enabled: boolean;
  
  // Automatically discovered and registered
}
```

## Notes

- All Discord IDs use VARCHAR(20) to accommodate snowflake IDs
- JSONB columns allow for flexible extension without schema changes
- Timestamps use TIMESTAMP for consistency
- Boolean fields have clear defaults for predictable behavior
- Indexes are strategically placed for common query patterns
- UUID primary keys for internal records, Discord IDs for Discord entities
- Entity discovery is handled automatically by RoboCordApp using framework utilities
- No manual entity registration required - follow naming conventions and place in `./src/entities/`