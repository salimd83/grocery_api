const { port } = require("../config");
const categoriesRouter = require("./routes/category");
const categoriesModel = require("./models/categories");
const handleError = require("./error");

module.exports = {
  server(app) {
    app.listen(port, () => console.log(`App is listening on port ${port}`));
  },
  setRoutes(app, categories) {
    app.use(categoriesRouter(categoriesModel(categories)));
    app.use(handleError);
  },
};
