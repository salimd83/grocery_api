const request = require("supertest");
const app = require("../src/index");
const fs = require("fs");
const { cat1, cat2, newCat, sampleImg } = require("./seeds");
const { filenameFromUrl } = require("../src/function");

const categoryTestCases = describe("CRUD categories", () => {
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
      .attach("image", sampleImg);
    expect(res.status).toBe(200);
    expect(
      fs.existsSync(`./public/images/${filenameFromUrl(res.body.image)}`)
    ).toBe(true);
    fs.unlinkSync(`./public/images/${filenameFromUrl(res.body.image)}`);
  });
  it("should remove image", async () => {
    const filename = `./public/images/${filenameFromUrl(cat2.image)}`;
    fs.copyFileSync(sampleImg, filename);
    try {
      const res = await request(app)
        .delete(`/categories/${cat1._id}/image`)
        .send({ image: cat2.image });
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

module.exports = categoryTestCases;