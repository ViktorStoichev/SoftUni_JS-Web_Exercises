import Stones from "../models/Stones.js";


const stoneService = {
    create(stoneData, userId) {
        return Stones.create({ ...stoneData, owner: userId });
    },
    getAll(filter = {}) {
        const query = Stones.find();

        if (filter.search) {
            query.find({ name: { $regex: filter.search, $options: 'i' } });
        }

        return query;
    },
    getLastThree() {
        return Stones.find().sort({ _id: -1 }).limit(3);
    },
    getOne(stoneId) {
        return Stones.findById(stoneId)
    },
    like(stoneId, userId) {
        return Stones.findByIdAndUpdate(stoneId, { $push: { likedList: userId } });
    },
    delete(stoneId) {
        return Stones.findByIdAndDelete(stoneId);
    },
    edit(stoneId, stoneData) {
        return Stones.findByIdAndUpdate(stoneId, stoneData, { runValidators: true });
    }
};

export default stoneService;