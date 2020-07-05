const express = require("express");
const multer = require('multer');

const router = express.Router();

const controller = require("../controllers/book.controller");

const upload = multer( {dest: './public/uploads/'} );

router.get("/", controller.index);
module.exports = router;
