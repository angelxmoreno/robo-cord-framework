import { Column, CreateDateColumn, Generated, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseUserSettingsEntity {
    @PrimaryColumn({ type: 'uuid' })
    @Generated('uuid')
    protected id: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 20 })
    protected userId: string;

    @Column({ type: 'jsonb', default: '{}' })
    protected metadata: Record<string, unknown>;

    @CreateDateColumn()
    @Index()
    protected createdAt: Date;

    @UpdateDateColumn()
    protected updatedAt: Date;
}
