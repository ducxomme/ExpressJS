const express = require("express");
const router = express.Router();

const controller = require('../controllers/transaction.controller');

router.get("/", controller.index);

router.post("/create", controller.postCreate);

router.get("/:id/complete", controller.complete);

module.exports = router;
