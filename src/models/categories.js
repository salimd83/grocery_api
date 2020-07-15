const ObjectId = require("mongodb").ObjectID;

module.exports = (db) => {
  const cl = createCategoryCollection(db);
  return {
    collection: cl,
    async all() {
      return await cl.find().toArray();
    },
    async top() {
      return await cl
        .find({
          parent: { $exists: false },
        })
        .toArray();
    },
    async children(id) {
      const children = await cl
        .find({
          parent: id,
        })
        .toArray();
      const parent = await cl.findOne({
        _id: ObjectId(id),
      });
      return {
        ...parent,
        children,
      };
    },
    async create(cat) {
      const res = await cl.insertOne(cat);
      return res.insertedId;
    },
    async update(id, cat) {
      return await cl.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          $set: { name: cat.name },
          $currentDate: { lastModified: true },
        }
      );
    },
    async addImage(id, image) {
      return await cl.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          $set: { image },
          $currentDate: { lastModified: true },
        }
      );
    },
    async deleteImage(id) {
      return await cl.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          $unset: { image: "" },
          $currentDate: { lastModified: true },
        }
      );
    },
    async delete(id) {
      return await cl.deleteOne({
        _id: ObjectId(id),
      });
    },
  };
};

function createCategoryCollection(db) {
  return db.collection('categories')
}