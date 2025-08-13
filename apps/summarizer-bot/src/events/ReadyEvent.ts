import { BaseEventHandler } from '@robo-cord/framework';
import type { Client } from 'discord.js';

export class ReadyEvent extends BaseEventHandler<'ready'> {
    override readonly once = true; // Only run once when bot is ready

    async execute(client: Client<true>): Promise<void> {
        this.logger.info(`🤖 Bot is ready! Logged in as ${client.user.tag}`);
        this.logger.info(`📊 Serving ${client.guilds.cache.size} guilds with ${client.users.cache.size} users`);
    }
}
