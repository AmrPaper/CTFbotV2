import { EmbedBuilder, Message } from "discord.js";
import { Fields } from "../../utils/jsonTypes.js";
import { Player } from "../../models/Player.js";
import { Team } from "../../models/Team.js";

async function leaderboard(msg: Message): Promise<void> {
    if (!msg.guild) {return console.log("Invalid Operation, no dms");}
        
    const user = await msg.guild.members.fetch(msg.author.id);
    if (!user.permissions.has("Administrator")) {
        msg.reply("You do not have the permission to update the event's state.");
        return console.log(`User ${user.displayName} does not have permission to use the Unlock command.`);
    }

    const limit = 5;

    try {
        const fields: Fields = [];
        const soloPlayers = await Player.find({team: null}).select("name currentPhase phaseStartTime totalPlaytime").lean();
        const teams = await Team.find().select("name currentPhase phaseStartTime totalPlaytime").lean();

        const allEntries = [
            ...soloPlayers.map(player => ({
                id: player._id,
                name: player.name,
                type: "solo",
                phase: player.currentPhase,
                time: player.totalPlaytime,
                formattedTime: player.totalPlaytime ? formatDuration(player.totalPlaytime) : 'In Progress'
            })),
            ...teams.map(team => ({
                id: team._id,
                name: team.name,
                type: "team",
                phase: team.currentPhase,
                time: team.totalPlaytime,
                formattedTime: team.totalPlaytime ? formatDuration(team.totalPlaytime) : 'In Progress',
            }))
        ];

        allEntries.sort((a, b) => {
            if (a.phase !== b.phase) {
                return b.phase - a.phase;
            }

            if (a.time === null) return 1;
            if (b.time === null) return -1;

            return a.time - b.time;
        });

        const ranked = allEntries.slice(0, limit).map((entry, index) => ({
            ...entry,
            rank: index + 1
        }));

        ranked.forEach((entry) => {
            fields.push({
                "name": `Rank ${entry.rank}`,
                "value": `Name: ${entry.name}\nType: ${entry.type}\nPhase: ${entry.phase}\nTime: ${entry.formattedTime}`,
                inline: false
            })
        });

        const leaderboardEmbed = new EmbedBuilder()
            .setTitle("Leaderboard")
            .setDescription("A list of the top 5 players/teams!")
            .setColor("#0099ff")
            .setFooter({text: "Powered by Paper 🧻",})
            .addFields(
                {name: "\u200B", value: "\u200B"},// the \u200B values here are used to form a spacer between the description and the fields.
                ...fields);
    
        msg.reply({embeds: [leaderboardEmbed]});
        return;
    } catch (error) {
        msg.reply("An internal error occurred.");
        return console.error("Error occurred during leaderboard process:", error);
    }
}

export function formatDuration(durationMs: number) {
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default leaderboard;