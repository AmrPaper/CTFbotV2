import { EmbedBuilder }  from "discord.js";
import { checkPhase } from "./progress-tracking.js";

async function phase1(msg) {
    const challengeTxt = new EmbedBuilder()
    .setTitle("Phase 1")
    .setDescription("Lorem Ipsum")
    .setColor("#FFF9FB")
    .setFooter({text: "Powered by Paper's PC 🧻",})
    .addFields({
        name: "Data",
        value: `I've compiled all the available evidence I could get my hands on, you'll find it all here:\n
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
    .setFooter({text: "Powered by Paper's PC 🧻",})
    .addFields({
        name: "Data",
        value: `I've compiled all the available evidence I could get my hands on, you'll find it all here:\n
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
    .setFooter({text: "Powered by Paper's PC 🧻",})
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