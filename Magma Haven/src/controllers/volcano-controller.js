import { Router } from "express";
import volcanoService from "../services/volcano-service.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuth } from "../middlewares/auth-middleware.js";

const router = Router();

function getVolcanotTypeViewData({ typeVolcano }) {
    const volcanoTypes = [
        'Supervolcanoes',
        'Submarine',
        'Subglacial',
        'Mud',
        'Stratovolcanoes',
        'Shield'
    ];

    const viewData = volcanoTypes.map(type => ({
        value: type,
        label: type,
        selected: typeVolcano === type ? 'selected' : ''
    }));

    return viewData;
}

async function isVolcanoOwner(volcanoId, userId) {
    const volcano = await volcanoService.getOne(volcanoId);
    const isOwner = volcano.owner == userId;

    return isOwner;
}

router.get('/create', isAuth, (req, res) => {
    const volcanoTypes = getVolcanotTypeViewData({});

    res.render('volcano/create', { title: 'Create Page', volcanoTypes });
});

router.post('/create', isAuth, async (req, res) => {
    const volcanoData = req.body;
    const userId = req.user._id;

    try {
        await volcanoService.create(volcanoData, userId);

        res.redirect('/volcanoes');
    } catch (err) {
        const error = getErrorMessage(err);
        const volcanoTypes = getVolcanotTypeViewData(volcanoData);

        return res.render('volcano/create', { title: 'Create Page', error, volcano: volcanoData, volcanoTypes });
    }
});

router.get('/', async (req, res) => {
    const volcanoes = await volcanoService.getAll().lean();

    res.render('volcano', { title: 'Catalog Page', volcanoes });
});

router.get('/search', async (req, res) => {
    const query = req.query;
    const volcanoes = await volcanoService.getAll(query).lean();
    const volcanoTypes = getVolcanotTypeViewData(query);

    res.render('volcano/search', { title: 'Search', volcanoes, query, volcanoTypes });
});

router.get('/:volcanoId/details', async (req, res) => {
    const volcano = await volcanoService.getOne(req.params.volcanoId).lean();
    const isOwner = volcano.owner == req.user?._id;
    const isVoted = volcano.voteList?.some(userId => userId == req.user?._id);
    const voteCount = volcano.voteList?.length || 0;
    
    res.render('volcano/details', { title: 'Details Page', volcano, isOwner, isVoted, voteCount });
});

router.get('/:volcanoId/vote', isAuth, async (req, res) => {
    const volcanoId = req.params.volcanoId;
    const userId = req.user?._id;

    if (isVolcanoOwner(volcanoId, userId)) {
        return res.redirect('/404');
    }
    
    try {
        await volcanoService.vote(volcanoId, userId);

        res.redirect(`/volcanoes/${volcanoId}/details`);
    } catch (err) {
        // Add error handling
        console.log(err);
    }
});

router.get('/:volcanoId/delete', isAuth, async (req, res) => {
    if (!isVolcanoOwner(req.params.volcanoId, req.user._id)) {
        return res.redirect('/404');
    }
    
    try {
        await volcanoService.remove(req.params.volcanoId);

        res.redirect('/volcanoes');
    } catch (err) {
        // Add error handling
        console.log(err);
    }
});

router.get('/:volcanoId/edit', isAuth, async (req, res) => {
    if (!isVolcanoOwner(req.params.volcanoId, req.user._id)) {
        return res.redirect('/404');
    }

    const volcano = await volcanoService.getOne(req.params.volcanoId).lean();
    const volcanoTypes = getVolcanotTypeViewData(volcano);

    res.render('volcano/edit', { title: 'Edit Page', volcano, volcanoTypes });
});

router.post('/:volcanoId/edit', isAuth, async (req, res) => {
    const volcanoData = req.body;
    const volcanoId = req.params.volcanoId;

    if (!isVolcanoOwner(volcanoId, req.user._id)) {
        return res.redirect('/404');
    }

    try {
        await volcanoService.edit(volcanoId, volcanoData);

        res.redirect(`/volcanoes/${volcanoId}/details`);
    } catch (err) {
        const volcanoTypes = getVolcanotTypeViewData(volcanoData);
        // Add error handling
        const error = getErrorMessage(err);
        res.render('volcano/edit', { title: 'Edit Page', volcano: volcanoData, volcanoTypes, error });
    }
});

export const volcanoController = router;