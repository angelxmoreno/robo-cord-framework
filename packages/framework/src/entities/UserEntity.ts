import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryColumn({ type: 'varchar', length: 20 })
    id: string;

    @Column({ type: 'varchar', length: 32 })
    username: string;

    @Column({ type: 'varchar', length: 32, nullable: true })
    globalName?: string | null;

    @Column({ type: 'varchar', length: 4, nullable: true })
    discriminator?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    avatarHash?: string | null;

    @Column({ type: 'text', nullable: true })
    avatarUrl?: string | null;

    @Column({ type: 'boolean', default: false })
    isBot: boolean;

    @Column({ type: 'boolean', default: false })
    isSystem: boolean;

    @Column({ type: 'integer', default: 0 })
    publicFlags: number;

    @Column({ type: 'timestamp', nullable: true })
    accountCreatedAt?: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    lastSeenAt?: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
