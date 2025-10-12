import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { grabPlayerDB } from "../../utils/dbUtils.js";
import { formatDuration } from "../admin/leaderboard.js";

async function playerInfo(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) {
        await interaction.reply({
            content: "This command can only be used within a server.",
            flags: MessageFlags.Ephemeral
        });
        return;
    }

    try {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const player = interaction.options.getUser("player", true);

        let fetchedPlayer = await grabPlayerDB(player.id, {populateTeam: true});
        if (!fetchedPlayer) {
            await interaction.followUp("Could not find the selected player.");
            return;
        }

        const playerInfoEmbed = new EmbedBuilder()
            .setTitle("Player Info!")
            .setDescription(`Name: ${fetchedPlayer.name}\n
                Current Phase: ${fetchedPlayer.currentPhase}\n
                Team: ${fetchedPlayer.team ? fetchedPlayer.team.name : 'Solo Player'}\n
                Playtime: ${fetchedPlayer.totalPlaytime ? formatDuration(fetchedPlayer.totalPlaytime) : 'In Progress'}`)
            .setColor("White")
            .setFooter({text: "Powered by Paper 🧻",});

        await interaction.followUp({embeds: [playerInfoEmbed]});
        return;
    } catch (error) {
        console.error(`Error occured while fetching player data:`, error);

        if (interaction.deferred) {
            await interaction.followUp("There was an error while fetching player info, please try again.");
        } else {
            await interaction.reply({
                content: "There was an error while fetching player info, please try again.",
                flags: MessageFlags.Ephemeral
            });
        }
    }
}

export default playerInfo;