const express = require("express");
const router = express.Router();

const controller = require('../controllers/user.controller');

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", controller.postCreate);

router.get("/:id", controller.get);

router.get("/:id/update", controller.update);

router.post("/update", controller.postUpdate);

router.get('/:id/delete', controller.delete)

module.exports = router;
