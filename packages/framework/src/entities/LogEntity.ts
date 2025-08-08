import { Column, CreateDateColumn, Entity, Generated, Index, PrimaryColumn } from 'typeorm';

@Entity('logs')
@Index('logs_service_level_idx', ['service', 'level', 'createdAt'])
export class LogEntity {
    @PrimaryColumn({ type: 'uuid' })
    @Generated('uuid')
    id: string;

    @Index()
    @Column({ type: 'varchar', length: 10, default: 'info' })
    level: string;

    @Column({ type: 'text' })
    message: string;

    @Index()
    @Column({ type: 'varchar', length: 50, default: 'general' })
    service: string;

    @Index()
    @Column({ type: 'varchar', length: 50, default: 'general' })
    category: string;

    @Index()
    @Column({ type: 'varchar', length: 20, nullable: true })
    userId?: string | null;

    @Index()
    @Column({ type: 'varchar', length: 20, nullable: true })
    guildId?: string | null;

    @Index()
    @Column({ type: 'varchar', length: 50, nullable: true })
    commandName?: string | null;

    @Index()
    @Column({ type: 'varchar', length: 50, nullable: true })
    jobName?: string | null;

    @Column({ type: 'text', nullable: true })
    errorStack?: string | null;

    @Column({ type: 'jsonb', default: '{}' })
    metadata: Record<string, unknown>;

    @CreateDateColumn()
    @Index()
    createdAt: Date;
}
