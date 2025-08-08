import { injectable } from 'tsyringe';
import type { DataSource, DataSourceOptions } from 'typeorm';
import { AppDataSource } from '../database/data-source';

@injectable()
export class DatabaseService {
    protected _dataSource: DataSource;

    constructor(options: DataSourceOptions) {
        this._dataSource = AppDataSource(options);
    }

    public async start(): Promise<void> {
        await this._dataSource.initialize();
    }

    public async stop(): Promise<void> {
        await this._dataSource.destroy();
    }

    public get dataSource(): DataSource {
        return this._dataSource;
    }
}
