import 'reflect-metadata';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { CommandUsageEntity, GuildEntity, GuildMemberEntity, LogEntity, MessageEntity, UserEntity } from '../entities';

// All entities are exported here to be used by the framework and bot apps
// Only concrete entities with @Entity decorators should be included
export const AllEntities = [CommandUsageEntity, GuildEntity, GuildMemberEntity, LogEntity, MessageEntity, UserEntity];

export const AppDataSource = (options: DataSourceOptions, entities = AllEntities) => {
    return new DataSource({
        ...options,
        entities,
    });
};
