import mongoose from "mongoose";
import userProgressSchema from "./user-progress-schema.js";
import { config } from "dotenv";
config();
const prefix = "$";

const flags = {"1": process.env.FLAG1, "2":process.env.FLAG2};

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
        if (!usrRoles.includes("ctf")) {
            msg.reply("You are not participating in the ongoing CTF, please contact Paper for assistance!");
        } else {
            if (playerName) {
                if (args.length > 0) {
                    const usrSubmission = msg.content.slice(prefix.length + args[0].length).trim();

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
                                msg.channel.send(`You've submitted the correct flag for phase ${stage}! Good Job!`);
                                try {
                                    msg.delete();
                                    console.log("Message successfully deleted!");
                                } catch (error) {
                                    console.log(error);
                                }
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