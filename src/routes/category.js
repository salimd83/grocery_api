const express = require("express");
const router = express.Router();

// params categories is the model
// the function will return the router
module.exports = (categories) => {
  router.get("/categories", async (req, res, next) => {
    try {
      res.send(await categories.all());
    } catch (e) {
      next({status: 500, msg: "Error retrieving categories", e});
    }
  });
  // get top categories
  router.get("/categories/top", async (req, res, next) => {
    try {
        res.send(await categories.top());
    } catch (e) {
      next({status: 500, msg: "Error occured", e});
    }
  });

  // get children
  router.get("/categories/:id", async (req, res, next) => {
    try {
        res.send(await categories.children(req.params.id));
    } catch (e) {
      next({status: 500, msg: "Error occured", e});
    }
  });

  // create categories
  router.post("/categories", async (req, res, next) => {
    try {
      res.status(201).send(await categories.create(req.body));
    } catch (e) {
      next({status: 500, msg: "Error creating categories", e});
    }
  });

  router.put("/categories/:id", async (req, res, next) => {
    try {
      await categories.update(req.params.id, req.body);
      res.send();
    } catch (e) {
      next({status: 500, msg: "Error updating category", e});
    }
  });

  router.delete("/categories/:id", async (req, res, next) => {
    try {
      await categories.delete(req.params.id);
      res.send();
    } catch (e) {
      next({status: 500, msg: "Error deleting category", e})
    }
  });

  return router;
};
