import { Schema, model, Types } from "mongoose";

const stonesSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: [2, 'The Name should be at least 2 characters']
    },
    category: {
        type: String,
        required: true,
        minLength: [3, 'The Category should be at least 3 characters']
    },
    color: {
        type: String,
        required: true,
        minLength: [2, 'The Color should be at least 2 characters']
    },
    image: {
        type: String,
        required: true,
        validate: [/^https?:\/\//, 'The Stone Image should start with http:// or https://']
    },
    location: {
        type: String,
        required: true,
        minLength: [5, 'The Location should be between 5 and 15 characters'],
        maxLength: [15, 'The Location should be between 5 and 15 characters']
    },
    formula: {
        type: String,
        required: true,
        minLength: [3, 'The Formula should be between 3 and 30 characters'],
        maxLength: [30, 'The Formula should be between 3 and 30 characters']
    },
    description: {
        type: String,
        required: true,
        minLength: [10, 'The Description should be a minimum of 10 characters long']
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

const Stones = model('Stones', stonesSchema);

export default Stones;