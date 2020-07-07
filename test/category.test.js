const request = require("supertest");
const app = require("../src/index");
const { ObjectID } = require("mongodb");
const fs = require("fs");
const connect = require("../db/connect");
const categoriesRouter = require("../src/routes/category");
const categoriesModel = require("../src/models/categories");
const handleError = require("../src/error");

var catCollection;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  return connect((categories) => {
    catCollection = categories;
    app.use(categoriesRouter(categoriesModel(categories)));
    app.use(handleError);
  });
});

const cat1 = {
  _id: ObjectID(),
  name: "cat 1",
};
const cat2 = {
  _id: ObjectID(),
  name: "cat 2",
};
const cat3 = {
  _id: ObjectID(),
  name: "cat 3",
  parent: cat1._id.toString(),
};
const newCat = {
  name: "cat 4",
  parent: cat1._id.toString(),
};

beforeEach(() => {
  seedDb(catCollection);
});

const seedDb = (catCollection) => {
  catCollection.deleteMany();
  catCollection.insertMany([cat1, cat2, cat3]);
};

describe("CRUD categories", () => {
  it("should retrieve categories with no child", async () => {
    const res = await request(app).get("/categories/top");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
  it("should retrieve categories with children", async () => {
    const res = await request(app).get(`/categories/${cat1._id}`);
    expect(res.status).toBe(200);
    expect(res.body.children.length).toBe(1);
    expect(res.body.name).toBe("cat 1");
  });
  it("should add image", async () => {
    const res = await request(app)
      .put(`/categories/${cat1._id}/image`)
      .attach("image", "./test/assets/bread.png");
    expect(res.status).toBe(200);
    expect(fs.existsSync(`./public/images/${cat1._id}.png`)).toBe(true);
    fs.unlinkSync(`./public/images/${cat1._id}.png`);
  });
  it("should remove image", async () => {
    const filename = `./public/images/${cat1._id}.png`;
    fs.copyFileSync("./test/assets/bread.png", filename);
    try {
      const res = await request(app)
        .delete(`/categories/${cat1._id}/image`)
        .send({ ext: "png" });
      expect(res.status).toBe(200);
      expect(fs.existsSync(filename)).toBe(false);
    } catch (e) {
      if (fs.existsSync(filename)) fs.unlinkSync(filename);
    }
  });
  it("should delete category", async () => {
    const res = await request(app).delete(`/categories/${cat1._id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({});
  });
  it("should create category", async () => {
    const res = await request(app).post(`/categories`).send(newCat);
    expect(res.status).toBe(201);
    const res2 = await request(app).get(`/categories/${res.body}`);
    expect(res2.body.name).toEqual("cat 4");
    expect(res2.body.parent).toEqual(cat1._id.toString());
  });
});
