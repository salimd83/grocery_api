const express = require("express");
const router = express.Router();
const fs = require("fs");
const { host } = require("../../config");
const { upload, resize } = require("../middlewares/uploadImages");
const { filenameFromUrl } = require('../function');

// params products is the model
// the function will return the router
module.exports = (products) => {
  // retreive all products
  router.get("/products", async (req, res, next) => {
    try {
      res.send(await products.all());
    } catch (e) {
      next({ status: 500, msg: "Error retrieving products", e });
    }
  });

  // get a product
  router.get("/products/:id", async (req, res, next) => {
    try {
      res.send(await products.get(req.params.id));
    } catch (e) {
      next({ status: 500, msg: "Error occured", e });
    }
  });

  // get by category
  router.get("/products/categories/:id", async (req, res, next) => {
    try {
      res.send(await products.byCategory(req.params.id));
    } catch (e) {
      next({ status: 500, msg: "Error occured", e });
    }
  });

  // create products
  router.post("/products", async (req, res, next) => {
    try {
      if (!_validate_request(req.body)) throw new Error("Validation error");
      res.status(201).send(await products.create(req.body));
    } catch (e) {
      next({ status: 500, msg: "Error creating products", e });
    }
  });

  // update product
  router.put("/products/:id", async (req, res, next) => {
    try {
      await products.update(req.params.id, req.body);
      res.send();
    } catch (e) {
      next({ status: 500, msg: "Error updating product", e });
    }
  });

  // update image
  router.put(
    "/products/:id/image",
    upload.single("image"),
    async (req, res, next) => {
      try {
        const r = await resize(req, 250, "./public/images/products");
        await products.addImage(
          req.params.id,
          `${host}/images/products/${r.filename}`
        );
        res.send({ image:  `${host}/images/products/${r.filename}`});
      } catch (e) {
        next({ status: 500, msg: "Error updating product image", e });
      }
    }
  );

  // delete image
  router.delete("/products/:id/image", async (req, res, next) => {
    try {
      const img = req.body.image
      fs.unlinkSync(`./public/images/products/${filenameFromUrl(img)}`);
      await products.deleteImage(req.params.id, img);
      res.send();
    } catch (e) {
      next({ status: 500, msg: "Error deleting product image", e });
    }
  });

  router.delete("/products/:id", async (req, res, next) => {
    try {
      // remove images before deleting
      const r = await products.get(req.params.id);
      if (r.images)
        r.images.each(img => {
          fs.unlinkSync(`./public/images/products/${filenameFromUrl(img)}`)
        })
      await products.delete(req.params.id);
      res.send();
    } catch (e) {
      next({ status: 500, msg: "Error deleting product", e });
    }
  });

  return router;
};

function _validate_request(data) {
  return data.name && data.category_id;
}
