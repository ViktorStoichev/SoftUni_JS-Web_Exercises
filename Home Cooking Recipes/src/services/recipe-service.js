import Recipes from "../models/Recipes.js"


const recipeService = {
    create(recipeData, userId) {
        return Recipes.create({ ...recipeData, owner: userId })
    },
    getAll(filter = {}) {
        const query = Recipes.find();

        if (filter.search) {
            query.find({ title: { $regex: filter.search, $options: 'i' } });
        }

        return query;
    },
    getLastThree() {
        return Recipes.find().sort({ _id: -1 }).limit(3);
    },
    getOne(recipeId) {
        return Recipes.findById(recipeId);
    },
    recommend(recipeId, userId) {
        return Recipes.findByIdAndUpdate(recipeId, { $push: { recommendList: userId } });
    },
    delete(recipeId) {
        return Recipes.findByIdAndDelete(recipeId);
    },
    edit(recipeId, recipeData) {
        return Recipes.findByIdAndUpdate(recipeId, recipeData, { runValidators: true });
    }
}

export default recipeService;