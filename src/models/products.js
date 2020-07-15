const { ObjectID } = require("mongodb");

module.exports = (db) => {
  const cl = createProductCollection(db);

  return {
    collection: cl,
    async all() {
      return await cl
        .aggregate([
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category",
            },
          },
        ])
        .toArray();
    },
    async get(id) {
      const r = await cl
        .aggregate([
          { $match: { _id: ObjectID(id) } },
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category",
            },
          },
        ])
        .toArray();
        return r[0];
    },
    async byCategory(id) {
      return await cl
        .aggregate([
          { $match: { category_id: ObjectID(id) } },
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category",
            },
          },
        ])
        .toArray();
    },
    async create({ name, desc, spacs, category_id }) {
      const res = await cl.insertOne({
        name,
        desc,
        spacs,
        category_id: ObjectID(category_id),
      });
      return res.insertedId;
    },
    async update(id, { name, desc, spacs, category_id }) {
      return await cl.updateOne(
        {
          _id: ObjectID(id),
        },
        {
          $set: { name, desc, spacs, category_id: ObjectID(category_id) },
          $currentDate: { lastModified: true },
        }
      );
    },
    async addImage(id, images) {
      return await cl.updateOne(
        {
          _id: ObjectID(id),
        },
        {
          $push: { images },
          $currentDate: { lastModified: true },
        }
      );
    },
    async deleteImage(id, images) {
      return await cl.updateOne(
        {
          _id: ObjectID(id),
        },
        {
          $pull: { images },
          $currentDate: { lastModified: true },
        }
      );
    },
    async delete(id) {
      return await cl.deleteOne({
        _id: ObjectID(id),
      });
    },
  };
};

function createProductCollection(db) {
  if (db.listCollections({ name: "products" }).hasNext()) {
    db.createCollection("products", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "category_id"],
        },
      },
    });
  }
  return db.collection("products");
}