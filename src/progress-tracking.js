import mongoose from "mongoose";
import userProgressSchema from "./user-progress-schema.js";
import { config } from "dotenv";

const flags = {"phase 1": "bruh", "phase 2": "daz", "phase 3": "sus"};

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
                            try {
                                const updatePhase = {};
                                updatePhase[stage] = true;

                                await userProgressSchema.findOneAndUpdate({
                                    _id: msg.author.id
                                },
                                updatePhase,
                                {
                                    upsert: true
                                });
                            } catch (error) {
                                console.log(`Error: ${error}`);
                            };
                            msg.reply(`You've submitted the correct flag for ${stage}`);
                            return;
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

export { submitFlag };