import { Schema, model, Types } from "mongoose";

const planetsSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: [2, 'The Name should be at least 2 characters']
    },
    age: {
        type: Number,
        required: true,
        min: [0, 'The Age should be a positive number']
    },
    solarSystem: {
        type: String,
        required: true,
        minLength: [2, 'The Solar System should be at least 2 characters']
    },
    type: {
        type: String,
        required: true,
        enum: {
            values: ['Inner', 'Outer', 'Dwarf'],
            message: 'The Type should be one of the options Inner, Outer, Dwarf'
        }
    },
    moons: {
        type: Number,
        required: true,
        min: [0, 'The Size should be a positive number']
    },
    size: {
        type: Number,
        required: true,
        min: [0, 'The Moons should be a positive number']
    },
    rings: {
        type: String,
        required: true,
        enum: {
            values: ['Yes', 'No'],
            message: 'The Rings should be one of the options Yes, No'
        }
    },
    description: {
        type: String,
        required: true,
        minLength: [10, 'The Description should be between 10 and 100 characters long'],
        maxLength: [100, 'The Description should be between 10 and 100 characters long']
    },
    image: {
        type: String,
        required: true,
        validate: [/^https?:\/\//, 'The Image should start with http:// or https://']
    },
    likedList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

const Planets = model('Planets', planetsSchema);

export default Planets;