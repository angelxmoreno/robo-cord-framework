import { Column, CreateDateColumn, Entity, Generated, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('guild_members')
@Index('guild_members_user_guild_idx', ['userId', 'guildId'], { unique: true })
@Index('guild_members_guild_active_idx', ['guildId', 'isActive'])
export class GuildMemberEntity {
    @PrimaryColumn({ type: 'uuid' })
    @Generated('uuid')
    id: string;

    @Index()
    @Column({ type: 'varchar', length: 20 })
    userId: string;

    @Index()
    @Column({ type: 'varchar', length: 20 })
    guildId: string;

    @Index()
    @Column({ type: 'varchar', length: 32, nullable: true })
    nickname?: string | null;

    @Index()
    @Column({ type: 'timestamptz' })
    joinedAt: Date;

    @Column({ type: 'timestamptz', nullable: true })
    leftAt?: Date | null;

    @Index()
    @Column({ type: 'boolean', default: false })
    isOwner: boolean;

    @Index()
    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
    roles: string[];

    @Column({ type: 'timestamptz', nullable: true })
    boostSince?: Date | null;

    @Index()
    @Column({ type: 'timestamptz', nullable: true })
    timeoutUntil?: Date | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    avatarHash?: string | null;

    @Column({ type: 'text', nullable: true })
    avatarUrl?: string | null;

    @Index()
    @Column({ type: 'varchar', length: 20, nullable: true })
    voiceChannelId?: string | null;

    @Column({ type: 'timestamptz', nullable: true })
    voiceJoinedAt?: Date | null;

    @CreateDateColumn({ type: 'timestamptz' })
    @Index()
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
