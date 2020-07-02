const objectId = require('mongodb').ObjectID;

module.exports = catCollection => {
    return {
        async get() {
            return await catCollection.find().toArray();
        },
        async create(cat) {
            const res = await catCollection.insertOne(cat);
            return res.insertedId;
        },
        async update(id, cat) {
            return await catCollection.updateOne({
                _id: objectId(id)
            },
            {
                $set: { name: cat.name },
                $currentDate: { lastModified: true }
            })
        },
        async delete(id) {
            return await catCollection.deleteOne({
                _id: objectId(id)
            })
        }
    }
}