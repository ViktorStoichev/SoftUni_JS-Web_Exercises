import { Router } from "express";
import stoneService from "../services/stone-service.js";

const router = Router();

router.get('/', async (req, res) => {
    const lastThree = await stoneService.getLastThree().lean();

    res.render('home', { title: 'Home Page', stones: lastThree.reverse() });
});

export const homeController = router;
