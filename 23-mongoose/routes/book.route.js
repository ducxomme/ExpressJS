const express = require("express");
const multer = require('multer');

const router = express.Router();

const controller = require("../controllers/book.controller");

const upload = multer( {dest: './public/uploads/'} );

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create",
  upload.single('image'), 
  controller.postCreate
);

router.get("/:id/update", controller.update);

router.post("/update", controller.postUpdate);

router.get("/:id/delete", controller.delete);

module.exports = router;
