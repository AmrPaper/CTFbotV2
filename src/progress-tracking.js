import mongoose from "mongoose";
import userProgressSchema from "./user-progress-schema.js";
import { config } from "dotenv";

const flags = {"1": "bruh", "2": "daz", "3": "sus"};
var i = 0;

async function checkPhase(msg, phase) {
    mongoose.connect(process.env.MONGODB_URI);
    const playerID = await msg.author.id;

    if (playerID) {
        let player = await userProgressSchema.findOne({ _id: playerID });
        
        if(player) {
            return player.currentPhase === Number(phase);
        } else {
            console.log("Player not found");
            return false;
        }
    }
}

async function submitFlag(msg, args) {
    mongoose.connect(process.env.MONGODB_URI);
    const player = await msg.author.globalName;
    const usrRoles = await msg.member.roles.cache.map(r => r.name);

    try {
        if (usrRoles.includes("ctf" == false)) {
            msg.reply("You are not participating in the ongoing CTF, please contact Paper for assistance!");
        } else {
            if (player) {
                if (args.length > 0) {
                    const usrSubmission = args[0];

                    for (const [stage, flag] of Object.entries(flags)) {
                        if (flag == usrSubmission) {
                            const phaseValid = await checkPhase(msg, stage)
                            if (phaseValid) {
                                try {
                                    const nextPhase = Number(stage) + 1;
                                    await userProgressSchema.findOneAndUpdate(
                                        {_id: msg.author.id },
                                        { currentPhase: nextPhase },
                                        { upsert: true }
                                    );
                                } catch (error) {
                                    console.log(`Error: ${error}`);
                                    msg.reply("There was an error updating your phase 😭. Please try again!")
                                };
                                msg.reply(`You've submitted the correct flag for phase ${stage}! Good Job!`);
                                return;
                            } else {
                                msg.reply("Seem you're trying to skip a phase, smh my head 🤦‍♂️.");
                                return;
                            }
                        }
                    }

                    msg.reply("The flag you submitted is incorrect. Try again 😉.")
                } else {msg.reply("Please submit a valid flag");}
            } else {
                msg.reply("You aren't a participating member yet, please contact Paper for assistance!");
            };
        };
    } catch (error) {
        console.log(`Error: ${error}`);
    }  
}

export { submitFlag, checkPhase };