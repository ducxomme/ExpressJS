const express = require("express");
const multer = require('multer');

const router = express.Router();
const authApiMiddleware = require('../middleware/auth.middleware');

const controller = require("../controllers/book.controller");

const upload = multer( {dest: './public/uploads/'} );

router.get("/", controller.index);
router.post("/create", upload.single('image'), authApiMiddleware, controller.postCreate);
router.patch("/:id/update", authApiMiddleware, controller.update)
router.delete("/:id/delete", authApiMiddleware, controller.delete);
module.exports = router;