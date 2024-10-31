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
    "phase 1": {
        type: Boolean,
        require: true
    },
    "phase 2": {
        type: Boolean,
        require: true
    },
    "phase 3": {
        type: Boolean,
        require: true
    }
});

const name = "Ctf-Users";
export default models[name] || model(name, userProgressSchema);