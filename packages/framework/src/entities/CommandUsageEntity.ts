import { Column, CreateDateColumn, Entity, Generated, Index, PrimaryColumn } from 'typeorm';

@Entity('command_usage')
@Index('command_usage_stats_idx', ['commandName', 'createdAt'])
@Index('command_usage_user_guild_idx', ['userId', 'guildId', 'createdAt'])
export class CommandUsageEntity {
    @PrimaryColumn({ type: 'uuid' })
    @Generated('uuid')
    id: string;

    @Index()
    @Column({ type: 'varchar', length: 50 })
    commandName: string;

    @Index()
    @Column({ type: 'varchar', length: 20 })
    userId: string;

    @Index()
    @Column({ type: 'varchar', length: 20, nullable: true })
    guildId?: string | null;

    @Index()
    @Column({ type: 'varchar', length: 20 })
    channelId: string;

    @Index()
    @Column({ type: 'boolean', default: true })
    success: boolean;

    @Column({ type: 'integer', default: 0 })
    executionTimeMs: number;

    @Column({ type: 'text', nullable: true })
    errorMessage?: string | null;

    @Column({ type: 'jsonb', default: '{}' })
    parameters: Record<string, unknown>;

    @Column({ type: 'varchar', length: 20, default: 'reply' })
    responseType: string;

    @CreateDateColumn()
    @Index()
    createdAt: Date;
}
