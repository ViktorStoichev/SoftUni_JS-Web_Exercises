import { Router } from "express";
import recipeService from "../services/recipe-service.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuth } from "../middlewares/auth-middleware.js";

const router = Router();

router.get('/create', isAuth, (req, res) => {
    res.render('recipe/create');
});

router.post('/create', isAuth, async (req, res) => {
    const recipeData = req.body;
    const userId = req.user._id;

    try {
        await recipeService.create(recipeData, userId);

        res.redirect('/');
    } catch (err) {
        const error = getErrorMessage(err);
        res.render('recipe/create', { error, recipe: recipeData });
    }
});

router.get('/', async (req, res) => {
    const recipes = await recipeService.getAll().lean();

    res.render('recipe/catalog', { recipes });
});

router.get('/search', async (req, res) => {
    const filter = req.query;
    const recipes = await recipeService.getAll(filter).lean();

    res.render('recipe/search', { recipes, filter });
});

router.get('/:recipeId/details', async (req, res) => {
    const recipeId = req.params.recipeId;
    const userId = req.user?._id;
    const recipe = await recipeService.getOne(recipeId).lean();
    const isOwner = await validateOwner(recipeId, req.user?._id);
    const isRecommended = recipe.recommendList.some(id => id == userId);

    res.render('recipe/details', { recipe, isOwner, isRecommended });
});

router.get('/:recipeId/recommend', isAuth, async (req, res) => {
    const recipeId = req.params.recipeId;
    const userId = req.user._id;

    if (await validateOwner(recipeId, req.user._id)) {
        return res.redirect('/404');
    }

    try {
        await recipeService.recommend(recipeId, userId);

        res.redirect(`/recipes/${recipeId}/details`);
    } catch (err) {
        console.log(err);
    }
});

router.get('/:recipeId/delete', isAuth, async (req, res) => {
    const recipeId = req.params.recipeId;

    if (!await validateOwner(recipeId, req.user._id)) {
        return res.redirect('/404');
    }

    try {
        await recipeService.delete(recipeId);

        res.redirect('/recipes');
    } catch (err) {
        console.log(err);
    }
});

router.get('/:recipeId/edit', isAuth, async (req, res) => {
    const recipeId = req.params.recipeId;
    const recipe = await recipeService.getOne(recipeId).lean();

    if (!await validateOwner(recipeId, req.user._id)) {
        return res.redirect('/404');
    }

    res.render('recipe/edit', { recipe });
});

router.post('/:recipeId/edit', isAuth, async (req, res) => {
    const recipeId = req.params.recipeId;
    const recipeData = req.body;

    if (!await validateOwner(recipeId, req.user._id)) {
        return res.redirect('/404');
    }

    try {
        await recipeService.edit(recipeId, recipeData);

        res.redirect(`/recipes/${recipeId}/details`);
    } catch (err) {
        const error = getErrorMessage(err);
        res.render('recipe/edit', { recipe: recipeData, error });
    }
});

async function validateOwner(recipeId, userId) {
    const recipe = await recipeService.getOne(recipeId).lean();
    const isOwner = recipe.owner == userId;

    return isOwner;
}

export const recipeController = router;