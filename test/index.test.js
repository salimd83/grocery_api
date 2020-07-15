const app = require("../src/index");
const connect = require("../db/connect");
const { setRoutes } = require("../src/setup");
const { cat1, cat2, cat3, prod1, prod2, prod3 } = require("./seeds");
const categoryTestcases = require('./category');
const productTestCases = require('./product');

var catCollection, prodCollection, client, db;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  ({ db, client } = await connect);
  ({ catCollection, prodCollection } = setRoutes(app, db));
});

afterAll(async () => {
  await client.close();
});

beforeEach(async () => {
  await prodCollection.deleteMany();
  await catCollection.deleteMany();
  await catCollection.insertMany([cat1, cat2, cat3]);
  await prodCollection.insertMany([prod1, prod2, prod3]);
});