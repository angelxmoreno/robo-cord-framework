import 'reflect-metadata';
import {
    BaseGuildSettingsEntity,
    BaseUserSettingsEntity,
    CommandUsageEntity,
    GuildEntity,
    GuildMemberEntity,
    LogEntity,
    MessageEntity,
    UserEntity,
} from '@framework/entities';
import { DataSource, type DataSourceOptions } from 'typeorm';

// All entities are exported here to be used by the framework and bot apps
// This is also where the bot apps will add their own entities
export const AllEntities = [
    CommandUsageEntity,
    GuildEntity,
    GuildMemberEntity,
    LogEntity,
    MessageEntity,
    UserEntity,
    BaseGuildSettingsEntity,
    BaseUserSettingsEntity,
];

export const AppDataSource = (options: DataSourceOptions) => {
    return new DataSource({
        ...options,
        entities: AllEntities,
    });
};
