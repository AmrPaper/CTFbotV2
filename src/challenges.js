import { EmbedBuilder }  from "discord.js";
import { checkPhase } from "./progress-tracking.js";

async function phase1(msg) {
    const challengeTxt = new EmbedBuilder()
    .setTitle("Phase 1")
    .setDescription("Room Investigation")
    .setColor("#FFF9FB")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "Data",
        value: `You've interviewed a few of the people on the same floor, and have looked through Etti's room, here's a list of everything you've managed to get your hands on:\n
        -Notebook Scans of pages from a notebook left open on Etti's desk.\n
        -Flash Drive containing a zip file\n
        -Text scan of a letter found under Etti's bed\n
        -Picture of a sticky note found under Etti's keyboard\n
        -Interview Transcripts\n
        You'll find the files in the google drive link below:\n
        ${process.env.PHASE_1_FILES}`
    },);

    const phase = await checkPhase(msg);
    if (phase) {
        if (phase >= 1) {
            msg.channel.send({embeds: [challengeTxt]});
        } else {
            msg.reply("You are not yet eligible to enter this phase.");
        }
    };
};

async function phase2(msg) {
    const challengeTxt = new EmbedBuilder()
    .setTitle("Phase 2")
    .setDescription("Lorem Ipsum")
    .setColor("#D3D4D9")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "Data",
        value: `After all of your picking and prodding around Etti's room, and uncovering the project she's been working on, it seems you've caught the attention of someone who seems to be a friend of Etti's, an individual who goes by the name Olive. Olive sent you message with a folder attached, I wonder what it might contain.\n
        You'll find the files in the google drive link below:\n
        ${process.env.PHASE_2_FILES}`
    },);

    const phase = await checkPhase(msg);
    if (phase) {
        if (phase >= 2) {
            msg.channel.send({embeds: [challengeTxt]});
        } else {
            msg.reply("You are not yet eligible to enter this phase.");
        }
    };
};

async function phase3(msg) {
    const challengeTxt = new EmbedBuilder()
    .setTitle("Phase 3")
    .setDescription("Lorem Ipsum")
    .setColor("#4B88A2")
    .setFooter({text: "Powered by Paper 🧻",})
    .addFields({
        name: "Data",
        value: `I've compiled all the available evidence I could get my hands on, you'll find it all here:\n
        ${process.env.PHASE_3_FILES}`
    },);

    const phase = await checkPhase(msg);
    if (phase) {
        if (phase >= 3) {
            msg.channel.send({embeds: [challengeTxt]});
        } else {
            msg.reply("You are not yet eligible to enter this phase.");
        }
    };
};

export { phase1, phase2, phase3 };