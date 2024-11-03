import pkg from "mongoose";
const { Schema, model, models} = pkg; 

const userProgressSchema = new Schema({
    _id: {
        //Stores the discord user's ID
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    currentPhase: {
        type: Number,
        default: 1,
        require: true
    }
});

const name = "Ctf-Users";
export default models[name] || model(name, userProgressSchema);