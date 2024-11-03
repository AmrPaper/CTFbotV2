import {mongoose} from "mongoose";
import userProgressSchema from "./user-progress-schema.js";

async function checkUsers(id) {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await userProgressSchema.findOne({_id: id});
    return user ? true : false;
}

async function reset(msg) {
    const userExists = await checkUsers(msg.author.id);
    if (userExists) {
        await userProgressSchema.findOneAndUpdate({
            _id: msg.author.id
        }, {
            _id: msg.author.id,
            name: msg.author.globalName,
            currentPhase: 1,
        }, {
            upsert: true
        });
        
        const role = await msg.guild.roles.cache.find((role) => role.name === "ctf");
        
        if (role) {
            try {
                const member = await msg.guild.members.fetch(msg.author.id);
                await member.roles.add(role);
                console.log(`${msg.author.globalName} has joined the ctf!`);
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        }
        msg.reply("User data reset successfully!");
    } else {
        msg.reply("User does not exist. No changes were made.")
    }
}

async function join(msg) {
    const userExists = await checkUsers(msg.author.id);
    if (!userExists) {
        await userProgressSchema.create({
            _id: msg.author.id,
            name: msg.author.globalName,
            currentPhase: 1,
        });
        msg.reply("New user registered successfully!");
    } else {
        msg.reply("User already exists. No changes were made.");
    }
}

async function leave(msg) {
    const userExists = await checkUsers(msg.author.id);
    if (userExists) {
        await userProgressSchema.deleteOne({_id: msg.author.id});
        msg.reply("User removed successfully. Sorry to see you go 👋.")
    } else {
        msg.reply("User does not exist. No changes were made.")
    }
}

export {join, reset, leave};