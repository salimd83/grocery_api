const express = require("express");
const router = express.Router();

// params categories is the model
// the function will return the router
module.exports = (categories) => {
  router.get("/categories", async (req, res) => {
    try {
      res.send(await categories.get());
    } catch (e) {
      res
        .status(500)
        .send({ msg: "Error retrieving categories", error: e.message });
    }
  });
  // create categories
  router.post("/categories", async (req, res) => {
    try {
      res.status(201).send(await categories.create(req.body));
    } catch (e) {
      res.status(500).send({
        msg: "Error creating categories",
        error: e.message,
      });
    }
  });

  router.put("/categories/:id", async (req, res) => {
    try {
      await categories.update(req.params.id, req.body);
      res.send();
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .send({ msg: "Error updating category", error: e.message });
    }
  });

  router.delete("/categories/:id", async (req, res) => {
    try {
      await categories.delete(req.params.id);
      res.send();
    } catch (e) {
      console.log(e);
      res.status(404).send({ msg: "category not found", error: e.message });
    }
  });

  return router;
};
