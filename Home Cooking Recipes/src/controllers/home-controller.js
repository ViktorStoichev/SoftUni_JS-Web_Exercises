import { Router } from "express";
import recipeService from "../services/recipe-service.js";

const router = Router();

router.get('/', async (req, res) => {
    const lastThree =  await recipeService.getLastThree().lean();

    res.render('home', { recipes: lastThree.reverse() });
});

export const homeController = router;
