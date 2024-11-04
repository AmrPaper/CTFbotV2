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
        msg.reply("New user registered successfully!");
    } else {
        msg.reply("User already exists. No changes were made.");
    }
}

async function leave(msg) {
    const userExists = await checkUsers(msg.author.id);
    if (userExists) {
        await userProgressSchema.deleteOne({_id: msg.author.id});
        const role = await msg.guild.roles.cache.find((role) => role.name === "ctf");
        
        if (role) {
            try {
                const member = await msg.guild.members.fetch(msg.author.id);
                await member.roles.remove(role);
                console.log(`${msg.author.globalName} has left the ctf!`);
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        }
        msg.reply("User removed successfully. Sorry to see you go 👋.")
    } else {
        msg.reply("User does not exist. No changes were made.")
    }
}

async function remove(msg, args) {
    if (msg.author.id === process.env.Paper_ID) {
        let id = args[0].match(/\d+/)[0];
        const userExists = await checkUsers(id);

        if (userExists) {
            await userProgressSchema.deleteOne({_id: id});
            const role = await msg.guild.roles.cache.find((role) => role.name === "ctf");
        
            if (role) {
                try {
                    const member = await msg.guild.members.fetch(msg.author.id);
                    await member.roles.remove(role);
                    console.log(`${msg.author.globalName} has been removed from the ctf!`);
                } catch (error) {
                    console.log(`Error: ${error}`);
                }
            }
            msg.reply("User removed successfully.");
        } else {
            msg.reply("User does not exist. No changes were made.");
        }
    } else {
        msg.reply("You do not have the permission to perform this operation.");
    }
}

export {join, reset, leave, remove};