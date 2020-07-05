const express = require("express");
const router = express.Router();

const controller = require('../controllers/auth.controller');

router.post("/login", controller.postLogin);
router.post("/signup", controller.signUp);
// router.post("/reset", controller.resetPass);

module.exports = router;