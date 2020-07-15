const { port } = require("../config");
const categoriesRouter = require("./routes/category");
const categoriesModel = require("./models/categories");
const productsRouter = require("./routes/product");
const productsModel = require("./models/products");
const handleError = require("./error");

module.exports = {
  server(app) {
    app.listen(port, () => console.log(`App is listening on port ${port}`));
  },
  setRoutes(app, db) {
    const catModel = categoriesModel(db);
    const prodModel = productsModel(db);
    app.use(categoriesRouter(catModel));
    app.use(productsRouter(prodModel));
    app.use(handleError);
    return {
      catCollection: catModel.collection,
      prodCollection: prodModel.collection,
    }
  },
};
