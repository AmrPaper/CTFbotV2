import {Client, IntentsBitField, ActivityType} from "discord.js";
import {mongoose} from "mongoose";
import { join, reset, leave, remove, add } from "./register.js";
import { submitFlag } from "./progress-tracking.js";
import { welcome, intro, help, init } from "./commands.js";
import { phase1, phase2 } from "./challenges.js";
import { config } from "dotenv";
const prefix = "?";

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

    mongoose.connect(process.env.MONGODB_URI);
});

const commandHandlers = {
    "submit-flag": submitFlag,
    "welcome": welcome,
    "remove": remove,
    "add": add,
    "init": init,
    "intro":intro,
    "help": help,
    "join": join,
    "reset": reset,
    "leave": leave,
    "phase1": phase1,
    "phase2": phase2,
    "bloop": (msg) => {
        console.log(msg.author);
        msg.reply("User info logged!");
    },
    "blip": (msg) => {
        console.log(msg.member.roles.cache.map(r => r.name));
        msg.reply("User roles logged!");
    },
    "maktab": (msg) => {
        msg.reply("Ya5 itta makana ya5");
    },
    "daz": (msg) => {
        msg.reply("Sheeel min hinaa!!!");
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