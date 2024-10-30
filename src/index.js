import {Client, IntentsBitField, ActivityType} from "discord.js";
import { config } from "dotenv";
const prefix = "!";

config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on("ready", (c) => {
    console.log(`${c.user.tag} is now online ya zoooool!`);
    client.user.setActivity({
        name: "الليلة بالليل 🌙",
        type: ActivityType.Listening,
    });
});

const commandHandlers = {
    "bloop": (msg) => {
        console.log(msg.author);
        msg.reply("User info logged!");
    },
    "blip": (msg) => {
        console.log(msg.member.roles.cache.map(r => r.name));
        msg.reply("User roles logged!");
    },
};

//running different commands depending on the user's input
function messageHandling(msg) {
    if (msg.author.bot || !msg.content.startsWith(prefix)) return; //ignore bot messages and user messages that don't start with "!"

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    const handler = commandHandlers[cmd];
    if (handler) {
        handler(msg, args);
    } else {
        msg.reply("Unknown command. Type !help for a list of commands.");
    };
};

(async () => {
    try {
        client.on("messageCreate", messageHandling);
        client.login(process.env.BOT_TOKEN);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();