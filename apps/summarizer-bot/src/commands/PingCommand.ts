import { BaseSlashCommand } from '@robo-cord/framework';
import { ApplicationIntegrationType, type ChatInputCommandInteraction, InteractionContextType } from 'discord.js';

export class PingCommand extends BaseSlashCommand {
    readonly description = 'Replies with Pong! - A simple test command';
    // Name auto-derived from class name: 'PingCommand' → 'ping'

    // Allow in all contexts (guilds, DMs, group DMs)
    override readonly contexts = [
        InteractionContextType.Guild,
        InteractionContextType.BotDM,
        InteractionContextType.PrivateChannel,
    ];

    // Available for both guild and user installations
    override readonly integrationTypes = [
        ApplicationIntegrationType.GuildInstall,
        ApplicationIntegrationType.UserInstall,
    ];

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        this.logger.info(`Ping command executed by ${interaction.user.tag}`);

        await interaction.reply({
            content: '🏓 Pong!',
            ephemeral: true,
        });
    }
}
