import { Schema, model, Types } from "mongoose";

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: [2, 'The Title should be at least 2 characters']
    },
    ingredients: {
        type: String,
        required: true,
        minLength: [10, 'The Description should be between 10 and 100 characters long'],
        maxLength: [100, 'The Description should be between 10 and 100 characters long']
    },
    instructions: {
        type: String,
        required: true,
        minLength: [10, 'The Ingredients should be between 10 and 200 characters long'],
        maxLength: [200, 'The Ingredients should be between 10 and 200 characters long']
    },
    description: {
        type: String,
        required: true,
        minLength: [10, 'The Instuctions should be at least 10 characters long']
    },
    image: {
        type: String,
        required: true,
        validate: [/^https?:\/\//, 'The Image should start with http:// or https://']
    },
    recommendList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

const Recipes = model('Recipes', recipeSchema);

export default Recipes;