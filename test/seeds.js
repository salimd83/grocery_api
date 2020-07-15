const { ObjectID } = require("mongodb");
const { host } = require("../config");

const cat1 = {
  _id: ObjectID(),
  name: "cat 1",
};
const cat2 = {
  _id: ObjectID(),
  name: "cat 2",
};
cat2.image = `${host}/images/products/${cat2._id}${Date.now()}`;
const cat3 = {
  _id: ObjectID(),
  name: "cat 3",
  parent: cat1._id.toString(),
};
const newCat = {
  name: "cat 4",
  parent: cat1._id.toString(),
};

const prod1 = {
  _id: ObjectID(),
  name: "prod 1",
  category_id: cat1._id,
};
const prod2 = {
  _id: ObjectID(),
  name: "prod 2",
  category_id: cat1._id,
};
prod2.image = [`${host}/images/products/${prod2._id}${Date.now()}`];
const prod3 = {
  _id: ObjectID(),
  name: "prod 3",
  category_id: cat2._id,
};
const newProd = {
  _id: ObjectID(),
  name: "prod 4",
  category_id: cat2._id,
};

module.exports = {
  cat1,
  cat2,
  cat3,
  newCat,
  prod1,
  prod2,
  prod3,
  newProd,
  sampleImg: "./test/assets/sample.png",
};
