import { Router } from "express";
import stoneService from "../services/stone-service.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuth } from "../middlewares/auth-middleware.js";

const router = Router();

router.get('/create', isAuth, (req, res) => {
    res.render('stone/create', { title: 'Create Page' });
});

router.post('/create', isAuth, async (req, res) => {
    const stoneData = req.body;
    const userId = req.user._id;

    try {
        await stoneService.create(stoneData, userId);

        res.redirect('/stones');
    } catch (err) {
        const error = getErrorMessage(err);
        res.render('stone/create', { title: 'Create Page', error, stone: stoneData })
    }
});

router.get('/', async (req, res) => {
    const stones = await stoneService.getAll().lean();

    res.render('stone/dashboard', { title: 'Dashboard Page', stones });
});

router.get('/search', async (req, res) => {
    const filter = req.query;
    const stones = await stoneService.getAll(filter).lean();

    res.render('stone/search', { title: 'Search Page', stones, filter })
});

router.get('/:stoneId/details', async (req, res) => {
    const stoneId = req.params.stoneId;
    const stone = await stoneService.getOne(stoneId).lean();
    const userId = req.user?._id;
    const isOwner = await validateOwner(stoneId, userId);
    const isLiked = stone.likedList.some(id => id == userId);

    res.render('stone/details', { title: 'Details Page', stone, isOwner, isLiked });
});

router.get('/:stoneId/like', isAuth, async (req, res) => {
    const stoneId = req.params.stoneId;
    const userId = req.user._id;

    if (await validateOwner(stoneId, userId)) {
        return res.redirect('/404');
    }
    
    try {
        await stoneService.like(stoneId, userId);

        res.redirect(`/stones/${stoneId}/details`);
    } catch (err) {
        console.log(err);
    }
});

router.get('/:stoneId/delete', isAuth, async (req, res) => {
    const stoneId = req.params.stoneId;
    const userId = req.user._id;

    if (!await validateOwner(stoneId, userId)) {
        return res.redirect('/404');
    }

    try {
        await stoneService.delete(stoneId);

        res.redirect('/stones');
    } catch (err) {
        console.log(err);
    }
});

router.get('/:stoneId/edit', isAuth, async (req, res) => {
    const stoneId = req.params.stoneId;
    const userId = req.user._id;
    const stone = await stoneService.getOne(stoneId).lean();
    
    if (!await validateOwner(stoneId, userId)) {
        return res.redirect('/404');
    }
    
    res.render('stone/edit', { title: 'Edit Page', stone });
});

router.post('/:stoneId/edit', isAuth, async (req, res) => {
    const stoneId = req.params.stoneId;
    const userId = req.user._id;
    const stoneData = req.body;

    if (!await validateOwner(stoneId, userId)) {
        return res.redirect('/404');
    }

    try {
        await stoneService.edit(stoneId, stoneData);

        res.redirect(`/stones/${stoneId}/details`);
    } catch (err) {
        const error = getErrorMessage(err);
        res.render('stone/edit', { title: 'Edit Page', stone: stoneData, error });
    }
});

async function validateOwner(stoneId, userId) {
    const stone = await stoneService.getOne(stoneId);
    const isOwner = stone.owner == userId;

    return isOwner;
}

export const stoneController = router;