import {
    CommandUsageEntity,
    GuildEntity,
    GuildMemberEntity,
    LogEntity,
    MessageEntity,
    UserEntity,
} from '@framework/entities';
import type { BaseConfigSchema } from '@framework/schemas';
import { injectable } from 'tsyringe';
import type { DataSource, DataSourceOptions } from 'typeorm';
import type { z } from 'zod';
import { AppDataSource } from '../database/data-source';

@injectable()
export class DatabaseService {
    protected appDataSource?: DataSource;
    protected dataSourceOptions: DataSourceOptions;

    constructor(config: z.infer<typeof BaseConfigSchema>) {
        this.dataSourceOptions = {
            type: 'postgres',
            host: config.database.host,
            port: config.database.port,
            database: config.database.database,
            username: config.database.username,
            password: config.database.password,
            synchronize: config.database.synchronize ?? config.isDevelopment,
            logging: config.database.logging ?? config.isDevelopment,
            entities: [CommandUsageEntity, GuildEntity, GuildMemberEntity, LogEntity, MessageEntity, UserEntity],
        };
    }

    protected buildAppDataSource() {
        if (!this.appDataSource) {
            this.appDataSource = AppDataSource(this.dataSourceOptions);
        }

        return this.appDataSource;
    }

    public async start(): Promise<void> {
        if (!this.dataSource.isInitialized) {
            await this.dataSource.initialize();
        }
    }

    public async stop(): Promise<void> {
        await this.dataSource.destroy();
    }

    public get dataSource(): DataSource {
        return this.buildAppDataSource();
    }
}
