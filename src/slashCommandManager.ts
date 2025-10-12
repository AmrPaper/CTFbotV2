import { SlashCommandBuilder, REST, Routes, ChatInputCommandInteraction, Client } from "discord.js";
import { config } from "dotenv";
import initialise from "./commands/slash/initialise.js";
import registerTeam from "./commands/slash/registerTeam.js";
import addPlayer from "./commands/slash/addPlayer.js";
import forceJoin from "./commands/slash/forceJoin.js";
import forceLeave from "./commands/slash/forceLeave.js";
import removePlayer from "./commands/slash/removePlayer.js";
import deleteTeam from "./commands/slash/deleteTeam.js";
import playerInfo from "./commands/slash/playerInfo.js";

config();

const commands = [
    new SlashCommandBuilder()
        .setName("initialise")
        .setDescription("Initialises the event by setting up the Player and Organizer roles.")
        .setDefaultMemberPermissions("0")
        .toJSON(),
    
    new SlashCommandBuilder()
        .setName("register-team")
        .setDescription("Register a team in the database, also creates a role and dedicated channel for the team.")
        .setDefaultMemberPermissions("0")
        .addStringOption(option =>
            option.setName("teamname")
                .setDescription("Name of the team.")
                .setRequired(true)
                .setMaxLength(50)
                .setMinLength(2)
        )
        .addStringOption(option =>
            option.setName("color")
                .setDescription("Team's discord role color.")
                .setRequired(true)
                .addChoices(
                    { name: '🔥 Red', value: '#FF0000' },
                    { name: '🌊 Blue', value: '#0066FF' },
                    { name: '🍀 Green', value: '#00FF00' },
                    { name: '🌻 Yellow', value: '#FFFF00' },
                    { name: '🔮 Purple', value: '#9966FF' },
                    { name: '🍊 Orange', value: '#FF6600' },
                    { name: '🌸 Pink', value: '#FF69B4' },
                    { name: '🍫 Brown', value: '#8B4513' },
                    { name: '🌑 Dark Gray', value: '#404040' },
                    { name: '🎨 Custom Color (enter hex below)', value: 'CUSTOM' }
                )
        )
        .addStringOption(option =>
            option.setName("customhex")
                .setDescription("Only if you chose 'Custom Color' - enter hex code (e.g., #A3C4F3)")
                .setRequired(false)
                .setMaxLength(7)
                .setMinLength(7)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName("add-player-to-team")
        .setDescription("Adds mentioned players to a selected team.")
        .setDefaultMemberPermissions("0")
        .addRoleOption(option =>
            option.setName("team")
                .setDescription("The team you'd like to add players to.")
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName("player1")
                .setDescription("Select the first player.")
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName("player2")
                .setDescription("Select the second player.")
                .setRequired(false)
        )
        .addUserOption(option =>
            option.setName("player3")
                .setDescription("Select the third player.")
                .setRequired(false)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName("force-register-player")
        .setDescription("Registers a player selected player into the event.")
        .setDefaultMemberPermissions("0")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Target user to be registered.")
                .setRequired(true)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName("force-remove-player")
        .setDescription("Removes the mentioned player from the event.")
        .setDefaultMemberPermissions("0")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Target user to be registered.")
                .setRequired(true)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName("remove-player-from-team")
        .setDescription("Remove the mentioned player from their team.")
        .setDefaultMemberPermissions("0")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Target user to be removed.")
                .setRequired(true)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName("delete-team")
        .setDescription("Deletes the mentioned team from the event.")
        .setDefaultMemberPermissions("0")
        .addRoleOption(option =>
            option.setName("team")
                .setDescription("The role of the target team.")
                .setRequired(true)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName("player-info")
        .setDescription("Fetches information on the mentioned player.")
        .setDefaultMemberPermissions("0")
        .addUserOption(option =>
            option.setName("player")
                .setDescription("Target user who's info is to be fetched.")
                .setRequired(true)
        )
        .toJSON()
]

export async function registerSlashCommands() {
    const token = process.env.BOT_TOKEN;
    const applicationID = process.env.APPLICATION_ID;
    const guildID = process.env.GUILD_ID;

    if (!token || !applicationID) {
        console.error('Missing BOT_TOKEN or CLIENT_ID in environment variables');
        return;
    }

    const rest = new REST().setToken(token);

    try {
        console.log("Currently registering slash commands...");

        if (guildID) {
            await rest.put(
                Routes.applicationGuildCommands(applicationID, guildID),
                {body: commands}
            );
            console.log("Successfully registered guild slash commands!");
        } else {
            await rest.put(
                Routes.applicationCommands(applicationID),
                {body: commands}
            );
            console.log("Successfully register global slash commands!");
        }
    } catch (error) {
        console.error("Error during slash command registration", error);
    }
}

type slashHandler = (interaction: ChatInputCommandInteraction) => void | Promise<void>;

const slashHandlers: Record<string, slashHandler> = {
    "register-team": registerTeam,
    "add-player-to-team": addPlayer,
    "remove-player-from-team": removePlayer,
    "delete-team": deleteTeam,
    "force-register-player": forceJoin,
    "force-remove-player": forceLeave,
    "initialise": initialise,
    "player-info": playerInfo
}

export async function handleSlashCommands(interaction: ChatInputCommandInteraction): Promise<void> {
    const { commandName } = interaction;

    const handler = slashHandlers[commandName];
    if (handler) {
        handler(interaction);
    } else {
        interaction.reply("This command has not been registered under the bot's handler, please contact an admin.");
    }
}