const ObjectId = require("mongodb").ObjectID;

module.exports = (catCollection) => {
  return {
    async all() {
      return await catCollection.find().toArray();
    },
    async top() {
      return await catCollection
        .find({
          parent: { $exists: false },
        })
        .toArray();
    },
    async children(id) {
      const children = await catCollection
        .find({
          parent: id,
        })
        .toArray();
      const parent = await catCollection.findOne({
        _id: ObjectId(id),
      });
      return {
        ...parent,
        children,
      };
    },
    async create(cat) {
      const res = await catCollection.insertOne(cat);
      return res.insertedId;
    },
    async update(id, cat) {
      return await catCollection.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          $set: { name: cat.name },
          $currentDate: { lastModified: true },
        }
      );
    },
    async delete(id) {
      return await catCollection.deleteOne({
        _id: ObjectId(id),
      });
    },
  };
};
