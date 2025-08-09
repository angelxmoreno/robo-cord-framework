import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('guilds')
export class GuildEntity {
    @PrimaryColumn({ type: 'varchar', length: 20 })
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    iconHash?: string | null;

    @Column({ type: 'text', nullable: true })
    iconUrl?: string | null;

    @Column({ type: 'varchar', length: 20 })
    ownerId: string;

    @Column({ type: 'integer', default: 0 })
    memberCount: number;

    @Column({ type: 'boolean', default: false })
    isLarge: boolean;

    @Column({ type: 'integer', default: 0 })
    verificationLevel: number;

    @Column({ type: 'timestamptz' })
    joinedAt: Date;

    @Column({ type: 'timestamptz', nullable: true })
    leftAt?: Date | null;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
