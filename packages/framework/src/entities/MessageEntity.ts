import { Check, Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('messages')
@Index('messages_guild_channel_idx', ['guildId', 'channelId'])
@Index('messages_author_date_idx', ['authorId', 'sentAt'])
@Index('messages_channel_timeline_idx', ['channelId', 'sentAt'])
@Index('messages_pinned_partial_idx', ['channelId'], { where: 'is_pinned = true' })
@Index('messages_edited_partial_idx', ['channelId', 'sentAt'], { where: 'is_edited = true' })
@Check(
    'positive_counts_check',
    'embed_count >= 0 AND attachment_count >= 0 AND mention_count >= 0 AND reaction_count >= 0'
)
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

    @Column({ type: 'boolean', default: false })
    isPinned: boolean;

    @Column({ type: 'boolean', default: false })
    isTts: boolean;

    @Column({ type: 'boolean', default: false })
    isEdited: boolean;

    @Index()
    @Column({ type: 'timestamptz', nullable: true })
    editedAt?: Date | null;

    @Index()
    @Column({ type: 'timestamptz', nullable: true })
    deletedAt?: Date | null;

    @Index()
    @Column({ type: 'timestamptz' })
    sentAt: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    @Index()
    createdAt: Date;
}
