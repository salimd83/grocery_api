module.exports = catCollection => {
    return {
        async get() {
            return await catCollection.find().toArray();
        },
        async create(cat) {
            const res = await catCollection.insertOne(cat);
            return res.insertedId;
        }
    }
}