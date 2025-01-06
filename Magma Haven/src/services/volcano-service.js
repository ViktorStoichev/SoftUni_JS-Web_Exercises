import Volcano from "../models/Volcano.js";


const volcanoService = {
    create(volcanoData, userId) {
        // Volcano model
        return Volcano.create({ ...volcanoData, owner: userId });
    },
    getAll(filter = {}) {
        const query = Volcano.find();

        if (filter.name) {
            query.find({ name: { $regex: filter.name, $options: 'i' } });
        }

        if (filter.typeVolcano) {
            query.find({ typeVolcano: filter.typeVolcano });
        }

        return query;
    },
    getOne(volcanoId) {
        return Volcano.findById(volcanoId);
    },
    vote(volcanoId, userId) {
        return Volcano.findByIdAndUpdate(volcanoId, { $push: { voteList: userId } });
    },
    remove(volcanoId) {
        return Volcano.findByIdAndDelete(volcanoId);
    },
    edit(volcanoId, volcanoData) {
        return Volcano.findByIdAndUpdate(volcanoId, volcanoData, { runValidators: true });
    }
};

export default volcanoService;