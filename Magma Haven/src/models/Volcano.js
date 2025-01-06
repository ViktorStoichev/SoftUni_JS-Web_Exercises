import { Schema, model, Types } from "mongoose";

const volcanoSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 2
    },
    location: {
        type: String,
        required: true,
        minLength: 3
    },
    elevation: {
        type: Number,
        required: true,
        min: 0
    },
    lastEruption: {
        type: Number,
        required: true,
        min: 0,
        max: 2024
    },
    image: {
        type: String,
        required: true,
        validate: /^https?:\/\//
    },
    typeVolcano: {
        type: String,
        required: true,
        enum: ['Supervolcanoes', 'Submarine', 'Subglacial', 'Mud', 'Stratovolcanoes', 'Shield'] 
    },
    description: {
        type: String,
        required: true,
        minLength: 10
    },
    voteList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

const Volcano = model('Volcano', volcanoSchema);

export default Volcano;