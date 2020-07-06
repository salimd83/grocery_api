const express = require("express");
const router = express.Router();
const fs = require('fs');
const multer = require("multer");
const sharp = require("sharp");
const {host} = require('../../config');

// setting up the middleware
const upload = multer({
  limits: {
    filesize: 2 * 1024 * 1024,
    fileFilter(req, file, cb) {
      if(!file.originalname.match(/\.(jpeg|jpg|png|gif)$/)) {
        return cb(new Error("The uploaded file is not an image"));
      }
      cb(null, true)
    }
  }
});

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

  // update image
  router.put("/categories/:id/image", upload.single('image'), async (req, res, next) => {
    try {
      const filename = `${req.params.id}.${req.file.mimetype.substr(req.file.mimetype.lastIndexOf('/') + 1)}`;
      await sharp(req.file.buffer)
        .resize({ width: 250 })
        .toFile(`./public/images/${filename}`);
      await categories.addImage(req.params.id, `${host}/images/${filename}`);
      res.send()
    } catch (e) {
      next({status: 500, msg: "Error updating image category", e});
    }
  })

  // delete image
  router.delete("/categories/:id/image", async (req, res, next) => {
    try {
      fs.unlinkSync(`./public/images/${req.params.id}.${req.body.ext}`);
      await categories.deleteImage(req.params.id);
      res.send();
    } catch (e) {
      next({status: 500, msg: "Error deleting image category", e});
    }
  })

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
