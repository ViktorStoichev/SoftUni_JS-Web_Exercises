import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.render('home', { title: 'Cosmic Explorer' });
});

export const homeController = router;
