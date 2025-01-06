import Planets from "../models/Planets.js"


const planetsService = {
    create(planetData, userId) {
        return Planets.create({ ...planetData, owner: userId });
    },
    getAll(filter = {}) {
        const query = Planets.find();

        if (filter.name) {
            query.find({ name: { $regex: filter.name, $options: 'i' } });
        }

        if (filter.solarSystem) {
            query.find({ solarSystem: { $regex: filter.solarSystem, $options: 'i' } });
        }

        return query;
    },
    getOne(planetId) {
        return Planets.findById(planetId);
    },
    like(planetId, userId) {
        return Planets.findByIdAndUpdate(planetId, { $push: { likedList: userId } });
    },
    delete(planetId) {
        return Planets.findByIdAndDelete(planetId);
    },
    edit(planetId, planetData) {
        return Planets.findByIdAndUpdate(planetId, planetData, { runValidators: true });
    }
}

export default planetsService;