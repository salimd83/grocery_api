const request = require("supertest");
const app = require("../src/index");
const fs = require("fs");
const { cat1, cat2, prod1, prod2, newProd, sampleImg } = require("./seeds");
const { filenameFromUrl } = require("../src/function");

const productTestCases = describe("CRUD products", () => {
  it("should retrieve products", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });
  it("should retrieve products by category", async () => {
    const res = await request(app).get(`/products/categories/${cat1._id}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
  it("should add image", async () => {
    const res = await request(app)
      .put(`/products/${prod1._id}/image`)
      .attach("image", sampleImg);
    expect(res.status).toBe(200);
    expect(
      fs.existsSync(`./public/images/products/${filenameFromUrl(res.body.image)}`)
    ).toBe(true);
    fs.unlinkSync(`./public/images/products/${filenameFromUrl(res.body.image)}`);
  });
  it("should remove image", async () => {
    const filename = `./public/images/products/${filenameFromUrl(prod2.image[0])}`;
    fs.copyFileSync(sampleImg, filename);
    try {
      const res = await request(app)
        .delete(`/products/${prod2._id}/image`)
        .send({ image: prod2.image[0] });
      expect(res.status).toBe(200);
      expect(fs.existsSync(filename)).toBe(false);
    } catch (e) {
      if (fs.existsSync(filename)) fs.unlinkSync(filename);
    }
  });
  it("should delete product", async () => {
    const res = await request(app).delete(`/products/${prod1._id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({});
  });
  it("should create product", async () => {
    const res = await request(app).post(`/products`).send(newProd);
    expect(res.status).toBe(201);
    const res2 = await request(app).get(`/products/${res.body}`);
    expect(res2.body.name).toEqual("prod 4");
    expect(res2.body.category[0].name).toEqual(cat2.name);
  });
});

module.exports = productTestCases;