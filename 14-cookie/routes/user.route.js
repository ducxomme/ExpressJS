const express = require("express");
const router = express.Router();

const controller = require('../controllers/user.controller');
const middleware = require('../middleware/user.middleware');

router.get("/", controller.index);

// router.get("/cookie", (req, res, next) => {
//    res.cookie('user-id', 12345);
//    res.send('Hello');
// })

router.get("/create", controller.create);

router.post("/create", middleware.postCreate, controller.postCreate);

router.get("/:id", controller.get);

router.get("/:id/update", controller.update);

router.post("/update", controller.postUpdate);

router.get('/:id/delete', controller.delete)

module.exports = router;
