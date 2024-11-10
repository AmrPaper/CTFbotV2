import mongoose from "mongoose";
import userProgressSchema from "./user-progress-schema.js";
import { config } from "dotenv";

const flags = JSON.parse(process.env.FLAGS);

async function checkPhase(msg) {
    mongoose.connect(process.env.MONGODB_URI);
    const player = await userProgressSchema.findOne({ _id: msg.author.id});
    return player ? player.currentPhase : console.log("User not found.");
}

async function submitFlag(msg, args) {
    mongoose.connect(process.env.MONGODB_URI);
    const playerName = await msg.author.globalName;
    const usrRoles = await msg.member.roles.cache.map(r => r.name);
    const playerID = await msg.author.id;
    let phaseValid = false;

    try {
        if (usrRoles.includes("ctf" == false)) {
            msg.reply("You are not participating in the ongoing CTF, please contact Paper for assistance!");
        } else {
            if (playerName) {
                if (args.length > 0) {
                    const usrSubmission = args[0];

                    for (const [stage, flag] of Object.entries(flags)) {
                        if (flag == usrSubmission) {
                            if (playerID) {
                                let player = await userProgressSchema.findOne({ _id: playerID });
                                
                                if(player) {
                                    if (player.currentPhase > Number(stage)) {
                                        msg.reply("You've already completed this phase. Please move on to the next.");
                                        return;
                                    } else {
                                        phaseValid = player.currentPhase === Number(stage);
                                    }
                                } else {
                                    console.log("Player not found");
                                    return;
                                }
                            }
                            
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