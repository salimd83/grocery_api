const express = require("express");
const router = express.Router();

// params categories is the model
// the function will return the router
module.exports = categories => {
  router.get("/categories", async (req, res) => {
    try {
      res.send(await categories.get());
    } catch (e) {
      res
        .status(500)
        .send({ message: "Error while retrieve categories", error: e.message });
    }
  });
  // create categories
  router.post("/categories", async (req, res) => {
    try {
      res.status(201).send(await categories.create(req.body));
    } catch (e) {
      res
        .status(500)
        .send({
          message: "Error: could not create categories",
          error: e.message,
        });
    }
  });

  return router;
};
