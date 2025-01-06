import { Router } from "express";
import planetsService from "../services/planets-service.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuth } from "../middlewares/auth-middleware.js";

const router = Router();

function getPlanetTypesViewData({ type }) {
    const planetTypes = ['---', 'Inner', 'Outer', 'Dwarf'];

    const viewData = planetTypes.map(currentType => ({
        value: currentType,
        selected: type === currentType ? 'selected' : ''
    }));

    return viewData;
}

function getRingsViewData({ rings }) {
    const ringsOptions = ['---', 'Yes', 'No'];

    const viewData = ringsOptions.map(option => ({
        value: option,
        selected: rings === option ? 'selected' : ''
    }));

    return viewData;
}

async function validateOwner(planetId, userId) {
    const planet = await planetsService.getOne(planetId);
    const isOwner = planet.owner == userId;

    return isOwner;
}

router.get('/create', isAuth, (req, res) => {
    const planetTypes = getPlanetTypesViewData({});
    const ringsOptions = getRingsViewData({});

    res.render('planet/create', { title: 'Add New Planet', planetTypes, ringsOptions });
});

router.post('/create', isAuth, async (req, res) => {
    const planetData = req.body;
    const userId = req.user._id;

    try {
        await planetsService.create(planetData, userId);

        res.redirect('/planets');
    } catch (err) {
        const error = getErrorMessage(err);
        const planetTypes = getPlanetTypesViewData(planetData);
        const ringsOptions = getRingsViewData(planetData);

        res.render('planet/create', { title: 'Add New Planet', error, planet: planetData, planetTypes, ringsOptions });
    }
});

router.get('/', async (req, res) => {
    const planets = await planetsService.getAll().lean();

    res.render('planet/catalog', { title: 'Planet Catalog', planets });
});

router.get('/search', async (req, res) => {
    const filter = req.query;
    const planets = await planetsService.getAll(filter).lean();

    res.render('planet/search', { title: 'Planet Search', filter, planets });
});

router.get('/:planetId/details', async (req, res) => {
    const planetId = req.params.planetId;
    const userId = req.user?._id;
    const planet = await planetsService.getOne(planetId).lean();
    const isOwner = await validateOwner(planetId, userId);
    const isLiked = planet.likedList.some(id => id == userId);

    res.render('planet/details', { title: 'Planet Details', planet, isOwner, isLiked });
});

router.get('/:planetId/like', isAuth, async (req, res) => {
    const planetId = req.params.planetId;
    const userId = req.user._id;

    if (await validateOwner(planetId, userId)) {
        return res.redirect('/404');
    }

    await planetsService.like(planetId, userId);

    res.redirect(`/planets/${planetId}/details`);
});

router.get('/:planetId/delete', isAuth, async (req, res) => {
    const planetId = req.params.planetId;
    const userId = req.user._id

    if (!await validateOwner(planetId, userId)) {
        return res.redirect('/404');
    }

    await planetsService.delete(planetId);

    res.redirect('/planets');
});

router.get('/:planetId/edit', isAuth, async (req, res) => {
    const planetId = req.params.planetId;
    const userId = req.user._id;
    const planet = await planetsService.getOne(planetId).lean();
    const planetTypes = getPlanetTypesViewData(planet);
    const ringsOptions = getRingsViewData(planet);

    if (!await validateOwner(planetId, userId)) {
        return res.redirect('/404');
    }

    res.render('planet/edit', { title: 'Edit Planet', planet, planetTypes, ringsOptions });
});

router.post('/:planetId/edit', isAuth, async (req, res) => {
    const planetData = req.body;
    const planetId = req.params.planetId;
    const userId = req.user._id;

    if (!await validateOwner(planetId, userId)) {
        return res.redirect('/404');
    }

    try {
        await planetsService.edit(planetId, planetData);

        res.redirect(`/planets/${planetId}/details`);
    } catch (err) {
        const error = getErrorMessage(err);
        const planetTypes = getPlanetTypesViewData(planetData);
        const ringsOptions = getRingsViewData(planetData);

        res.render('planet/edit', { title: 'Edit Planet', error, planet: planetData, planetTypes, ringsOptions });
    }
});

export const planetsController = router;