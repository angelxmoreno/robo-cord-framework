import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('messages')
@Index('messages_guild_channel_idx', ['guildId', 'channelId'])
@Index('messages_author_date_idx', ['authorId', 'createdAt'])
export class MessageEntity {
    @PrimaryColumn({ type: 'varchar', length: 20 })
    id: string;

    @Index()
    @Column({ type: 'varchar', length: 20 })
    channelId: string;

    @Index()
    @Column({ type: 'varchar', length: 20, nullable: true })
    guildId?: string | null;

    @Index()
    @Column({ type: 'varchar', length: 20 })
    authorId: string;

    @Column({ type: 'text', default: '' })
    content: string;

    @Column({ type: 'text', default: '' })
    cleanContent: string;

    @Column({ type: 'integer', default: 0 })
    embedCount: number;

    @Column({ type: 'integer', default: 0 })
    attachmentCount: number;

    @Column({ type: 'integer', default: 0 })
    mentionCount: number;

    @Column({ type: 'integer', default: 0 })
    reactionCount: number;

    @Index()
    @Column({ type: 'boolean', default: false })
    isPinned: boolean;

    @Column({ type: 'boolean', default: false })
    isTts: boolean;

    @Index()
    @Column({ type: 'boolean', default: false })
    isEdited: boolean;

    @Index()
    @Column({ type: 'timestamp', nullable: true })
    editedAt?: Date | null;

    @Index()
    @Column({ type: 'timestamp', nullable: true })
    deletedAt?: Date | null;

    @Index()
    @Column({ type: 'timestamp' })
    sentAt: Date;

    @CreateDateColumn()
    @Index()
    createdAt: Date;
}
